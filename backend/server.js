const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const userRoute = require("./routes/userRoute");
const userFriendRoute = require("./routes/userFriendRoute");
const messageRoute = require("./routes/messageRoute");

// Load environment variables
dotenv.config();

// Set mongoose strictQuery option
mongoose.set('strictQuery', false);

class Connection {
    constructor() {
        this.app = express();
        this.http = http.createServer(this.app);
        this.io = new Server(this.http, {
            cors: {
                origin: "*"
            }
        });
        this.activeUsers = [];
    }

    test() {
        this.app.get("/", (req, res) => {
            res.status(200).json("Testing server!");
        })
    }

    useMiddleWares() {
        this.app.use(express.json({limit: "50mb"}));
        this.app.use(cors());
    }

    initializeRoutes() {
        this.app.use("/api/user", userRoute);
        this.app.use("/api/friend", userFriendRoute);
        this.app.use("/api/message", messageRoute);
    }

    initSocketConnection() {
        this.io.on("connection", (socket) => {
            socket.on("add-new-user", (userId) => {
                if (!this.activeUsers.find(user => user.userId === userId) && userId) {
                    this.activeUsers.push({
                        userId,
                        socketId: socket.id
                    });
                    this.io.emit("get-online-users", this.activeUsers);
                }
            })

            socket.on("send-message", data => {
                const { receiverId } = data;
                const user = this.activeUsers.find(user => user.userId === receiverId);
                
                if (user) {
                    this.io.to(user.socketId).emit("receive-message", data);
                }
            })

            socket.on("disconnect", () => {
                this.activeUsers = this.activeUsers.filter(user => user.socketId !== socket.id);
                this.io.emit("get-online-users", this.activeUsers);
            })
        })
    }

    listen() {
        this.http.listen(process.env.PORT, () => {
            console.log("Server started on port", process.env.PORT);
        });
    }

    async connectToDB() {
        try {
            if (!process.env.MONGO_URI) {
                throw new Error("MongoDB URI is not defined in environment variables");
            }
            await mongoose.connect(process.env.MONGO_URI);
            console.log("Connected to MongoDB successfully");
            this.listen();
        } catch (error) {
            console.error("Error connecting to MongoDB:", error.message);
            process.exit(1);
        }
    }
}

const server = new Connection();

server.useMiddleWares();
server.initializeRoutes();
server.initSocketConnection();
server.test();
server.connectToDB();