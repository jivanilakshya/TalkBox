const express = require("express");
const { addMessage, getLastMessage, getMessages } = require("../controllers/messageController");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.post("/", addMessage);

router.get("/:senderId/:receiverId", getMessages);

router.get("/lastMessage/:senderId/:receiverId", getLastMessage);

module.exports = router; 