const validateSignupData =  function (req) {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName || !emailId || !password) {
    throw new Error("Please enter valid credentials");
  } else if (firstName.length < 4 || firstName.length > 20) {
    throw new Error("First name should be 4-20 charachters");
  } else if (lastName.length < 4 || lastName.length > 20) {
    throw new Error("Last name should be 4-20 charachters");
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

const isValidPassword = (password) => {
  if (!password) throw new Error("Password Field Can not be Empty");
};

module.exports = {
  validateSignupData,
  validateProfileEditData,
  checkFName,
  checkLName,
  isValidPassword,
};
