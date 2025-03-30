const express = require("express");
const { deleteAccount, findUser, Login, signUp, updateUser } = require("../controllers/userController");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

router.post("/signup", signUp);

router.post("/login", Login);

router.delete("/delete/:id", deleteAccount);

router.get("/:userName", findUser);

router.put("/update", requireAuth, updateUser);

module.exports = router; 