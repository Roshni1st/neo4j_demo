const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const routes = require("./routes/route");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", routes);
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server started on port:${port}`);
});
module.exports = app;
