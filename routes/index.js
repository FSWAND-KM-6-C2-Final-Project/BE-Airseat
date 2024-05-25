const router = require("express").Router();
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("../docs/swagger.json");

/*
    Import other routers here, for example:
    const authRouter = require("./authRouter");
*/

router.use("/api-docs", swaggerUI.serve);
router.use("/api-docs", swaggerUI.setup(swaggerDocument));

/*
    Define other routes here, for example:
    router.use("/api/v1/auth", authRouter);
*/

router.use("/api/v1/flight", flightRouter)

module.exports = router;
