const ApiError = require("../utils/apiError");
const { Users } = require("../models");
const sendEmail = require("../utils/sendEmail");
const dayjs = require("dayjs");
const localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);

const bcrypt = require("bcrypt");

const createResetToken = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await Users.findOne({
      where: {
        email: email,
        auth_type: "general",
      },
    });

    if (!user) {
      return next(
        new ApiError("User is not exist or logged in using another method", 400)
      );
    }

    // Check is reset_password_resend_at isBefore than now
    if (
      user.reset_password_resend_at ||
      user.reset_password_resend_at !== null
    ) {
      if (dayjs().isBefore(dayjs(user.reset_password_resend_at))) {
        const resendTime = dayjs(user.reset_password_resend_at).format("LLLL");
        return next(
          new ApiError(
            `You cannot resend your OTP email, please wait until ${resendTime}`,
            400
          )
        );
      }
    }

    const token = Math.floor(Math.random() * 900000) + 100000;

    const nowTime = dayjs();
    const resend_at = nowTime.add(1, "minute").format();
    const expired_at = nowTime.add(1, "hour").format();

    const createToken = await Users.update(
      {
        reset_password_token: token,
        reset_password_resend_at: resend_at,
        reset_password_expired_at: expired_at,
      },
      {
        where: {
          id: user.id,
          email: email,
        },
      }
    );

    if (!createToken) {
      return next(
        new ApiError("Unexpected Error!, failed to create reset token", 400)
      );
    }

    const recipient_name = `${user.first_name} ${user.last_name}`;
    const subject = "[No Reply] - Reset Password OTP";
    const html_text = `
    <p>Hello ${recipient_name},</p>
    <p>We received a request to reset the password for your account. If you did not request this, please ignore this email.</p>
    <p>
        Your OTP :
        <b>${token}</b>
    </p>
    <p>For the security of your account, please ensure that your new password is strong and unique, and different from your previous password.</p>
    <p>Thank you for your attention.</p>
    <p>Best regards,</p>
    <br>
    <p>Airseat</p>
    `;
    const plain_text = `
        Hello ${recipient_name},

        We received a request to reset the password for your account. If you did not request this, please ignore this email.

        Your OTP : ${token}

        For the security of your account, please ensure that your new password is strong and unique, and different from your previous password.

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

    res.status(200).json({
      status: "Success",
      message: "Reset password otp email is sent, please check your email.",
      requestAt: req.requestTime,
      data: {
        id: user.id,
        email: email,
        reset_password_token: token,
        reset_password_resend_at: resend_at,
        reset_password_expired_at: expired_at,
      },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const verifyResetTokenAndChangedPassword = async (req, res, next) => {
  try {
    const { code, email, password, confirm_password } = req.body;

    const user = await Users.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return next(new ApiError("User is not exist", 400));
    }

    // if reset password exist

    if (
      !user.reset_password_token ||
      user.reset_password_token === null ||
      user.reset_password_token === "" ||
      !user.reset_password_resend_at ||
      user.reset_password_resend_at === null ||
      user.reset_password_resend_at === "" ||
      !user.reset_password_expired_at ||
      user.reset_password_expired_at === null ||
      user.reset_password_expired_at === ""
    ) {
      return next(new ApiError("No password changed request", 400));
    }

    //  If not expired
    if (dayjs().isAfter(dayjs(user.reset_password_expired_at))) {
      return next(new ApiError("Password change request is expired", 400));
    }

    // Code field required validation
    if (!code || code === null || code === "") {
      return next(new ApiError("OTP Code is required", 400));
    }

    if (user.reset_password_token === code) {
      // Check if password length more than or equal 8
      if (password.length <= 8) {
        return next(
          new ApiError("Password is should be 8 or more character!", 400)
        );
      }

      if (password === confirm_password) {
        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(password, saltRounds);

        const resetPassword = await Users.update(
          {
            password: hashedPassword,
            reset_password_token: null,
            reset_password_resend_at: null,
            reset_password_expired_at: null,
          },
          {
            where: {
              id: user.id,
              email: email,
            },
          }
        );

        if (!resetPassword) {
          return next(
            new ApiError("Unexpected error, password not updated", 400)
          );
        }

        res.status(200).json({
          status: "Success",
          message: "Password changed, please login to your account",
          requestAt: req.requestTime,
        });
      } else {
        return next(new ApiError("Password Confimation is not match", 400));
      }
    } else {
      return next(new ApiError("OTP Code is wrong", 400));
    }
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

module.exports = {
  createResetToken,
  verifyResetTokenAndChangedPassword,
};
