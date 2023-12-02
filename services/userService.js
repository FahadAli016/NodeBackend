const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const { config } = require("../config/settings");

class UserService {
  async registerUser(name, image, email, password) {
    if (!name || !email || !password) {
      throw new Error("Please add all fields");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await new User({
      name,
      image,
      email,
      password: hashedPassword,
    }).save();

    if (user) {
      return {
        _id: user.id,
        name: user.name,
        image: user.image,
        email: user.email,
        token: this.generateToken(user._id),
      };
    } else {
      throw new Error("Invalid user data");
    }
  }

  async loginUser(email, password) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const passwordMatched = await bcrypt.compare(password, user.password);

    if (passwordMatched) {
      return {
        _id: user.id,
        name: user.name,
        image: user.image,
        email: user.email,
        token: this.generateToken(user._id),
      };
    } else {
      throw new Error("Invalid credentials");
    }
  }

  generateToken(id) {
    return jwt.sign({ id }, config.jwtSecret, { expiresIn: "30d" });
  }
}

module.exports = new UserService();
