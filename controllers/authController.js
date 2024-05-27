const ApiError = require("../utils/apiError");
const bcrypt = require("bcrypt");
const { Users } = require("../models");
const createToken = require("../utils/createToken");

const register = async (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      password,
      confirm_password,
    } = req.body;

    // Check missing fields
    const missingFields = [];

    if (!first_name || first_name === null || first_name === "") {
      missingFields.push("First Name");
    }
    if (!last_name || last_name === null || last_name === "") {
      missingFields.push("Last Name");
    }
    if (!email || email === null || email === "") {
      missingFields.push("Email");
    }
    if (!phone_number || phone_number === null || phone_number === "") {
      missingFields.push("Phone Number");
    }
    if (!password || password === null || password === "") {
      missingFields.push("password");
    }
    if (
      !confirm_password ||
      confirm_password === null ||
      confirm_password === ""
    ) {
      missingFields.push("Confirm Password");
    }

    if (missingFields.length > 0) {
      return next(
        new ApiError(`${missingFields.join(", ")} should be required!`, 400)
      );
    }

    // Check if email is in correct format
    if (
      !email.match(
        /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/
      )
    ) {
      return next(new ApiError("Email format is not correct!", 400));
    }

    // Check if password & confirm_password is same
    if (password !== confirm_password) {
      return next(
        new ApiError("Password & Confirm Password is should be match!", 400)
      );
    }

    // Check if password length more than or equal 8
    if (password.length <= 8) {
      return next(
        new ApiError("Password is should be 8 or more character!", 400)
      );
    }

    // Is email with google auth is exist check
    const isGoogleAccountExist = await Users.findOne({
      where: {
        email: email,
        auth_type: "google",
      },
    });

    if (isGoogleAccountExist) {
      return next(
        new ApiError("Email is already registered using another method", 400)
      );
    }

    // Is phone number is exist check
    const isPhoneNumberExist = await Users.findOne({
      where: {
        phone_number: phone_number,
      },
    });

    if (isPhoneNumberExist) {
      return next(new ApiError("Phone number is already registered", 400));
    }

    // Is email with general auth is exist check
    const isGeneralAccountExist = await Users.findOne({
      where: {
        email: email,
        auth_type: "general",
      },
    });

    if (isGeneralAccountExist) {
      return next(new ApiError("Email is already registered", 400));
    }

    // Encrypt password
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const createUser = await Users.create({
      first_name,
      last_name,
      email,
      phone_number,
      password: hashedPassword,
    });

    if (!createUser) {
      return next(
        new ApiError("Unexpected error, user account is not registered!", 400)
      );
    }

    res.status(201).json({
      status: "Success",
      message: "User account successfully registered",
      requestAt: req.requestTime,
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, phone_number, password } = req.body;

    // username or phone number is required
    if (!email && !phone_number) {
      return next(new ApiError("Email or phone number is required", 400));
    }

    // User only can use either email or phone_number for login, not both
    if (email && phone_number) {
      return next(
        new ApiError(
          "Only one of email or phone number should be provided",
          400
        )
      );
    }

    if (!password || password === null || password === "") {
      return next(new ApiError("Password should be provided", 400));
    }

    let searchCondition = {};
    searchCondition.auth_type = "general";

    if (email) {
      searchCondition.email = email;
    } else if (phone_number) {
      searchCondition.phone_number = phone_number;
    }

    const user = await Users.findOne({
      where: searchCondition,
    });

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = createToken({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      });

      res.status(200).json({
        status: "Success",
        message: "Successfully logged in",
        token,
      });
    } else {
      return next(new ApiError("Invalid credentials", 401));
    }
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const checkUser = async (req, res, next) => {
  try {
    res.status(200).json({
      status: "Success",
      message: "User data successfully retrieved",
      requestAt: req.requestTime,
      data: {
        user: req.user,
      },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

module.exports = {
  register,
  login,
  checkUser,
};
