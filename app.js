const express = require("express");
const app = express();

app.use((req, res) => {
  res.send("Hello there");
});

app.listen(8000, () => console.log("Server running on port 8000"));
