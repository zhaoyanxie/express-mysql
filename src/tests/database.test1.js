// const express = require("express");

// const database = require("../database");
// const {
//   TABLE_STUDENTS,
//   TABLE_TEACHERS,
//   STUDENTS_COL_TEACHERS_ID
// } = require("../constants");

// const app = express();

// describe("database test", () => {
//   test("query should", async () => {
//     console.log(Object.values(database.connect()));
//     const pool = database.connect();
//     const queryStr = `SELECT * from ${TABLE_TEACHERS}`;
//     // const results = await database.query(pool, queryStr);

//     const results = await database.query(pool.queryStr);
//     expect(1).toBe(1);
//   });
// });
