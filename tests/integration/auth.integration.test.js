const dotenv = require("dotenv");
dotenv.config();

const request = require("supertest");
const app = require("../../app");
const { Users } = require("../../models");

let token;

describe("[API REGISTER AUTH TESTS]", () => {
  jest.setTimeout(30000);

  test("Success Register", async () => {
    const credential = {
      full_name: "Test User",
      email: "theslowedchill@gmail.com",
      phone_number: "085174057230",
      password: "Users123456",
      confirm_password: "Users123456",
    };

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(credential);

    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe(
      "User account successfully registered, please check your email to activate your account"
    );
    expect(response.body.requestAt).not.toBeNull();
    expect(response.body.data).not.toBeNull();
  });

  test("Failed Register - Required Field", async () => {
    const response = await request(app).post("/api/v1/auth/register");

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe(
      "Full Name, Email, Phone Number, password, Confirm Password should be required!"
    );
    expect(response.body.requestAt).not.toBeNull();
  });

  test("Failed Register - Email is not valid", async () => {
    const credential = {
      full_name: "Test User",
      email: "theslowedchillgmailcom",
      phone_number: "085174057230",
      password: "Users123456",
      confirm_password: "Users123456",
    };

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(credential);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe("Email format is not correct!");
    expect(response.body.requestAt).not.toBeNull();
  });

  test("Failed Register - Phone Number Exist", async () => {
    const credential = {
      full_name: "Test User",
      email: "akbarrahmatmulyatama@gmail.com",
      phone_number: "085174057230",
      password: "Users123456",
      confirm_password: "Users123456",
    };

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(credential);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe("Phone number is already registered");
    expect(response.body.requestAt).not.toBeNull();
  });

  test("Failed Register - Email Exist", async () => {
    const credential = {
      full_name: "Test User",
      email: "theslowedchill@gmail.com",
      phone_number: "085174057299",
      password: "Users123456",
      confirm_password: "Users123456",
    };

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(credential);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe("Email is already registered");
    expect(response.body.requestAt).not.toBeNull();
  });

  test("Failed Register - Full name is not provided", async () => {
    const credential = {
      full_name: null,
      email: "test1@gmail.com",
      phone_number: "085174057230",
      password: "Users123456",
      confirm_password: "Users123456",
    };

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(credential);

    expect(response.statusCode).toBe(400);
  });

  test("Failed Register - Email is not provided", async () => {
    const credential = {
      full_name: "Test User",
      email: null,
      phone_number: "085174057000",
      password: "Users123456",
      confirm_password: "Users123456",
    };

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(credential);

    expect(response.statusCode).toBe(400);
  });

  test("Failed Register - Phone Number is not provided", async () => {
    const credential = {
      full_name: "Test User",
      email: "test2@gmail.com",
      phone_number: null,
      password: "Users123456",
      confirm_password: "Users123456",
    };

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(credential);

    expect(response.statusCode).toBe(400);
  });

  test("Failed Register - Password and confirm password is not match", async () => {
    const credential = {
      full_name: "Test User",
      email: "test3@gmail.com",
      phone_number: "085174057230",
      password: "Users12345677",
      confirm_password: "Users123456",
    };

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(credential);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe(
      "Password & Confirm Password is should be match!"
    );
    expect(response.body.requestAt).not.toBeNull();
    expect(response.body.data).not.toBeNull();
  });

  test("Failed Register - Password is should be 8 character or more", async () => {
    const credential = {
      full_name: "Test User",
      email: "theslowedchill@gmail.com",
      phone_number: "085174057230",
      password: "123",
      confirm_password: "123",
    };

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(credential);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe(
      "Password is should be 8 or more character!"
    );
    expect(response.body.requestAt).not.toBeNull();
  });
});

describe("[API VERIFY OTP AUTH TESTS]", () => {
  test("Failed - Required Field", async () => {
    const credential = {
      email: null,
      code: null,
    };

    const response = await request(app)
      .post("/api/v1/auth/activation/verify")
      .send(credential);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe("OTP Code, Email should be required!");
    expect(response.body.requestAt).not.toBeNull();
  });

  test("Failed - Wrong OTP", async () => {
    const credential = {
      email: "theslowedchill@gmail.com",
      code: 9812999999999,
    };

    const response = await request(app)
      .post("/api/v1/auth/activation/verify")
      .send(credential);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe("OTP Code is wrong");
    expect(response.body.requestAt).not.toBeNull();
  });

  test("Failed - User Not Exist", async () => {
    const credential = {
      email: "anehhh123@gmail.com",
      code: 221331,
    };

    const response = await request(app)
      .post("/api/v1/auth/activation/verify")
      .send(credential);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe("User is not exist");
    expect(response.body.requestAt).not.toBeNull();
  });

  test("Success Verify Account", async () => {
    const user = await Users.findOne({
      where: {
        email: "theslowedchill@gmail.com",
      },
    });

    const credential = {
      email: "theslowedchill@gmail.com",
      code: user.verification_user_token,
    };

    const response = await request(app)
      .post("/api/v1/auth/activation/verify")
      .send(credential);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe(
      "User activate, please login into your account"
    );
    expect(response.body.requestAt).not.toBeNull();
  });
});

