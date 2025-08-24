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
  if (!emailId || !password || password.trim() == "") {
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

//For Profile Edit Route

const checkUserInput = (req) => {
  const { firstName, lastName } = req.body;

  if (firstName === undefined) {
    return;
  }
  if (
    firstName.trim().length < 4 ||
    firstName.trim.length > 20 ||
    firstName.trim() === ""
  ) {
    throw new Error("First Name must be 4-20 characters.");
  }
  if (lastName === undefined) {
    return;
  }
  if (
    lastName.trim().length < 4 ||
    lastName.trim.length > 20 ||
    lastName.trim() === ""
  ) {
    throw new Error("Last Name must be 4-20 characters.");
  }
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

  const allowedSet = new Set(allowedEditFields);
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedSet.has(field)
  );
  return isEditAllowed;
};

const isValidPasswordData = (req) => {
  const { password } = req.body;
  if (!password) {
    throw new Error("Password Field is Missing");
  }
  if (Object.keys(req.body).length !== 1) {
    throw new Error("Only password field is allowed");
  }

  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    throw new Error("Please Enter a Strong Password");
  }
};

module.exports = {
  validateSignupData,
  validateLoginData,
  checkUserInput,
  validateProfileEditData,
  isValidPasswordData,
};
