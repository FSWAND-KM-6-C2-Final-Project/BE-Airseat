const seatGenerator = require("../../../utils/seatGenerator");

describe("[SEAT GENERATOR UTILS UNIT TESTING]", () => {
  const flight_id = "FL123";

  test("should generate correct first class seats", () => {
    const seats = seatGenerator(flight_id);
    const firstClassSeats = seats.filter(
      (seat) => seat.class === "first_class"
    );

    expect(firstClassSeats.length).toBe(4);
    expect(firstClassSeats).toEqual([
      {
        seat_row: "A",
        seat_column: "1",
        seat_name: "1A",
        flight_id,
        class: "first_class",
        seat_status: "available",
      },
      {
        seat_row: "B",
        seat_column: "1",
        seat_name: "1B",
        flight_id,
        class: "first_class",
        seat_status: "available",
      },
      {
        seat_row: "A",
        seat_column: "2",
        seat_name: "2A",
        flight_id,
        class: "first_class",
        seat_status: "available",
      },
      {
        seat_row: "B",
        seat_column: "2",
        seat_name: "2B",
        flight_id,
        class: "first_class",
        seat_status: "available",
      },
    ]);
  });

  test("should generate correct business class seats", () => {
    const seats = seatGenerator(flight_id);
    const businessClassSeats = seats.filter(
      (seat) => seat.class === "business"
    );

    expect(businessClassSeats.length).toBe(20);
    // Add more specific checks if needed
  });

  test("should generate correct premium economy seats", () => {
    const seats = seatGenerator(flight_id);
    const premiumEconomySeats = seats.filter(
      (seat) => seat.class === "premium_economy"
    );

    expect(premiumEconomySeats.length).toBe(24);
    // Add more specific checks if needed
  });

  test("should generate correct economy class seats", () => {
    const seats = seatGenerator(flight_id);
    const economyClassSeats = seats.filter((seat) => seat.class === "economy");

    expect(economyClassSeats.length).toBe(72);
    expect(economyClassSeats[0]).toEqual({
      seat_row: "A",
      seat_column: "14",
      seat_name: "14A",
      flight_id,
      class: "economy",
      seat_status: "available",
    });
    expect(economyClassSeats[economyClassSeats.length - 1]).toEqual({
      seat_row: "F",
      seat_column: "25",
      seat_name: "25F",
      flight_id,
      class: "economy",
      seat_status: "available",
    });
  });
});
