const Message = require("../models/messageModel");

async function addMessage(req, res) {
    const { text, image, audio, senderId, receiverId } = req.body;
  
    try {
      const chat = await Message.create({ text, image, audio, senderId, receiverId });
      res.status(200).json(chat);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
}
  
async function getMessages(req, res) {
    const { senderId, receiverId } = req.params;

    try {
        const chats = await Message.find({
            $and: [
                {
                $or: [{ senderId: senderId }, { receiverId: senderId }],
                },
                {
                $or: [{ receiverId: receiverId }, { senderId: receiverId }],
                },
            ],
        }).sort({createdAt: 1});
        res.status(200).json(chats);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function getLastMessage(req, res) {
    const { senderId, receiverId } = req.params;
    const uId = req.user._id;

    try {
        const chats = await Message.findOne({
            $and: [
                {
                $or: [{ senderId: senderId }, { receiverId: senderId }],
                },
                {
                $or: [{ receiverId: receiverId }, { senderId: receiverId }],
                },
            ],
        }).sort({createdAt: -1}).select("text image audio").where("senderId").ne(uId);

        if (chats?.text === ""  || chats?.image || chats?.audio) {
            return res.status(200).json({text: "media-alt-send"})
        }
        
        res.status(200).json(chats);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    addMessage,
    getMessages,
    getLastMessage
}; 