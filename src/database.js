const mysql = require("mysql");

const database = {
  connect: () => {
    // connect to db
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "password",
      database: "school"
    });
    connection.connect(err => {
      if (err) throw err;
      console.log("Database connected");
    });
    return connection;
  }
};

module.exports = database;
