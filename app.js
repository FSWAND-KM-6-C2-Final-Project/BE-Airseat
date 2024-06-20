const express = require("express");
const morgan = require("morgan");
const dayjs = require("dayjs");
const flash = require("connect-flash");
const session = require("express-session");
const env = process.env.NODE_ENV || "development";
const Sequelize = require("sequelize");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const config = require(__dirname + "/config/database.js")[env];

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

app.set("trust proxy", 1);

var myStore = new SequelizeStore({
  db: sequelize,
});

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    store: myStore,
    proxy: true,
  })
);

myStore.sync();

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
