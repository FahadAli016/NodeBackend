const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"] // Corrected "required" spelling
    },
    image: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "Please add an email"], // Corrected "required" spelling
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please add a strong password"], // Corrected "required" spelling
    },
    resetPasswordToken: String,
    resetPasswordDate: Date
}, {
    timestamps: true
});

userSchema.methods.getResetPasswordCode = function () {
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += Math.floor(Math.random() * 10); // Generate a random digit between 0 and 9
    }
    this.resetPasswordToken = code;
    this.resetPasswordDate = Date.now() + 10 * 60 * 1000; // 10 mins
  
    return code;
  };

module.exports = mongoose.model('User', userSchema);
