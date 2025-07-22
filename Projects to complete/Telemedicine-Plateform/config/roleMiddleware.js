const isAdmin = async (req, res, next) => {
  const role = req.user.role;
  if (!role == "admin") {
    console.log(error, "Admin access required");
    return res.status(200).json({ error: "Admin access required" });
  }
  next();
};

const isDoctor = (req, res, next) => {
  const role = req.user.role;
  if (!role == "doctor") {
    console.log(error, "Doctor access required");
    return res.status(200).json({ error: "Doctor access required" });
  }
  next();
};

const isPatient = (req, res, next) => {
  const role = req.user.role;
  if (!role == "patient") {
    console.log(error, "Needs to be Patient to Access this route");
    return res
      .status(200)
      .json({ error: "Needs to be Patient to Access this route" });
  }
  next();
};
module.exports = { isAdmin, isDoctor, isPatient };
