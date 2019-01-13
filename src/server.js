require("dotenv").config();
const app = require("./index");
const port = 4000;

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
