require("dotenv").config();

const request = require("supertest");
const app = require("express");
const api = require("../index");

describe("sd", () => {
  test("sd", async () => {
    const response = await request(api).get("/api/teachers");
    console.log(response);
    expect(1).toBe(1);
  });
});
