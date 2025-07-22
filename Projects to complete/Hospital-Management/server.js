const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("welcome to Homepage");
});

app.listen(9000, () => console.log("runnnn"));
