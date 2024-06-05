const seatGenerator = (flight_id) => {
  const rows = ["A", "B", "C", "D", "E", "F"];
  const columns = Array.from({ length: 12 }, (_, i) => i + 1);
  const seats = [];

  rows.forEach((row) => {
    columns.forEach((column) => {
      seats.push({
        seat_row: row,
        seat_column: column,
        seat_name: `${column}${row}`,
        flight_id: flight_id,
        class: "economy",
        seat_status: "available",
      });
    });
  });

  return seats;
};

module.exports = seatGenerator;
