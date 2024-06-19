const express = require("express");
const morgan = require("morgan");
const dayjs = require("dayjs");
const flash = require("connect-flash");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);

const errorController = require("./controllers/errorController");
const router = require("./routes");
const cors = require("cors");

const app = express();

app.set("trust proxy", 1);
// Using middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = dayjs().format();
  next();
});

const SESSION_SECRET = process.env.SESSION_SECRET;

app.use(
  session({
    name: "adminDashboard",
    secret: SESSION_SECRET,
    resave: false,
    proxy: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 7200000,
      secure: process.env.NODE_ENV === "production",
    },
    store: new MemoryStore({
      checkPeriod: 7200000,
    }),
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  res.setHeader("Pragma", "no-cache");
  next();
});

app.set("views", `${__dirname}/views`);
app.set("view engine", "ejs");

app.use(router);

app.use(errorController.onLost);
app.use(errorController.onError);

module.exports = app;
