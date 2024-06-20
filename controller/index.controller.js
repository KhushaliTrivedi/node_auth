const sequelize = require("sequelize")
const Op = sequelize.Op
const {
    sequelize: Sequelize,
    user,
} = require("../models");
const constant = require("../utils/constant");
const bcrypt = require("bcryptjs");

class indexController {

    // Sign Up User API
    async sign_up(req, res) {
        try {
            if (!req.body) {
                return res.json({
                    status: constant.failure,
                    message: constant.errors.invalid_data,
                });
            }

            // Validate if Email is not undefined or empty
            if (!req.body.email || req.body.email == "") {
                return res.json({
                    status: constant.failure,
                    message: constant.errors.invalid_email,
                });
            }

            // Validate if Password is not undefined or empty
            if (!req.body.password || req.body.password == "") {
                return res.json({
                    status: constant.failure,
                    message: constant.errors.empty_password,
                });
            }

            const { name, email, password, gender, activity } = req.body;

            // Check if user already exist or not 
            const user_exist = await user.findOne({
                where: {
                    email: email,
                },
            })
            if (user_exist) {
                return res.json({
                    status: constant.failure,
                    msg: constant.errors.user_exist,
                });
            }

            // convert plain text password in hased form using bcrypt
            const hashedPassword = await bcrypt.hash(password, 10);

            let user_dt = {
                name,
                gender,
                email,
                password: hashedPassword,
                activity,
                active: true
            }

            // Insert User's data into database table "User"
            const newUser = await user.create(user_dt);
            if (newUser) {
                return res.json({
                    status: constant.success,
                    message: constant.messages.registerSuccess("User")
                });
            } else {
                return res.json({
                    status: constant.failure,
                    message: constant.errors.server
                });
            }
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                status: constant.failure,
                message: e.message,
            })
        }
    }

    // Login User API
    async login(req, res) {
        try {
            if (!req.body) {
                return res.json({
                    status: constant.failure,
                    message: constant.errors.invalid_data,
                });
            }

            // Validate if Email is not undefined or empty
            if (!req.body.email || req.body.email == "") {
                return res.json({
                    status: constant.failure,
                    message: constant.errors.invalid_email,
                });
            }

            // Validate if Password is not undefined or empty
            if (!req.body.password || req.body.password == "") {
                return res.json({
                    status: constant.failure,
                    message: constant.errors.empty_password,
                });
            }

            const { email, password } = req.body;

            // Check if user exist or not 
            const user_exist = await user.findOne({
                where: {
                    email: email,
                },
            })
            if (!user_exist) {
                return res.json({
                    status: constant.failure,
                    msg: constant.errors.user_not_found,
                });
            }

            // check if password is not empty
            if (user_exist.password != null) {
                // Compare password to validate if it's correct or not
                const is_match = await bcrypt.compare(password, user_exist.password);
                if (is_match) {
                    // Generate JWT token
                    const token = await constant.generate_token("email", email);
                    // Update token in database
                    const update_user = await user.update({ token }, {
                        where: { email },
                    });
                    if (update_user[0]) {
                        return res.json({ status: constant.success, token });
                    } else {
                        return res.json({ status: constant.failure, msg: constant.errors.server });
                    }
                } else {
                    return res.json({ status: constant.failure, msg: constant.errors.invalid_password_email });
                }
            } else {
                return res.json({ status: constant.failure, msg: constant.errors.invalid_password_email });
            }
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                status: constant.failure,
                message: e.message,
            })
        }
    }
}

module.exports = new indexController()
