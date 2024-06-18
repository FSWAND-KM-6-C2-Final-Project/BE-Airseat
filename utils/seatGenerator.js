const seatGenerator = (flight_id) => {
  const economyRows = ["A", "B", "C", "D", "E", "F"];
  const economyColumns = Array.from({ length: 12 }, (_, i) => i + 1);

  const premiumEconomyRows = ["A", "B", "C", "D"];
  const premiumEconomyColumns = Array.from({ length: 6 }, (_, i) => i + 1);

  const businessRows = ["A", "B", "C", "D"];
  const businessColumns = Array.from({ length: 5 }, (_, i) => i + 1);

  const firstClassRows = ["A", "B"];
  const firstClassColumns = ["1FC", "2FC"];

  const seats = [];

  // Generate seats for Economy class
  economyRows.forEach((row) => {
    economyColumns.forEach((column) => {
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

  // Generate seats for Premium Economy class
  premiumEconomyColumns.forEach((column) => {
    premiumEconomyRows.forEach((row) => {
      seats.push({
        seat_row: row,
        seat_column: `${column}PE`,
        seat_name: `${column}PE-${row}`,
        flight_id: flight_id,
        class: "premium_economy",
        seat_status: "available",
      });
    });
  });

  // Generate seats for Business class
  businessColumns.forEach((column) => {
    businessRows.forEach((row) => {
      seats.push({
        seat_row: row,
        seat_column: `${column}BC`,
        seat_name: `${column}BC-${row}`,
        flight_id: flight_id,
        class: "business",
        seat_status: "available",
      });
    });
  });

  // Generate seats for First class
  firstClassColumns.forEach((column) => {
    firstClassRows.forEach((row) => {
      seats.push({
        seat_row: row,
        seat_column: `${column}`,
        seat_name: `${column}-${row}`,
        flight_id: flight_id,
        class: "first_class",
        seat_status: "available",
      });
    });
  });

  return seats;
};