describe("[API LOGIN AUTH TESTS]", () => {
  test("Failed - Required Email", async () => {
    const credential = {
      email: null,
      password: null,
    };

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send(credential);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).not.toBeNull();
    expect(response.body.requestAt).not.toBeNull();
  });

  test("Failed - Required Password Field", async () => {
    const credential = {
      email: "theslowedchill@gmail",
      password: null,
    };

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send(credential);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe("Password should be provided");
    expect(response.body.requestAt).not.toBeNull();
  });

  test("Failed - Only one of email or phone number should be provided", async () => {
    const credential = {
      email: "theslowedchill@gmail",
      phone_number: "085112863218",
      password: "testt",
    };

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send(credential);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe(
      "Only one of email or phone number should be provided"
    );
    expect(response.body.requestAt).not.toBeNull();
  });

  test("Failed - Wrong Credential", async () => {
    const credential = {
      email: "theslowedchill@gmail.com",
      password: "8u23hun39n328n38",
    };

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send(credential);

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe("Invalid credentials");
    expect(response.body.token).not.toBeNull();
  });

  test("Success Login", async () => {
    const credential = {
      email: "theslowedchill@gmail.com",
      password: "Users123456",
    };

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send(credential);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe("Successfully logged in");
    expect(response.body.token).not.toBeNull();
    token = response.body.token;
  });
});

describe("[API CHECK USER TESTS]", () => {
  test("Failed - No Token Provided", async () => {
    const response = await request(app).get("/api/v1/auth/me");

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe("Token not found!");
    expect(response.body.requestAt).not.toBeNull();
  });
  test("Failed - Invalid Signature", async () => {
    const response = await request(app)
      .get("/api/v1/auth/me")
      .set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJha2JhcnJhaG1hdG11bHlhdGFtYUBnbWFpbC5jb20iLCJuYW1lIjoiQWtiYXIgUmFobWF0IE11bHlhdGFtYSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzEzMzYyODY1LCJleHAiOjE3MTM5Njc2NjV9.V4Ts30az1Wx7hTncvhK9t-2LYrEyY0HqTDxrw1OWOI0`
      );

    expect(response.statusCode).toBe(500);
    expect(response.body.status).toBe("Error");
    expect(response.body.message).toBe("invalid signature");
    expect(response.body.requestAt).not.toBeNull();
  });
  test("Failed - JWT Expired", async () => {
    const response = await request(app)
      .get("/api/v1/auth/me")
      .set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3RfbmFtZSI6IkFrYmFyIFJhaG1hdCIsImxhc3RfbmFtZSI6Ik11bHlhdGFtYSIsImVtYWlsIjoiYWtiYXJyYWhtYXRtdWx5YXRhbWFAZ21haWwuY29tIiwiaWF0IjoxNzE2ODExMDIxLCJleHAiOjE3MTc0MTU4MjF9.tK2Y10RteeoCqt84zh9dUsFkGDOaHNSS98ZV8fGvJAk`
      );

    expect(response.statusCode).toBe(500);
    expect(response.body.status).toBe("Error");
    expect(response.body.message).toBe("jwt expired");
    expect(response.body.requestAt).not.toBeNull();
  });
  test("Failed - JWT Malformed", async () => {
    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer testt`);

    expect(response.statusCode).toBe(500);
    expect(response.body.status).toBe("Error");
    expect(response.body.message).toBe("jwt malformed");
    expect(response.body.requestAt).not.toBeNull();
  });
  test("Success Check User", async () => {
    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe("User data successfully retrieved");
    expect(response.body.requestAt).not.toBeNull();
    expect(response.body.data).not.toBeNull();
  });
});

describe("[UPDATE USER PROFILE AUTH TESTING]", () => {});

describe("[DELETE & UPDATE USER PROFILE AUTH TESTING]", () => {
  test("Failed - Update No Token Provided", async () => {
    const response = await request(app)
      .patch("/api/v1/profile")
      .send({ full_name: "Akbar Ganteng" });

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe("Token not found!");
  });
  test("Failed - Update Error Unexpected Error", async () => {
    const response = await request(app)
      .patch("/api/v1/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({ kocak: "Akbar Ganteng" });

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).not.toBeNull();
  });
  test("Success - Update Profile", async () => {
    try {
      const response = await request(app)
        .patch("/api/v1/profile")
        .set("Authorization", `Bearer ${token}`)
        .send({ full_name: "Akbar Ganteng" });

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("Success");
      expect(response.body.message).toBe("Profile successfully updated");
    } catch (error) {
      console.log(error);
    }
  });

  test("Failed - Delete No Token Provided", async () => {
    const response = await request(app).delete("/api/v1/profile");

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe("Token not found!");
  });

  test("Success - Delete Profile", async () => {
    const response = await request(app)
      .delete("/api/v1/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe("Profile successfully deleted");
  });
});
