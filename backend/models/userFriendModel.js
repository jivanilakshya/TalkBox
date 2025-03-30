const mongoose = require("mongoose");

const userFriendSchema = new mongoose.Schema({
    friendDetails: {
        type: Map,
        of: String
    }
});

module.exports = mongoose.model("userFriends", userFriendSchema); 