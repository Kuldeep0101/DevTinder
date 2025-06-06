const validateSignupData = async function (req) {
    const {
        firstName,
        lastName,
        emailId,
        password
    } = req.body;
    if (!firstName || !lastName || !emailId || !password) {
        throw new Error("Please enter valid credentials");
    } else if (firstName.length < 4 || firstName.length > 20) {
        throw new Error("First name should be 4-20 charachters");
    } else if (lastName.length < 4 || lastName.length > 20) {
        throw new Error("Last name should be 4-20 charachters");
    }
};

module.exports = validateSignupData