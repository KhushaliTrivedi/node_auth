const jwt = require("jsonwebtoken");

// API Status
exports.success = "success";
exports.failure = "failure";

// Error Messages
exports.errors = {
    server: "Server Error, Please try again Later!",
    invalid_data: "Invalid Data!",
    invalid_email: "Please provide valid Email Address!",
    invalid_password_email: "Invalid Email or Password!",
    empty_password: "Password can not be empty!",
    user_exist: "An account exist with this email, please try another one!",
};

// CRUD messages
exports.messages = {
    registerSuccess: (entity) => `${entity} registered successfully!`,
};

// Generate JWT token
exports.generate_token = async (name, value) => {
    const tokenPayload = { [name]: value };
    const token = await jwt.sign(tokenPayload, process.env.JWT_SECRET_TOKEN_SIGNATURE);
    // const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN_SIGNATURE);
    // console.log('Decoded Token:', decoded);
    return token;
  }