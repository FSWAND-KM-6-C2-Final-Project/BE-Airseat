const ApiError = require("../utils/apiError");
const bcrypt = require("bcrypt");
const { Users } = require("../models");
const createToken = require("../utils/createToken");
const sendEmail = require("../utils/sendEmail");
const dayjs = require("dayjs");
const localizedFormat = require("dayjs/plugin/localizedFormat");
const { default: isEmail } = require("validator/lib/isEmail");
dayjs.extend(localizedFormat);

const register = async (req, res, next) => {
  try {
    const { full_name, email, phone_number, password, confirm_password } =
      req.body;

    // Check missing fields
    const missingFields = [];

    if (!full_name || full_name === null || full_name === "") {
      missingFields.push("Full Name");
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
    if (!isEmail(email)) {
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
    const isUserExist = await Users.findOne({
      where: {
        email: email,
      },
    });

    if (isUserExist) {
      return next(new ApiError("Email is already registered", 400));
    }

    // Encrypt password
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const token = Math.floor(Math.random() * 900000) + 100000;

    const nowTime = dayjs();
    const resend_at = nowTime.add(1, "minute").format();
    const expired_at = nowTime.add(1, "hour").format();

    const createUser = await Users.create({
      full_name,
      email,
      phone_number,
      verification_user_token: token,
      verification_user_resend_at: resend_at,
      verification_user_expired_at: expired_at,
      user_status: "unverified",
      password: hashedPassword,
    });

    if (!createUser) {
      return next(
        new ApiError("Unexpected error, user account is not registered!", 400)
      );
    }

    const recipient_name = `${createUser.full_name}`;
    const subject = "[No Reply] - Verify Your Email";
    const html_text = `
    <p>Hello ${recipient_name},</p>
    <p>Thank you for registering with Airseat. To activate your account, please use the following One-Time Password (OTP) code:</p>
    <p>
        Your OTP :
        <b>${token}</b>
    </p>
    <p>This OTP code is valid for 1 hour. If this OTP code expires, you can request a new OTP through the activation page.</p>
    <p>Thank you for your attention.</p>
    <p>Best regards,</p>
    <br>
    <p>Airseat</p>
    `;
    const plain_text = `
        Hello ${recipient_name},

        Thank you for registering with Airseat. To activate your account, please use the following One-Time Password (OTP) code:

        Your OTP : ${token}

        This OTP code is valid for 1 hour. If this OTP code expires, you can request a new OTP through the activation page.

        Thank you for your attention.

        Best regards,


        Airseat
      `;

    const sendResetOTP = await sendEmail(email, subject, plain_text, html_text);

    if (!sendResetOTP) {
      return next(
        new ApiError("Unexpected error!, failed to send OTP email", 400)
      );
    }

    res.status(201).json({
      status: "Success",
      message:
        "User account successfully registered, please check your email to activate your account",
      requestAt: req.requestTime,
      data: {
        email: createUser.email,
        verification_user_resend_at: resend_at,
        verification_user_expired_at: expired_at,
      },
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

    if (email) {
      searchCondition.email = email;
    } else if (phone_number) {
      searchCondition.phone_number = phone_number;
    }

    const user = await Users.findOne({
      where: searchCondition,
    });

    if (user && bcrypt.compareSync(password, user.password)) {
      if (user.user_status === "unverified") {
        return next(
          new ApiError("User is not verified, please verify your account", 401)
        );
      }

      const payload = {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        user_status: user.user_status,
      };

      const token = createToken(payload);

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
