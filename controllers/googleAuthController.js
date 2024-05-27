const ApiError = require("../utils/apiError");
const { google } = require("googleapis");
const { Users } = require("../models");
const createToken = require("../utils/createToken");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

const getGoogleURL = async (req, res, next) => {
  try {
    const scopes = [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/user.phonenumbers.read",
    ];

    const url = await oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
    });

    res.status(200).json({
      status: "Success",
      message: "Google Auth URL is successfully created",
      requestAt: req.requestTime,
      data: {
        url,
      },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const getGoogleToken = async (req, res, next) => {
  try {
    const { code } = req.query;

    if (!code) {
      return next(new ApiError("Unexpected error, please try again", 400));
    }

    res.status(200).json({
      status: "Success",
      message: "Succesfully get google token",
      data: {
        token: code,
      },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const registerOrLoginViaGoogle = async (req, res, next) => {
  try {
    const { code } = req.query;

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });

    const { data } = await oauth2.userinfo.get();

    console.log(data);

    // Check if email is used in general register
    const isGeneralUserExist = await Users.findOne({
      where: {
        email: data.email,
        auth_type: "general",
      },
    });

    if (isGeneralUserExist) {
      return next(
        new ApiError("Email is already registered using another method", 400)
      );
    }

    const googleUser = await Users.findOne({
      where: {
        email: data.email,
        auth_type: "google",
      },
    });

    let token;

    if (googleUser) {
      // Logic Login Using google
      token = createToken({
        id: googleUser.id,
        first_name: googleUser.first_name,
        last_name: googleUser.last_name,
        email: googleUser.email,
      });
    } else {
      // Logic Register Using google
      const user = await Users.create({
        google_id: data.id,
        first_name: data.given_name,
        last_name: data.family_name || "",
        email: data.email,
        auth_type: "google",
      });

      if (!user) {
        return next(
          new ApiError("Unexpected error, user account is not registered!", 400)
        );
      }

      token = createToken({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Successfully logged in",
      token,
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

module.exports = {
  getGoogleURL,
  getGoogleToken,
  registerOrLoginViaGoogle,
};
