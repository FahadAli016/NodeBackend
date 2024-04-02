const express = require("express");
const router = express.Router();
const { registerUser, loginUser,editProfile, forgetPassword, resetPassword, setNewPassword} = require("../controllers/userController");;

router.post("/", registerUser);
router.post("/login", loginUser);
router.put('/editProfile',editProfile);
router.post("/forgetPassword", forgetPassword);
router.post("/resetPassword", resetPassword);
router.put('/setNewPassword',setNewPassword);


module.exports = router;