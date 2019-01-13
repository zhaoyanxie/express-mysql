const request = require("supertest");
const app = require("express");

const api = require("../../routers/api");

describe("sd", () => {
  beforeEach(() => {
    jest.resetModules(); // this is important
    delete process.env.NODE_ENV;
  });
  test("sd", async () => {
    process.env.PRODUCTION_DB = "school";
    const response = await request(app).get("/teachers");
    console.log(response);
    expect(1).toBe(1);
  });
});
