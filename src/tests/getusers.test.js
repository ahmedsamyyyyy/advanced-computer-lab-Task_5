const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../App");
const bcrypt = require("bcrypt");

/* Connecting to the database before each test. */
beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

 /* Closing database connection after each test. */
  afterEach(async  () => {
  await mongoose.connection.close();

});
/* Test for getting user by id. */
describe("GET users/:id", () => {
  test("Get user by Id", (done) => {
    request(app)
      .get("/users/67388414be4de6f8bbe4477b")
      .expect(200)
      .expect((res) => {
        expect(res.body.name).toBe("John Doe");
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});

/* Test for creating a new user. */
describe("POST /signup", () => {
  test("Should create a new user and return a JSON response", async () => {
    const userData = {
      name: "Mabrouk",
      email: "mabrouk@example.com",
      password: "password123",
    };

    const response = await request(app)
      .post("/signup")
      .send(userData)
      .expect(201).expect((res) => {
    expect(res.body.name).toBe(userData.name);
    expect(res.body.email).toBe(userData.email);
    bcrypt.compare(userData.password, res.body.password, (err, isMatch) => {
      if (err) throw err;
      expect(isMatch).toBe(true);
    });
      });

    });
});
