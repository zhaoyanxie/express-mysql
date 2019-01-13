const express = require("express");
const request = require("supertest");

const indexRouter = require("../../routers/index");

const app = express();

indexRouter(app);
describe("indexController test", () => {
  test("GET / should return status 200", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
  });
});
