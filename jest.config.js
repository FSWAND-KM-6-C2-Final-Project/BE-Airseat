module.exports = {
  testEnvironment: "node",
  verbose: true,
  coveragePathIgnorePatterns: [
    "<rootDir>/config/",
    "<rootDir>/node_modules/",
    "<rootDir>/controllers/adminAirlineController.js",
    "<rootDir>/controllers/adminFlightController.js",
    "<rootDir>/controllers/adminNotificationController.js",
    "<rootDir>/controllers/bookingController.js",
    "<rootDir>/controllers/flightController.js",
    "<rootDir>/controllers/resetPasswordController.js",
    "<rootDir>/controllers/seatsController.js",
    "<rootDir>/controllers/userActivationController.js",
    "<rootDir>/utils/processBooking.js",
  ],
};
