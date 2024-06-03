const midtransClient = require("midtrans-client");

const {
  Bookings,
  Booking_Details,
  Passengers,
  Seats,
  Discounts,
  Flights,
  sequelize,
} = require("../models");

const coreApi = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

const processBooking = async (input, userId) => {
  const transaction = await sequelize.transaction();
  try {
    // Get flight information
    const flight = await Flights.findByPk(input.flight_id);
    if (!flight) {
      throw new Error("Flight not found");
    }

    const bookingCode = generateBookingCode();

    // Save flight to booking data
    const booking = await Bookings.create(
      {
        booking_code: bookingCode,
        flight_id: input.flight_id,
        payment_method: input.payment_method,
        discount_id: input.discount_id,
        ordered_by_first_name: input.ordered_by.first_name,
        ordered_by_last_name: input.ordered_by.last_name,
        ordered_by_phone_number: input.ordered_by.phone_number,
        ordered_by_email: input.ordered_by.email,
        total_amount: 0,
        booking_expired: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 jam dari sekarang
        booking_status: "unpaid",
        user_id: userId,
      },
      { transaction }
    );

    // save passenger data and seat in booking_details
    let totalAmount = 0;
    const itemDetails = [];

    for (const p of input.passenger) {
      const passenger = await Passengers.create(
        {
          first_name: p.first_name,
          last_name: p.last_name,
          dob: p.dob,
          nationality: p.nationality,
          identification_type: p.identification_type,
          identification_number: p.identification_number,
          identification_country: p.identification_country,
          identification_expired: p.identification_expired,
        },
        { transaction }
      );

      const seat = await Seats.findOne({
        where: {
          seat_row: p.seat.seat_row,
          seat_column: p.seat.seat_column,
          flight_id: input.flight_id,
          seat_status: "available",
        },
        transaction,
      });

      if (!seat) {
        throw new Error(
          `Seat ${p.seat.seat_row}${p.seat.seat_column} is not available`
        );
      }

      // Get seat data price
      const seatPrice = parseFloat(getSeatPrice(flight, seat.class));

      await Booking_Details.create(
        {
          seat_id: seat.id,
          booking_id: booking.id,
          passenger_id: passenger.id,
          price: seatPrice,
        },
        { transaction }
      );

      // Update seat status to locked
      await seat.update({ seat_status: "locked" }, { transaction });

      totalAmount += seatPrice;
      itemDetails.push({
        id: bookingCode,
        name: `Seat ${p.seat.seat_row}${p.seat.seat_column} for ${p.first_name} ${p.last_name}`,
        price: seatPrice,
        quantity: 1,
      });
    }

    // Total amount if there is discount
    if (input.discount_id) {
      const discount = await Discounts.findByPk(input.discount_id, {
        transaction,
      });
      if (discount) {
        const discountAmount = (totalAmount * discount.discount_amount) / 100;
        totalAmount = totalAmount - discountAmount;
        itemDetails.push({
          name: `Discount ${discount.discount_amount}% from Airseat`,
          price: -discountAmount,
          quantity: 1,
        });
      }
    }

    // Update total amount
    await booking.update({ total_amount: totalAmount }, { transaction });

    const customerDetails = {
      first_name: input.ordered_by.first_name,
      last_name: input.ordered_by.last_name,
      phone: input.ordered_by.phone_number,
      email: input.ordered_by.email,
      billing_address: {
        first_name: input.ordered_by.first_name,
        last_name: input.ordered_by.last_name,
        phone: input.ordered_by.phone_number,
        email: input.ordered_by.email,
      },
    };

    let chargeMidtrans;
    const paymentMethod = input.payment_method;

    // Process payment
    if (paymentMethod === "card") {
      const tokenParameter = {
        card_number: input.card_detail.card_number,
        card_exp_month: input.card_detail.card_exp_month,
        card_exp_year: input.card_detail.card_exp_year,
        card_cvv: input.card_detail.card_cvv,
        client_key: process.env.MIDTRANS_CLIENT_KEY,
      };

      const tokenResponse = await coreApi.cardToken(tokenParameter);

      const tokenId = tokenResponse.token_id;

      const cardParams = {
        payment_type: "credit_card",
        transaction_details: {
          gross_amount: 12145,
          order_id: orderId,
        },
        credit_card: {
          token_id: tokenId,
          authentication: true,
        },
        customer_details: customerDetails,
        item_details: itemDetails,
      };

      chargeMidtrans = await coreApi.charge(cardParams);
    } else if (paymentMethod === "gopay") {
      let parameter = {
        payment_type: "gopay",
        transaction_details: {
          order_id: bookingCode,
          gross_amount: totalAmount,
        },
        customer_details: customerDetails,
        item_details: itemDetails,
      };

      chargeMidtrans = await coreApi.charge(parameter);
    } else if (
      paymentMethod === "va_bni" ||
      paymentMethod === "va_bca" ||
      paymentMethod === "va_bri" ||
      paymentMethod === "va_cimb"
    ) {
      let parameter = {
        payment_type: "bank_transfer",
        transaction_details: {
          order_id: bookingCode,
          gross_amount: totalAmount,
        },
        customer_details: customerDetails,
        item_details: itemDetails,
        bank_transfer: {
          bank: paymentMethod.replace("va_", ""),
        },
      };

      chargeMidtrans = await coreApi.charge(parameter);
    } else if (paymentMethod === "va_permata") {
      let parameter = {
        payment_type: paymentMethod.replace("va_", ""),
        transaction_details: {
          order_id: bookingCode,
          gross_amount: totalAmount,
        },
        customer_details: customerDetails,
        item_details: itemDetails,
      };

      chargeMidtrans = await coreApi.charge(parameter);
    } else if (paymentMethod === "va_mandiri") {
      let parameter = {
        payment_type: "echannel",
        transaction_details: {
          order_id: bookingCode,
          gross_amount: totalAmount,
        },
        echannel: {
          bill_info1: "Payment:",
          bill_info2: "Online purchase",
        },
        customer_details: customerDetails,
        item_details: itemDetails,
      };

      chargeMidtrans = await coreApi.charge(parameter);
    } else {
      throw new Error("Payment method is not valid");
    }

    await booking.update(
      { payment_id: chargeMidtrans.transaction_id },
      { transaction }
    );

    await transaction.commit();

    const returnData = {
      booking,
      payment_data: chargeMidtrans,
    };

    return returnData;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

const getSeatPrice = (flight, seatClass) => {
  switch (seatClass) {
    case "economy":
      return flight.price_economy;
    case "premium_economy":
      return flight.price_premium_economy;
    case "business":
      return flight.price_business;
    case "first_class":
      return flight.price_first_class;
    default:
      throw new Error("Unknown seat class");
  }
};

const generateBookingCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let bookingCode = "";
  for (let i = 0; i < 8; i++) {
    bookingCode += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return bookingCode;
};

module.exports = processBooking;
