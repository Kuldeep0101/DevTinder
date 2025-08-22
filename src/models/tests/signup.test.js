// __tests__/signup.test.js
const request = require("supertest");
const app = require("../app"); // your Express app
const mongoose = require("mongoose");
const User = require("../models/User"); // your User model

beforeAll(async () => {
  // Connect to a test DB
  await mongoose.connect("mongodb://localhost:27017/testDB");
});

afterEach(async () => {
  // Clean DB after each test
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("/signup API", () => {
  test("Should fail if mandatory fields are missing", async () => {
    const res = await request(app)
      .post("/signup")
      .send({ firstName: "", emailId: "", password: "" });
    expect(res.status).toBe(500);
    expect(res.body.response).toMatch(/Mandetory/);
  });

  test("Should fail if firstName length < 4 or > 20", async () => {
    const res = await request(app)
      .post("/signup")
      .send({
        firstName: "abc",
        emailId: "test@example.com",
        password: "Strong1!",
      });
    expect(res.body.response).toMatch(/First Name Must/);
  });

  test("Should skip lastName validation if empty", async () => {
    const res = await request(app)
      .post("/signup")
      .send({
        firstName: "Kuldeep",
        lastName: "",
        emailId: "test@example.com",
        password: "Strong1A!",
      });
    expect(res.status).toBe(200);
  });

  test("Should fail if lastName length < 4 or > 20", async () => {
    const res = await request(app)
      .post("/signup")
      .send({
        firstName: "Kuldeep",
        lastName: "ab",
        emailId: "test@example.com",
        password: "Strong1A!",
      });
    expect(res.body.response).toMatch(/Last Name Must/);
  });

  test("Should fail for invalid email", async () => {
    const res = await request(app)
      .post("/signup")
      .send({
        firstName: "Kuldeep",
        emailId: "invalidEmail",
        password: "Strong1A!",
      });
    expect(res.body.response).toMatch(/Valid Email/);
  });

  test("Should fail for weak password", async () => {
    const res = await request(app)
      .post("/signup")
      .send({
        firstName: "Kuldeep",
        emailId: "test@example.com",
        password: "12345",
      });
    expect(res.body.response).toMatch(/Strong Password/);
  });

  test("Should fail for duplicate email", async () => {
    await new User({
      firstName: "Kuldeep",
      emailId: "dup@example.com",
      password: "hashed",
    }).save();

    const res = await request(app)
      .post("/signup")
      .send({
        firstName: "Kuldeep",
        emailId: "dup@example.com",
        password: "Strong1A!",
      });
    expect(res.body.response).toMatch(/Duplicate email/);
  });

  test("Should succeed for valid input", async () => {
    const res = await request(app)
      .post("/signup")
      .send({
        firstName: "Kuldeep",
        lastName: "Singh",
        emailId: "unique@example.com",
        password: "Strong1A!",
      });
    expect(res.status).toBe(200);
    expect(res.body.response).toHaveProperty("_id");
  });
});
