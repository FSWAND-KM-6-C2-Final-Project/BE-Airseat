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

// Swagger docs
router.use("/api-docs", swaggerUI.serve);
router.use("/api-docs", swaggerUI.setup(swaggerDocument));

module.exports = router;
