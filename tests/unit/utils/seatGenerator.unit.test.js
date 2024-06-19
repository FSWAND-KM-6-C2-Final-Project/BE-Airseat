const seatGenerator = require("../../../utils/seatGenerator");

describe("[SEAT GENERATOR UNIT TESTS]", () => {
  test("Generates correct seats for a given flight_id", () => {
    const flight_id = 12345;
    const seats = seatGenerator(flight_id);

    expect(seats.length).toBe(120);

    expect(seats[0]).toEqual({
      seat_row: "A",
      seat_column: "12",
      seat_name: "12A",
      flight_id: flight_id,
      class: "economy",
      seat_status: "available",
    });

    expect(seats[71]).toEqual({
      seat_row: "F",
      seat_column: "23",
      seat_name: "23F",
      flight_id: flight_id,
      class: "economy",
      seat_status: "available",
    });

    expect(seats[72]).toEqual({
      seat_row: "A",
      seat_column: "8",
      seat_name: "8A",
      flight_id: flight_id,
      class: "premium_economy",
      seat_status: "available",
    });

    expect(seats[95]).toEqual({
      seat_row: "D",
      seat_column: "13",
      seat_name: "13D",
      flight_id: flight_id,
      class: "premium_economy",
      seat_status: "available",
    });

    expect(seats[96]).toEqual({
      seat_row: "A",
      seat_column: "3",
      seat_name: "3A",
      flight_id: flight_id,
      class: "business",
      seat_status: "available",
    });

    expect(seats[115]).toEqual({
      seat_row: "D",
      seat_column: "7",
      seat_name: "7D",
      flight_id: flight_id,
      class: "business",
      seat_status: "available",
    });

    expect(seats[116]).toEqual({
      seat_row: "A",
      seat_column: "1",
      seat_name: "1A",
      flight_id: flight_id,
      class: "first_class",
      seat_status: "available",
    });

    expect(seats[119]).toEqual({
      seat_row: "B",
      seat_column: "2",
      seat_name: "2B",
      flight_id: flight_id,
      class: "first_class",
      seat_status: "available",
    });

    seats.forEach((seat) => {
      expect(seat.flight_id).toBe(flight_id);
    });
  });
});
