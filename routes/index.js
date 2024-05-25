const router = require("express").Router();

/*
    Import other routers here, for example:
    const authRouter = require("./authRouter");
*/
const flightRouter = require("./flightRouter")
/*
    Define other routes here, for example:
    router.use("/api/v1/auth", authRouter);
*/

router.use("/api/v1/flight", flightRouter)

module.exports = router;
