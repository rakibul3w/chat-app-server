const express = require("express");
const http = require("http");
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;

const { Server } = require("socket.io");
const app = express();
const cors = require("cors");
require('dotenv').config();

const server = http.createServer(app);
app.use(express.json());
app.use(cors());

// connect with database
connectDB();
//routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);


// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"],
//     },
// });

// io.on("connection", (socket) => {
//     console.log(`User Connected: ${socket.id}`);

//     socket.on("send_message", (data) => {
//         socket.emit("receive_message", data);
//     });
// });

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.msg);
        }
    });
});



app.get('/', (req, res) => {
    res.send("Welcome client");
})

server.listen(port, () => {
    console.log("SERVER IS RUNNING AT ", port);
});