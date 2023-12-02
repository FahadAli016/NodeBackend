const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        requierd: [true, "Please add a name"]
    },
    image: {
        type: String,
    },
    email: {
        type: String,
        requierd: [true, "Please add an email"],
        unique: true
    },
    password: {
        type: String,
        requierd: [true, "Please add a strong password"]
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema);