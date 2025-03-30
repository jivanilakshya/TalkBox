const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        unique: true,
        required: true
    },
    displayPicture: {
        type: String
    }
});

userSchema.statics.signup = async function (email, password, userName, displayPicture) {
    if (!email || !password || !userName) {
        throw new Error("All fields are required");
    }

    const exists = await this.findOne({ email });

    if (exists) {
        throw new Error("User already exists")
    }

    const username = await this.findOne({ userName });

    if (username) {
        throw new Error("Username is already in use");
    }

    if (password.length < 6) {
        throw new Error("Password must be greater than six characters");
    }

    const user = await this.create({email, password, userName, displayPicture});
    
    return user;
}

userSchema.statics.login = async function (email, password, userName) {
    if ((!email && !userName) || !password) {
        throw new Error("All fields are required");
    }

    const user = await this.findOne({ $or: [ { email }, { userName}]});

    if (!user) {
        throw new Error("Incorrect email or username");
    }

    if (password !== user.password) {
        throw new Error("Password is incorrect");
    }

    return user;
}

module.exports = mongoose.model("users", userSchema); 