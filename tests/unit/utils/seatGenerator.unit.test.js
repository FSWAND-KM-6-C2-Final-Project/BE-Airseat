const seatGenerator = require("../../../utils/seatGenerator");

describe("[SEAT GENERATOR UNIT TESTS]", () => {
  const flight_id = "FL123";

  test("should generate the correct number of seats", () => {
    const seats = seatGenerator(flight_id);
    expect(seats.length).toBe(120);
  });

  test("should generate the correct seats for first class", () => {
    const seats = seatGenerator(flight_id);
    const firstClassSeats = seats.filter(
      (seat) => seat.class === "first_class"
    );
    expect(firstClassSeats.length).toBe(4);
    expect(firstClassSeats).toEqual(
      expect.arrayContaining([
        {
          seat_row: "A",
          seat_column: "1",
          seat_name: "1A",
          flight_id: flight_id,
          class: "first_class",
          seat_status: "available",
        },
        {
          seat_row: "A",
          seat_column: "2",
          seat_name: "2A",
          flight_id: flight_id,
          class: "first_class",
          seat_status: "available",
        },
        {
          seat_row: "B",
          seat_column: "1",
          seat_name: "1B",
          flight_id: flight_id,
          class: "first_class",
          seat_status: "available",
        },
        {
          seat_row: "B",
          seat_column: "2",
          seat_name: "2B",
          flight_id: flight_id,
          class: "first_class",
          seat_status: "available",
        },
      ])
    );
  });

  test("should generate the correct seats for business class", () => {
    const seats = seatGenerator(flight_id);
    const businessClassSeats = seats.filter(
      (seat) => seat.class === "business"
    );
    expect(businessClassSeats.length).toBe(20);
    expect(businessClassSeats).toEqual(
      expect.arrayContaining([
        {
          seat_row: "A",
          seat_column: "3",
          seat_name: "3A",
          flight_id: flight_id,
          class: "business",
          seat_status: "available",
        },
        {
          seat_row: "D",
          seat_column: "7",
          seat_name: "7D",
          flight_id: flight_id,
          class: "business",
          seat_status: "available",
        },
      ])
    );
  });

  test("should generate the correct seats for premium economy class", () => {
    const seats = seatGenerator(flight_id);
    const premiumEconomySeats = seats.filter(
      (seat) => seat.class === "premium_economy"
    );
    expect(premiumEconomySeats.length).toBe(24);
    expect(premiumEconomySeats).toEqual(
      expect.arrayContaining([
        {
          seat_row: "A",
          seat_column: "8",
          seat_name: "8A",
          flight_id: flight_id,
          class: "premium_economy",
          seat_status: "available",
        },
        {
          seat_row: "D",
          seat_column: "13",
          seat_name: "13D",
          flight_id: flight_id,
          class: "premium_economy",
          seat_status: "available",
        },
      ])
    );
  });

  test("should generate the correct seats for economy class", () => {
    const seats = seatGenerator(flight_id);
    const economySeats = seats.filter((seat) => seat.class === "economy");
    expect(economySeats.length).toBe(72);
    expect(economySeats).toEqual(
      expect.arrayContaining([
        {
          seat_row: "A",
          seat_column: "12",
          seat_name: "12A",
          flight_id: flight_id,
          class: "economy",
          seat_status: "available",
        },
        {
          seat_row: "F",
          seat_column: "23",
          seat_name: "23F",
          flight_id: flight_id,
          class: "economy",
          seat_status: "available",
        },
      ])
    );
  });
});
