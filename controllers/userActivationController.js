const ApiError = require("../utils/apiError");
const { Users } = require("../models");
const sendEmail = require("../utils/sendEmail");
const dayjs = require("dayjs");
const localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);

const resendActivation = async (req, res, next) => {
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

    if (user.user_status === "verified") {
      return next(new ApiError("User is already verified", 400));
    }

    if (
      !user.verification_user_token ||
      user.verification_user_token === null ||
      user.verification_user_token === "" ||
      !user.verification_user_resend_at ||
      user.verification_user_resend_at === null ||
      user.verification_user_resend_at === "" ||
      !user.verification_user_expired_at ||
      user.verification_user_expired_at === null ||
      user.verification_user_expired_at === ""
    ) {
      return next(new ApiError("No user account activation found", 400));
    }

    if (
      user.verification_user_resend_at ||
      user.verification_user_resend_at !== null
    ) {
      // Check is verification_user_resend_at isBefore than now
      if (dayjs().isBefore(dayjs(user.verification_user_resend_at))) {
        const resendTime = dayjs(user.verification_user_resend_at).format(
          "LLLL"
        );
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
        verification_user_token: token,
        verification_user_resend_at: resend_at,
        verification_user_expired_at: expired_at,
      },
      {
        where: {
          id: user.id,
          email: email,
        },
      }
    );

    if (!updateToken) {
      return next(
        new ApiError("Unexpected error, failed to create activation token", 400)
      );
    }

    const recipient_name = `${user.full_name}`;
    const subject = "[No Reply] - Verify Your Email";
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
                                <h1 style="margin: 0;">Welcome to Airseat !</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px;">
                                <p style="margin: 0; font-size: 16px; line-height: 1.5; color: #333333;">
                                    Dear ${recipient_name},
                                </p>
                                <p style="margin: 16px 0 0 0; font-size: 16px; line-height: 1.5; color: #333333;">
                                    Thank you for registering with Airseat. To activate your account, please use the
                                    following One-Time
                                    Password (OTP) code:
                                </p>
                                <p style="margin-top: 30px; text-align: center;"><b>Your OTP :</b></p>
                                <p
                                    style="margin: 0px auto 30px auto; background-color: #164765; text-align: center;  max-width: 200px; font-size: 32px; line-height: 1.5; color: white; padding: 20px;">
                                    <b>
                                        ${token}
                                    </b>
                                </p>
                                <p style="margin: 0 0 0 0; font-size: 16px; line-height: 1.5; color: #333333;">
                                    This OTP code is valid for 1 hour. If this OTP code expires, you can request a new OTP
                                    through the
                                    activation page.
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

        Thank you for registering with Airseat. To activate your account, please use the following One-Time Password (OTP) code:

        Your OTP : ${token}

        This OTP code is valid for 1 hour. If this OTP code expires, you can request a new OTP through the activation page.

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
      message: "User activation OTP is sent, please check your email",
      requestAt: req.requestTime,
      data: {
        email: user.email,
        verification_user_resend_at: resend_at,
        verification_user_expired_at: expired_at,
      },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const verifyActivation = async (req, res, next) => {
  try {
    const { code, email } = req.body;

    // Check missing fields
    const missingFields = [];

    if (!code || code === null || code === "") {
      missingFields.push("OTP Code");
    }
    if (!email || email === null || email === "") {
      missingFields.push("Email");
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

    if (user.user_status === "verified") {
      return next(new ApiError("User is already verified", 400));
    }

    if (
      !user.verification_user_token ||
      user.verification_user_token === null ||
      user.verification_user_token === "" ||
      !user.verification_user_resend_at ||
      user.verification_user_resend_at === null ||
      user.verification_user_resend_at === "" ||
      !user.verification_user_expired_at ||
      user.verification_user_expired_at === null ||
      user.verification_user_expired_at === ""
    ) {
      return next(new ApiError("No user account activation found", 400));
    }

    //  If not expired
    if (dayjs().isAfter(dayjs(user.verification_user_expired_at))) {
      return next(new ApiError("User activation is expired", 400));
    }

    // Code field required validation
    if (!code || code === null || code === "") {
      return next(new ApiError("OTP Code is required", 400));
    }

    if (user.verification_user_token === code) {
      const verifyUser = await Users.update(
        {
          verification_user_token: null,
          verification_user_resend_at: null,
          verification_user_expired_at: null,
          user_status: "verified",
        },
        {
          where: {
            id: user.id,
            email: email,
          },
        }
      );

      if (!verifyUser) {
        return next(new ApiError("Unexpected error, user not activated", 400));
      }

      res.status(200).json({
        status: "Success",
        message: "User activate, please login into your account",
        requestAt: req.requestTime,
      });
    } else {
      return next(new ApiError("OTP Code is wrong", 400));
    }
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

module.exports = {
  resendActivation,
  verifyActivation,
};
