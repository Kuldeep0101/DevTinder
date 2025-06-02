const express = require("express");
const app = express();

const data = { Name: "Kuldeep", Stack: "MERN" };

app.use("/user", (req, res) => {
  res.send("You cant go ahead");
});

app.get("/user", (req, res) => {
  res.status(200).json({ message: "Data Fetched", data: data });
});

app.post("/user", (req, res) => {
  console.log("Data Saved to DB ");
  res.send({ message: "User Saved to DB" });
});

app.delete("/user", (req, res) => {
  res.send("User Deleted");
});

app.listen(8000, () => console.log("Server running on port 8000"));
