const asyncHandler = require("express-async-handler");
const userService = require("../services/userService");
const User = require('../models/userModel'); 
const {sendEmail}= require('../middleware/Sendemail')
const bcrypt = require('bcrypt');

// @desc    Register new user
// @route   POST /users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, image, email, password } = req.body;

  try {
    const user = await userService.registerUser(name, image, email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @desc    Authenticate a user
// @route   POST /users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userService.loginUser(email, password);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


const editProfile = async (req, res) => {
  const {id, name,email, password} = req.body;
  try {
    const user = await userService.editProfile(id,name,email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



// @desc    Forgot password
// @route   POST /users/forgotPassword
// @access  Public
const forgetPassword = asyncHandler(async (req, res) => {
  try {
    const {email} = req.body;
    console.log(email)
    const userExist = await User.findOne({email});
    console.log(userExist)
    if(!userExist){
      return res.status(400).json({
        success: false,
        message: "User with this email does not exist",
      });
    }
    console.log("adf")
    const resetToken = await userExist.getResetPasswordCode();
    await userExist.save()
    await sendEmail({
      email: userExist.email,
      subject: "Reset Password",
      message: `Use the following password verification code to change your password.This code is valid only for 10 mins. Your password reset code is: ${resetToken} If you have not requested this email then please ignore it,`

    })
    console.log("dfgfgdfg")
    console.log(resetToken);
    res.status(200).json({
      success: true,
      resetToken,
      message: `Reset password verification code sent to ${email}`,
    });
  }   
  catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Reset password
// @route   POST /users/resetPassword
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  try {
    const {resetPasswordToken} = req.body;
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordDate: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset password verification code is invalid or has been expired",
      });
    }
    user.resetPasswordToken = undefined;
    user.resetPasswordDate = undefined;
    await user.save();
    res.status(200).json({
      success: true,
      email:user.email,
      message: "Password reset code verified successfully",
    });
  } catch(err){
    console.log(err);
    res.sendStatus(400);
  }
});

// @desc    Set new password
// @route   POST /users/setNewPassword
// @access  Public
const setNewPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email)
    console.log(password)
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Find the user by email
    const userExist = await User.findOne({ email });
    
    if (!userExist) {
      return res.status(400).json({
        success: false,
        message: "User with this email does not exist",
      });
    }

    // Update the user's password
    userExist.password = hashedPassword;
    await userExist.save();

    res.status(200).json({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.error("Error resetting password:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  editProfile,
  forgetPassword,
  setNewPassword,
  resetPassword
 
};
