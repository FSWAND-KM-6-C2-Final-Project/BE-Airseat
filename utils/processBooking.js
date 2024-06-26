const midtransClient = require("midtrans-client");
const dayjs = require("dayjs");
const localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);

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

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

const processBooking = async (input, userId) => {
  const transaction = await sequelize.transaction();
  try {
    // Get flight information
    const flight = await Flights.findByPk(input.flight_id);
    if (!flight) {
      throw new Error("Flight not found");
    }

    if (input.return_flight_id) {
      const returnFlight = await Flights.findByPk(input.return_flight_id);
      if (!returnFlight) {
        throw new Error("Return Flight not found");
      }
    }

    const bookingCode = generateBookingCode();

    // Save flight to booking data
    const booking = await Bookings.create(
      {
        booking_code: bookingCode,
        flight_id: input.flight_id,
        return_flight_id: input.return_flight_id || null,
        payment_method: input.payment_method,
        discount_id: input.discount_id,
        ordered_by_first_name: input.ordered_by.first_name,
        ordered_by_last_name: input.ordered_by.last_name,
        ordered_by_phone_number: input.ordered_by.phone_number,
        ordered_by_email: input.ordered_by.email,
        total_amount: 0,
        booking_expired: dayjs().add(1, "day").format(), // 1 hari dari sekarang
        booking_status: "unpaid",
        user_id: userId,
      },
      { transaction }
    );

    const validPassengerTypes = ["adult", "infant", "children"];

    for (const passenger of input.passenger) {
      if (!validPassengerTypes.includes(passenger.passenger_type)) {
        throw new Error(
          `Invalid passenger type: ${passenger.passenger_type}, passenger_type should be 'adult', 'infant', or 'children'`
        );
      }
    }

    const processFlightDetails = async (flightId, seatField) => {
      let totalAmount = 0;
      const itemDetails = [];

      const adults = input.passenger.filter(
        (p) => p.passenger_type === "adult"
      );
      const infants = input.passenger.filter(
        (p) => p.passenger_type === "infant"
      );
      const childrens = input.passenger.filter(
        (p) => p.passenger_type === "children"
      );

      if (infants.length > adults.length) {
        throw new Error("Each infant must be accompanied by an adult");
      }

      const flight = await Flights.findByPk(flightId);
      if (!flight) {
        throw new Error("Flight not found");
      }

      const adultSeatsMap = new Map();
      for (const adult of adults) {
        const adultSeatKey = `${adult[seatField].seat_row}${adult[seatField].seat_column}`;
        adultSeatsMap.set(adultSeatKey, adult);
      }

      for (const p of adults) {
        const passenger = await Passengers.create(
          {
            first_name: p.first_name,
            last_name: p.last_name,
            dob: p.dob,
            title: p.title,
            nationality: p.nationality,
            identification_type: p.identification_type,
            identification_number: p.identification_number,
            identification_country: p.identification_country || null,
            identification_expired: p.identification_expired || null,
            passenger_type: p.passenger_type || "adult",
          },
          { transaction }
        );

        const seat = await Seats.findOne({
          where: {
            seat_row: p[seatField].seat_row,
            seat_column: p[seatField].seat_column,
            flight_id: flightId,
            seat_status: "available",
          },
          transaction,
        });

        if (!seat) {
          throw new Error(
            `Seat ${p[seatField].seat_row}${p[seatField].seat_column} for flight ${flight.flight_number} is not available`
          );
        }

        const seatPrice = parseFloat(getSeatPrice(flight, seat.class));

        await Booking_Details.create(
          {
            seat_id: seat.id,
            booking_id: booking.id,
            passenger_id: passenger.id,
            flight_id: flightId,
            price: seatPrice,
          },
          { transaction }
        );

        await seat.update({ seat_status: "locked" }, { transaction });

        totalAmount += seatPrice;

        itemDetails.push({
          id: bookingCode,
          name: `#${flight.flight_number} - Seat ${p[seatField].seat_row}${p[seatField].seat_column} - ${p.passenger_type}`,
          price: seatPrice,
          quantity: 1,
        });

        const adultSeatKey = `${p[seatField].seat_row}${p[seatField].seat_column}`;
        adultSeatsMap.set(adultSeatKey, { ...p, seat_id: seat.id });
      }

      for (const p of childrens) {
        const passenger = await Passengers.create(
          {
            first_name: p.first_name,
            last_name: p.last_name,
            dob: p.dob,
            title: p.title,
            nationality: p.nationality,
            identification_type: p.identification_type,
            identification_number: p.identification_number,
            identification_country: p.identification_country || null,
            identification_expired: p.identification_expired || null,
            passenger_type: p.passenger_type || "childrens",
          },
          { transaction }
        );

        const seat = await Seats.findOne({
          where: {
            seat_row: p[seatField].seat_row,
            seat_column: p[seatField].seat_column,
            flight_id: flightId,
            seat_status: "available",
          },
          transaction,
        });

        if (!seat) {
          throw new Error(
            `Seat ${p[seatField].seat_row}${p[seatField].seat_column} for flight ${flight.flight_number} is not available`
          );
        }

        const seatPrice = parseFloat(getSeatPrice(flight, seat.class));

        await Booking_Details.create(
          {
            seat_id: seat.id,
            booking_id: booking.id,
            passenger_id: passenger.id,
            flight_id: flightId,
            price: seatPrice,
          },
          { transaction }
        );

        await seat.update({ seat_status: "locked" }, { transaction });

        totalAmount += seatPrice;

        itemDetails.push({
          id: bookingCode,
          name: `#${flight.flight_number} - Seat ${p[seatField].seat_row}${p[seatField].seat_column} - ${p.passenger_type}`,
          price: seatPrice,
          quantity: 1,
        });
      }

      for (const p of infants) {
        const infantSeatKey = `${p[seatField].seat_row}${p[seatField].seat_column}`;
        const accompanyingAdult = adultSeatsMap.get(infantSeatKey);

        if (!accompanyingAdult) {
          throw new Error(
            `Infant must have the same seat as an accompanying adult. Seat ${infantSeatKey} is not assigned to any accompanying adult.`
          );
        }

        const passenger = await Passengers.create(
          {
            first_name: p.first_name,
            last_name: p.last_name,
            dob: p.dob,
            title: p.title,
            nationality: p.nationality,
            identification_type: p.identification_type,
            identification_number: p.identification_number,
            identification_country: p.identification_country || null,
            identification_expired: p.identification_expired || null,
            passenger_type: p.passenger_type || "infant",
          },
          { transaction }
        );

        await Booking_Details.create(
          {
            seat_id: accompanyingAdult.seat_id,
            booking_id: booking.id,
            passenger_id: passenger.id,
            flight_id: flightId,
            price: 0,
          },
          { transaction }
        );

        itemDetails.push({
          id: bookingCode,
          name: `#${flight.flight_number} - Infant`,
          price: 0,
          quantity: 1,
        });
      }

      return { totalAmount, itemDetails };
    };

    const departureDetails = await processFlightDetails(
      input.flight_id,
      "seat_departure"
    );
    let totalAmount = departureDetails.totalAmount;
    let itemDetails = departureDetails.itemDetails;

    if (input.return_flight_id) {
      const returnDetails = await processFlightDetails(
        input.return_flight_id,
        "seat_return"
      );
      totalAmount += returnDetails.totalAmount;
      itemDetails = itemDetails.concat(returnDetails.itemDetails);
    }

    // Total amount if there is discount
    if (input.discount_id) {
      const discount = await Discounts.findByPk(input.discount_id, {
        transaction,
      });

      if (discount) {
        if (totalAmount >= discount.minimum_order) {
          if (dayjs().isBefore(discount.discount_expired)) {
            const discountAmount =
              (totalAmount * discount.discount_amount) / 100;
            totalAmount = totalAmount - discountAmount;
            itemDetails.push({
              name: `Discount ${discount.discount_amount}% from Airseat`,
              price: -discountAmount,
              quantity: 1,
            });
          } else {
            throw new Error("Discount is expired");
          }
        } else {
          throw new Error("Discount does not meet the minimum order");
        }
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
    } else if (paymentMethod === "snap") {
      let parameter = {
        transaction_details: {
          order_id: bookingCode,
          gross_amount: totalAmount,
        },
        credit_card: {
          secure: true,
        },
        customer_details: customerDetails,
        item_details: itemDetails,
      };

      chargeMidtrans = await snap.createTransaction(parameter);

      await booking.update(
        {
          payment_url: chargeMidtrans.redirect_url,
          payment_token: chargeMidtrans.token,
        },
        { transaction }
      );
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
