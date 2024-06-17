const router = require("express").Router();
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("../docs/swagger.json");

/*
    Import other routers here, for example:
    const authRouter = require("./authRouter");
*/
const flightRouter = require("./flightRouter");
const airportRouter = require("./airportRouter");
const authRouter = require("./authRouter");
const seatRouter = require("./seatRouter");
const airlineRouter = require("./airlineRouter");
const passengerRouter = require("./passengerRouter");
const discountRouter = require("./discountRouter");
const notificationRouter = require("./notificationRouter");
const bookingRouter = require("./bookingRouter");
const userRouter = require("./userRouter");
const adminAirlineRouter = require("./adminAirlineRouter");
const adminAirportRouter = require("./adminAirportRouter")
const adminFlightRouter = require("./adminFlightRouter");
const adminNotification = require("./adminNotificationRouter");
const adminDiscountRouter = require("./adminDiscountRouter");
const adminDashboardRouter = require("./adminDashboardRouter");
const adminAuthRouter = require("./adminAuthRouter");

/*
    Define other routes here, for example:
    router.use("/api/v1/auth", authRouter);
*/

router.use("/api/v1/flight", flightRouter);
router.use("/api/v1/airport", airportRouter);
router.use("/api/v1/auth", authRouter);
router.use("/api/v1/seat", seatRouter);
router.use("/api/v1/passenger", passengerRouter);
router.use("/api/v1/airline", airlineRouter);
router.use("/api/v1/airport",airportRouter)
router.use("/api/v1/discount", discountRouter);
router.use("/api/v1/notification", notificationRouter);
router.use("/api/v1/booking", bookingRouter);
router.use("/api/v1/profile", userRouter);

// Admin Dashboard
router.use("/admin/", adminDashboardRouter);
router.use("/admin/auth", adminAuthRouter);
router.use("/admin/airline", adminAirlineRouter);
router.use("/admin/airport", adminAirportRouter)
router.use("/admin/flight", adminFlightRouter);
router.use("/admin/notification", adminNotification);
router.use("/admin/discount", adminDiscountRouter);

// Swagger docs
router.use("/api-docs", swaggerUI.serve);
router.use("/api-docs", swaggerUI.setup(swaggerDocument));

module.exports = router;
