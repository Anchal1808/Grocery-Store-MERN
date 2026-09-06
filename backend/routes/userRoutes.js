const express = require("express");
const { registerUser, loginUser, getUserProfile } = require("../controllers/userController");
const authUser = require("../middleware/auth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authUser, getUserProfile);

module.exports = router;
