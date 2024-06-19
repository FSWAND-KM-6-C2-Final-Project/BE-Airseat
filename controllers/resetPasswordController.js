const ApiError = require("../utils/apiError");
const { Users } = require("../models");
const sendEmail = require("../utils/sendEmail");
const dayjs = require("dayjs");
const localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);

const bcrypt = require("bcrypt");

const createResetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || email === null || email === "") {
      return next(new ApiError("Email is required", 400));
    }

    const user = await Users.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return next(new ApiError("User is not exist", 400));
    }

    if (user.user_status === "unverified") {
      return next(
        new ApiError("User is not verified, please verify your account", 400)
      );
    }

    if (
      user.reset_password_token &&
      user.reset_password_token !== "" &&
      user.reset_password_token !== null &&
      user.reset_password_resend_at &&
      user.reset_password_resend_at !== "" &&
      user.reset_password_resend_at !== null &&
      user.reset_password_expired_at &&
      user.reset_password_expired_at !== "" &&
      user.reset_password_expired_at !== null
    ) {
      return next(
        new ApiError(
          "Your reset password is exist, if your OTP is expired please resend it",
          400
        )
      );
    }

    const token = Math.floor(Math.random() * 900000) + 100000;

    const nowTime = dayjs();
    const resend_at = nowTime.add(1, "minute").format();
    const expired_at = nowTime.add(1, "hour").format();

    const createResetPasswordToken = await Users.update(
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

    if (!createResetPasswordToken) {
      return next(
        new ApiError("Unexpected Error!, failed to create reset token", 400)
      );
    }

    const recipient_name = `${user.first_name} ${user.last_name}`;
    const subject = "[No Reply] - Reset Password OTP";
    const html_text = `
    <!DOCTYPE html>
    <html lang="en">


    <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
                <td>
                    <table width="600" cellpadding="0" cellspacing="0" border="0" align="center"
                        style="background-color: #ffffff; padding: 20px; border: 1px solid #dddddd;">
                        <tr>
                            <td style="text-align: center; padding: 20px 0;">
                                <h1 style="margin: 0; color:black;">Airseat</h1>

                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px; text-align: center; background-color: #164765; color: #ffffff;">
                                <h1 style="margin: 0;">Reset Password</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px;">
                                <p style="margin: 0; font-size: 16px; line-height: 1.5; color: #333333;">
                                    Dear ${recipient_name},
                                </p>
                                <p style="margin: 16px 0 0 0; font-size: 16px; line-height: 1.5; color: #333333;">
                                    We received a request to reset the password for your account. If you did not request this, please ignore this email.
                                </p>
                                <p style="margin-top: 30px; text-align: center;"><b>Your OTP :</b></p>
                                <p
                                    style="margin: 0px auto 30px auto; background-color: #164765; text-align: center;  max-width: 200px; font-size: 16px; line-height: 1.5; color: white; padding: 20px;">
                                    <b>
                                        ${token}
                                    </b>
                                </p>
                                <p style="margin: 0 0 0 0; font-size: 16px; line-height: 1.5; color: #333333;">
                                    For the security of your account, please ensure that your new password is strong and unique, and different from your previous password.
                                    <br>
                                    Thank you for your attention.
                                    <br>
                                    <br>
                                    Best regards,
                                    <br>
                                    <br>
                                    <br>
                                    Airseat
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 20px; text-align: center; background-color: #f4f4f4; color: #777777;">
                                <p style="margin: 0; font-size: 12px;">&copy; 2024 Airseat. All rights reserved.</p>
                                <p style="margin: 10px 0 0 0; font-size: 12px;">Airseat Email System</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>

    </html>
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
      return next(new ApiError("Unexpected error!, failed to send OTP", 400));
    }

    res.status(200).json({
      status: "Success",
      message: "Reset password OTP is sent, please check your email.",
      requestAt: req.requestTime,
      data: {
        id: user.id,
        email: email,
        reset_password_resend_at: resend_at,
        reset_password_expired_at: expired_at,
      },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const resendResetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || email === null || email === "") {
      return next(new ApiError("Email is required", 400));
    }

    const user = await Users.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return next(new ApiError("User is not exist", 400));
    }

    if (user.user_status === "unverified") {
      return next(
        new ApiError("User is not verified, please verify your account", 400)
      );
    }

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

    const updateToken = await Users.update(
      {
        reset_password_token: token,
        reset_password_resend_at: resend_at,
        reset_password_expired_at: expired_at,
      },
      {
        where: {
          id: user.id,
          email,
        },
      }
    );

    if (!updateToken) {
      return next(
        new ApiError("Unexpected Error!, failed to create reset token", 400)
      );
    }

    const recipient_name = `${updateToken.full_name}`;
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
      message: "Reset password OTP is sent, please check your email.",
      requestAt: req.requestTime,
      data: {
        id: user.id,
        email: email,
        reset_password_resend_at: resend_at,
        reset_password_expired_at: expired_at,
      },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const verifyResetPassword = async (req, res, next) => {
  try {
    const { code, email, password, confirm_password } = req.body;

    // Check missing fields
    const missingFields = [];

    if (!code || code === null || code === "") {
      missingFields.push("OTP Code");
    }
    if (!email || email === null || email === "") {
      missingFields.push("Email");
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
      return next(
        new ApiError(
          "Password change request is expired, please request new reset password",
          400
        )
      );
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
  createResetPassword,
  resendResetPassword,
  verifyResetPassword,
};
