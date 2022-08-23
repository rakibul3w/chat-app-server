const express = require("express");
const app = express();
const connectDB = require('./config/db');
const http = require("http");
const port = process.env.PORT || 5000;
const { Server } = require("socket.io");
const cors = require("cors");
require('dotenv').config();
app.use(express.json());

app.use(cors());

// connect with database
connectDB();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("send_message", (data) => {
        socket.emit("receive_message", data);
    });
});

server.listen(port, () => {
    console.log("SERVER IS RUNNING");
});