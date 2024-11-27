const express = require("express");
const morgan = require("morgan");
const dayjs = require("dayjs");
const env = process.env.NODE_ENV || "development";
const session = require("express-session");
const Sequelize = require("sequelize");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const config = require(__dirname + "/config/database.js")[env];
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const limiter = require("./middlewares/rateLimiter");

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

const errorController = require("./controllers/errorController");
const router = require("./routes");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/public`));
app.use(limiter);

app.use((req, res, next) => {
  req.requestTime = dayjs().format();
  next();
});

const SESSION_SECRET = process.env.SESSION_SECRET;

app.use(cookieParser(SESSION_SECRET));

app.set("trust proxy", 1);

let myStore = new SequelizeStore({
  db: sequelize,
});

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    store: myStore,
  })
);

app.use(flash());

app.set("views", `${__dirname}/views`);
app.set("view engine", "ejs");

app.use(router);

app.use(errorController.onLost);
app.use(errorController.onError);

myStore.sync();

module.exports = app;
