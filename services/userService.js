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

  async editProfile(id,name,email, password) {
    console.log(id,name,email,password)
    if (!name || !email || !password) {
      throw new Error("Please add all fields");
    }

    

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
      // Update the user's profile with the new information
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          name,
          email,
          password: hashedPassword,
        },
        { new: true } // Return the updated document
      );
  
      if (!updatedUser) {
        throw new Error("User not found");
      }
  
      console.log("Profile updated successfully:", updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Error updating profile:", error.message);
      throw error;
    }

  }

}

module.exports = new UserService();
