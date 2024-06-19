const seatGenerator = require("../../../utils/seatGenerator");

describe("[SEAT GENERATOR UNIT TESTS]", () => {
  test("generates correct seats for a given flight_id", () => {
    const flight_id = 12345;
    const seats = seatGenerator(flight_id);

    // Total number of seats: 72 (Economy) + 24 (Premium Economy) + 20 (Business) + 4 (First Class) = 120
    expect(seats.length).toBe(120);

    // Check first Economy seat
    expect(seats[0]).toEqual({
      seat_row: "A",
      seat_column: "1",
      seat_name: "1A",
      flight_id: flight_id,
      class: "economy",
      seat_status: "available",
    });

    // Check last Economy seat
    expect(seats[71]).toEqual({
      seat_row: "F",
      seat_column: "12",
      seat_name: "12F",
      flight_id: flight_id,
      class: "economy",
      seat_status: "available",
    });

    // Check first Premium Economy seat
    expect(seats[72]).toEqual({
      seat_row: "A",
      seat_column: "1PE",
      seat_name: "1PE-A",
      flight_id: flight_id,
      class: "premium_economy",
      seat_status: "available",
    });

    // Check last Premium Economy seat
    expect(seats[95]).toEqual({
      seat_row: "D",
      seat_column: "6PE",
      seat_name: "6PE-D",
      flight_id: flight_id,
      class: "premium_economy",
      seat_status: "available",
    });

    // Check first Business seat
    expect(seats[96]).toEqual({
      seat_row: "A",
      seat_column: "1BC",
      seat_name: "1BC-A",
      flight_id: flight_id,
      class: "business",
      seat_status: "available",
    });

    // Check last Business seat
    expect(seats[115]).toEqual({
      seat_row: "D",
      seat_column: "5BC",
      seat_name: "5BC-D",
      flight_id: flight_id,
      class: "business",
      seat_status: "available",
    });

    // Check first First Class seat
    expect(seats[116]).toEqual({
      seat_row: "A",
      seat_column: "1FC",
      seat_name: "1FC-A",
      flight_id: flight_id,
      class: "first_class",
      seat_status: "available",
    });

    // Check last First Class seat
    expect(seats[119]).toEqual({
      seat_row: "B",
      seat_column: "2FC",
      seat_name: "2FC-B",
      flight_id: flight_id,
      class: "first_class",
      seat_status: "available",
    });

    // Check that all seats have the correct flight_id
    seats.forEach((seat) => {
      expect(seat.flight_id).toBe(flight_id);
    });
  });
});
