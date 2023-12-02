const asyncHandler = require("express-async-handler");
const userService = require("../services/userService");

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

module.exports = {
  registerUser,
  loginUser,
};
