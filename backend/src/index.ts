import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("send_message", (data) => {
    console.log("Message Receveid", data);

    io.emit("receive_message", data);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server is running on port: ", PORT);
});

