const express = require("express");
const { addFriend, getFriends } = require("../controllers/userFriendController");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.post("/addFriend", addFriend);

router.get("/", getFriends);

module.exports = router; 