import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
app.use(cors());
app.use(express.json());

let users: any[] = [];
const messages: Partial<Record<string, any[]>> = {
  general: [],
};

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://localhost:3000",
  },
});

io.on("connection", (socket) => {
  socket.on("join server", (username: string) => {
    const user = {
      username,
      id: socket.id,
    };
    users.push(user);
    io.emit("New User", users);
  });

  socket.on("join room", (roomName: any, cb: any) => {
    socket.join(roomName);
    cb(messages[roomName]);
  });

  // Messaging rooms & private message logic
  socket.on("send message", ({ content, to, sender, chatName, isChannel }) => {
    if (isChannel) {
      const payload = {
        content,
        chatName,
        sender,
      };
      socket.to(to).emit("new message", payload);
    } else {
      const payload = {
        content,
        chatName: sender,
        sender,
      };
      socket.to(to).emit("new message", payload);
    }
  });

  socket.on("disconnect", () => {
    users = users.filter((u) => u.id !== socket.id);
    io.emit("new user", users);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server is running on port: ", PORT);
});

