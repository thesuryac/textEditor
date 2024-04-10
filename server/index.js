import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user is connected ", socket.id);

  socket.on("type", (data) => {
    console.log(data);
    socket.broadcast.emit("receive", data);
  });

  socket.on("mouse", (mousePosition) => {
    console.log(mousePosition);
  });
  return () => {
    socket.disconnect();
  };
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
