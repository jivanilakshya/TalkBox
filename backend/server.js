const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const connectDB = require("./database/db");

const userRoute = require("./routes/userRoute");
const userFriendRoute = require("./routes/userFriendRoute");
const messageRoute = require("./routes/messageRoute");

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
            console.log(`Server started on http://localhost:${process.env.PORT}`);
        });
    }

    async start() {
        try {
            // Connect to database
            await connectDB();
            
            // Initialize server
            this.useMiddleWares();
            this.initializeRoutes();
            this.initSocketConnection();
            this.test();
            this.listen();
        } catch (error) {
            console.error("Error starting server:", error.message);
            process.exit(1);
        }
    }
}

const server = new Connection();
server.start();