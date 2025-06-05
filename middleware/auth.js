const adminAuth = (req, res, next) => {
  console.log("middleware started to run");
  const token = "ABC";
  const isAuthorized = token === "ABC";
  if (!isAuthorized) {
    return res.status(401).send("You are not authorized to access this route");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log(`user auth doing`);
  const token = "ABC";
  const isAuthorized = token === "ABC";
  if (!isAuthorized) {
    return res.status(401).send("You are not a user, get tf out here");
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };
