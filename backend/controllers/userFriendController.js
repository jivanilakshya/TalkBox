const mongoose = require("mongoose");
const Friend = require("../models/userFriendModel");

async function addFriend(req, res) {
    const { userId, friendId, friendImage, friendUsername, userName } = req.body;

    const friend = new Friend({
        friendDetails: {
            userId,
            friendId,
            friendImage,
            friendUsername,
            userName
        }
    });

    try {
        const exists = await Friend.find({
            "friendDetails.userId": userId,
            "friendDetails.friendId": friendId,
        });

        if (exists.length > 0) {
            console.log(exists)
            return res.status(401).json({error: "User already exists in your collection"});
        }

        const uId = req.user._id;

        const isSelf = uId.toString() === userId;

        if (isSelf) {
            // return res.status(400).json({error: "You can't add yourself."});
        }

        const f = await friend.save();
        res.status(200).json({_id: f._id, userId, friendId, friendImage, userName, friendUsername});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

async function getFriends(req, res) {
    const uId = req.user._id;
    try {
        const friends = await Friend.find({
            $or: [
                { "friendDetails.userId": uId }, { "friendDetails.friendId": uId}
            ]
        });
        
        res.status(200).json(friends);

    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

module.exports = {
    addFriend,
    getFriends
}; 