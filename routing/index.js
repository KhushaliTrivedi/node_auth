const express = require("express");
const router = express.Router();
const indexController = require("../controller/index.controller");

// User Auth
router.route("/sign_up").post(indexController.sign_up);
router.route("/login").post(indexController.login);

module.exports = router;
