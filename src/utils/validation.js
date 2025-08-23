const validator = require("validator");


//Validate Signup Route
const validateSignupData = (req) => {
  const errors = [];
  const { firstName, lastName, emailId, password } = req.body;

  // 1️⃣ Check for required fields
  if (!firstName || !emailId || !password) {
    errors.push("Please enter mandatory fields");
  }

  // 2️⃣ Validate firstName length
  if (firstName && !validator.isLength(firstName, { min: 4, max: 20 })) {
    errors.push("First Name must be 4-20 characters long");
  }

  // 3️⃣ Validate lastName length only if provided
  if (lastName && lastName.trim() !== "") {
    if (!validator.isLength(lastName.trim(), { min: 4, max: 20 })) {
      errors.push("Last Name must be 4-20 characters long");
    }
  }

  // 4️⃣ Validate email format
  if (emailId && !validator.isEmail(emailId)) {
    errors.push("Please enter a valid Email-id");
  }

  // 5️⃣ Validate password strength
  if (
    password &&
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    errors.push("Please enter a strong password");
  }

  return errors;
};

//Validate Login Route
const validateLoginData = (req) => {
  const { emailId, password } = req.body;
  const errors = [];
  if ((!emailId || !password || password.trim()  == "")) {
    errors.push("Please Enter Email-id and Password");
  }

  if (emailId && !validator.isEmail(emailId.trim())) {
    errors.push("Please Enter a valid Email-id");
  }
  if (password && !validator.isLength(password, { min: 8 })) {
    errors.push("Please Enter Valid Password");
  }
  return errors;
};

const validateProfileEditData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};

const checkFName = (req) => {
  const fName = req.body.firstName;
  if (fName === undefined) return;

  if (fName.length < 4 || fName.length > 20) {
    throw new Error("First Name should be 4-20 charachters");
  }
};

const checkLName = (req) => {
  const lName = req.body.lastName;
  if (lName === undefined) return;

  if (lName.length < 4 || lName.length > 20) {
    throw new Error("Last Name should be 4-20 charachters");
  }
};



module.exports = {
  validateSignupData,
  validateLoginData,
  validateProfileEditData,
  checkFName,
  checkLName,

};
