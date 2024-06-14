const dotenv = require("dotenv");
dotenv.config();

const request = require("supertest");
const app = require("../../app");
const { Notifications, Users } = require("../../models");

describe("[API GET ALL NOTIFICATIONS TESTS]", () => {
  jest.setTimeout(30000);

  let token;

  beforeAll(async () => {
    const credential = {
      full_name: "Test User",
      email: "test@testing.com",
      phone_number: "0851740572334",
      password: "Users123456",
      confirm_password: "Users123456",
    };

    await request(app).post("/api/v1/auth/register").send(credential);

    const otp = await Users.findOne({
      where: {
        email: credential.email,
      },
    });

    const verifData = {
      code: otp.verification_user_token,
      email: credential.email,
    };

    await request(app).post("/api/v1/auth/activation/verify").send(verifData);

    const login = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: credential.email, password: credential.password });

    token = login.body.token;

    console.log("token");
    console.log(token);
  });

  test("Success - Get All Notification Data", async () => {
    const response = await request(app)
      .get("/api/v1/notification")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe("Notification succesfully retrieved");
    expect(response.body.requestAt).not.toBeNull();
    expect(response.body.data).not.toBeNull();
  });
});

describe("[API CREATE NOTIFICATION TESTS]", () => {
  test("Success - Create Notification", async () => {
    const notification = {
      notification_type: "Promosi",
      notification_title: "Dapatkan Diskon 10%",
      notification_description:
        "Dapatkan Diskon 15% untuk pembelian tiket pesawat dengan minimal Rp. 1.000.000",
    };

    const response = await request(app)
      .post(`/api/v1/notification`)
      .send(notification);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe("Notification successfully created");
    expect(response.body.requestAt).not.toBeNull();
    expect(response.body.data).not.toBeNull();
  });
});

describe("[API UPDATE NOTIFICATION TESTS]", () => {
  test("Failed - Not Found Notification", async () => {
    const response = await request(app).patch(`/api/v1/notification/883`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe(`Notification not found`);
    expect(response.body.requestAt).not.toBeNull();
  });

  test("Success - Update Notification", async () => {
    const notification = {
      notification_description: "Update lohhh",
    };

    const notificationData = await Notifications.findOne();

    const response = await request(app)
      .patch(`/api/v1/notification/${notificationData.id}`)
      .send(notification);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe(`Notification Successfully Updated`);
    expect(response.body.data).not.toBeNull();
    expect(response.body.requestAt).not.toBeNull();
  });
});

describe("[API DELETE NOTIFICATION TESTS]", () => {
  test("Failed - Not Found Notification", async () => {
    const response = await request(app).delete(`/api/v1/notification/883`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe(`Notification not found`);
    expect(response.body.requestAt).not.toBeNull();
  });

  test("Success - Delete Notications", async () => {
    const notificationData = await Notifications.findOne();

    const response = await request(app).delete(
      `/api/v1/notification/${notificationData.id}`
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe(`Notification deleted successfully`);
    expect(response.body.requestAt).not.toBeNull();
  });
});
