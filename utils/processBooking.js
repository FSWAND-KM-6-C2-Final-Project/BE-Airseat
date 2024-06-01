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
  const transaction = await sequelize.transaction(); // Mulai transaksi
  try {
    // 1. Dapatkan informasi penerbangan
    const flight = await Flights.findByPk(input.flight_id);
    if (!flight) {
      throw new Error("Flight not found");
    }

    const bookingCode = generateBookingCode();

    // 2. Simpan informasi pemesanan di tabel Bookings
    const booking = await Bookings.create(
      {
        booking_code: bookingCode,
        flight_id: input.flight_id,
        discount_id: input.discount_id,
        ordered_by_first_name: input.ordered_by.first_name,
        ordered_by_last_name: input.ordered_by.last_name,
        ordered_by_phone_number: input.ordered_by.phone_number,
        ordered_by_email: input.ordered_by.email,
        total_amount: 0, // Akan dihitung kemudian
        booking_expired: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 jam dari sekarang
        booking_status: "unpaid",
        user_id: userId,
      },
      { transaction }
    );

    // 3. Simpan informasi penumpang dan detail pemesanan di tabel Passengers dan Booking_Details
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

      // Update status kursi menjadi locked
      await seat.update({ seat_status: "locked" }, { transaction });

      totalAmount += seatPrice;
      itemDetails.push({
        id: bookingCode,
        name: `Seat ${p.seat.seat_row}${p.seat.seat_column} for ${p.first_name} ${p.last_name}`,
        price: seatPrice,
        quantity: 1,
      });
    }

    // 4. Hitung total amount termasuk diskon
    if (input.discount_id) {
      const discount = await Discounts.findByPk(input.discount_id, {
        transaction,
      });
      if (discount) {
        const discountAmount = (totalAmount * discount.discount_amount) / 100;
        totalAmount = totalAmount - discountAmount;
      }
    }

    // 5. Update total amount di tabel Bookings
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

    const sellerDetails = {
      name: "Airseat",
      url: "https://airseat.netlify.com",
    };

    let parameter;

    switch (input.payment_method) {
      case "gopay":
        parameter = {
          payment_type: "gopay",
          transaction_details: {
            order_id: bookingCode,
            gross_amount: totalAmount,
          },
          customer_details: customerDetails,
          seller_details: sellerDetails,
          item_details: itemDetails,
        };
        break;
      case "va_bni":
        parameter = {
          payment_type: "bank_transfer",
          transaction_details: {
            order_id: bookingCode,
            gross_amount: totalAmount,
            customer_details: customerDetails,
            seller_details: sellerDetails,
            item_details: itemDetails,
          },
          bank_transfer: {
            bank: "bni",
          },
        };
      case "va_bri":
        parameter = {
          payment_type: "bank_transfer",
          transaction_details: {
            order_id: bookingCode,
            gross_amount: totalAmount,
            customer_details: customerDetails,
            seller_details: sellerDetails,
            item_details: itemDetails,
          },
          bank_transfer: {
            bank: "bri",
          },
        };
      case "va_mandiri":
        parameter = {
          payment_type: "echannel",
          transaction_details: {
            order_id: bookingCode,
            gross_amount: totalAmount,
            customer_details: customerDetails,
            seller_details: sellerDetails,
            item_details: itemDetails,
          },
          echannel: {
            bill_info1: "Payment:",
            bill_info2: "Online purchase",
          },
        };

      case "va_bca":
        parameter = {
          payment_type: "bank_transfer",
          transaction_details: {
            order_id: bookingCode,
            gross_amount: totalAmount,
            customer_details: customerDetails,
            seller_details: sellerDetails,
            item_details: itemDetails,
          },
          bank_transfer: {
            bank: "bca",
          },
        };

      case "va_cimb":
        parameter = {
          payment_type: "bank_transfer",
          transaction_details: {
            order_id: bookingCode,
            gross_amount: totalAmount,
            customer_details: customerDetails,
            seller_details: sellerDetails,
            item_details: itemDetails,
          },
          bank_transfer: {
            bank: "cimb",
          },
        };

      case "va_permata":
        parameter = {
          payment_type: "permata",
          transaction_details: {
            order_id: bookingCode,
            gross_amount: totalAmount,
            customer_details: customerDetails,
            seller_details: sellerDetails,
            item_details: itemDetails,
          },
        };
    }

    const chargeMidtrans = await coreApi.charge(parameter);

    //   Update Payment ID
    await booking.update(
      { payment_id: chargeMidtrans.transaction_id },
      { transaction }
    );

    // Commit transaksi jika semuanya sukses
    await transaction.commit();

    const returnData = {
      booking,
      payment_data: chargeMidtrans,
    };

    return returnData;
  } catch (error) {
    await transaction.rollback();
    throw error;
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
