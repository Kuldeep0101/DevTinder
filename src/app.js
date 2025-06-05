const express = require("express");
const { connectToDb } = require("./config/database");
const { User } = require("./models/user");
const app = express();
app.use(express.json());

connectToDb()
  .then(() => {
    console.log(`Connected to DB`);
    app.listen(8000, () => console.log("Server is running on Port 8000"));
  })
  .catch(() => {
    console.log(`Error While connecting to db`);
  });

//POST Signup
app.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    const user = new User(data);
    const savedUser = await user.save();
    res.status(200).json({ message: "User saved to DB", response: savedUser });
  } catch (error) {
    res.status(500).json({
      message: "error while saving User to DB",
      response: error.message,
    });
  }
});

//GET All Users
app.get("/feed", async (req, res) => {
  try {
    const user = await User.find();
    if (user.length === 0) {
      res.status(404).json("No user Found");
    } else {
      res.status(200).json({ message: "User Found", data: user });
    }
  } catch (error) {
    res.status(500).json({ message: "error while fetching the data" });
  }
});

//find by email
app.get("/user", async (req, res) => {
  const emailId = req.body.emailId;
  try {
    const findinDB = await User.find({ emailId: emailId });
    if (findinDB.length === 0) {
      res.send({ message: "user not found" });
    } else {
      res.status(200).json({ "User Found": findinDB });
    }
  } catch (error) {
    res.send({ message: "user not found", data: error.message });
  }
});

//Find User by ID
app.get("/findbyid", async (req, res) => {
  try {
    const id = req.body.id;
    const findinDB = await User.findById(id);
    if (findinDB.length === 0) {
      res.status(404).json("No user found");
    } else {
      res.status(200).json({ "User Found": findinDB });
    }
  } catch (error) {
    console.log(`Error while finding Data => ${error.message}`);
    res.status(500).json({ "Error while finding Data": error.message });
  }
});

//Update the User
app.patch("/user", async (req, res) => {
  try {
    const id = req.body._id;
    const data = req.body;
    console.log(data);
    const update = await User.findByIdAndUpdate(id, data, {
      returnDocument: "after",
    });
    res.status(200).json({ "user details updated": update });
  } catch (error) {
    res.status(500).json({ "error While updating User Data": error.message });
  }
});

//Delete the User
app.delete("/user", async (req, res) => {
  try {
    const id = req.body._id;

    const deleteUser = await User.findByIdAndDelete(id);
    res.status(200).json({ "User daleted": deleteUser });
  } catch (error) {
    res.status(500).json({ "error While Deleting the User": error.message });
  }
});

//update user using email-id

app.patch("/updatebyemail", async (req, res) => {
  try {
    const emailId = req.body.emailId;
    const data = req.body;
    const updateData = await User.findOneAndUpdate(emailId, data, {
      returnDocument: "after",
    });
    res.status(200).json({ "User Updated using email": updateData });
  } catch (error) {
    res
      .status(500)
      .json({ "error While updating User Data using email": error.message });
  }
});
