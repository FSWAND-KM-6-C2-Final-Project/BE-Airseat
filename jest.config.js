module.exports = {
  testEnvironment: "node",
  verbose: true,
  coveragePathIgnorePatterns: [
    "<rootDir>/config/",
    "<rootDir>/node_modules/",
    "<rootDir>/controllers/adminAirlineController.js",
    "<rootDir>/controllers/adminFlightController.js",
    "<rootDir>/controllers/adminNotificationController.js",
    "<rootDir>/utils/processBooking.js",
  ],
};
