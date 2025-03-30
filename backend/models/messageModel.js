const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true
    },
    receiverId: {
        type: String,
        required: true
    },
    text: {
        type: String,
    },
    image: {
        type: String
    },
    audio: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model("messages", messageSchema); 