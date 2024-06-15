const seatGenerator = require("../../../utils/seatGenerator");

describe("[SEAT GENERATOR UNIT TESTS]", () => {
  test("generates correct seats for a given flight_id", () => {
    const flight_id = 12345;
    const seats = seatGenerator(flight_id);

    expect(seats.length).toBe(72);

    expect(seats[0]).toEqual({
      seat_row: "A",
      seat_column: 1,
      seat_name: "1A",
      flight_id: flight_id,
      class: "economy",
      seat_status: "available",
    });

    expect(seats[71]).toEqual({
      seat_row: "F",
      seat_column: 12,
      seat_name: "12F",
      flight_id: flight_id,
      class: "economy",
      seat_status: "available",
    });

    seats.forEach((seat) => {
      expect(seat.flight_id).toBe(flight_id);
    });
  });
});
