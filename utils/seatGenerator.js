const seatGenerator = (flight_id) => {
  const seats = [];

  // Generate seats for First Class
  const firstClassRows = ["A", "B"];
  const firstClassColumns = [1, 2];
  firstClassColumns.forEach((column) => {
    firstClassRows.forEach((row) => {
      seats.push({
        seat_row: row,
        seat_column: `${column}`,
        seat_name: `${column}${row}`,
        flight_id: flight_id,
        class: "first_class",
        seat_status: "available",
      });
    });
  });

  // Generate seats for Business Class
  const businessClassRows = ["A", "B", "C", "D"];
  const businessClassColumns = [3, 4, 5, 6, 7];
  businessClassColumns.forEach((column) => {
    businessClassRows.forEach((row) => {
      seats.push({
        seat_row: row,
        seat_column: `${column}`,
        seat_name: `${column}${row}`,
        flight_id: flight_id,
        class: "business",
        seat_status: "available",
      });
    });
  });

  // Generate seats for Premium Economy
  const premiumEconomyRows = ["A", "B", "C", "D"];
  const premiumEconomyColumns = [8, 9, 10, 11, 12, 13];
  premiumEconomyColumns.forEach((column) => {
    premiumEconomyRows.forEach((row) => {
      seats.push({
        seat_row: row,
        seat_column: `${column}`,
        seat_name: `${column}${row}`,
        flight_id: flight_id,
        class: "premium_economy",
        seat_status: "available",
      });
    });
  });

  // Generate seats for Economy Class
  const economyRows = ["A", "B", "C", "D", "E", "F"];
  const economyColumns = Array.from({ length: 12 }, (_, i) => i + 12);
  economyColumns.forEach((column) => {
    economyRows.forEach((row) => {
      seats.push({
        seat_row: row,
        seat_column: `${column}`,
        seat_name: `${column}${row}`,
        flight_id: flight_id,
        class: "economy",
        seat_status: "available",
      });
    });
  });

  return seats;
};
