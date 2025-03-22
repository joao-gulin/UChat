import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(cors());
app.use(express.json());
const prisma = new PrismaClient();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("joinServer", async (serverId) => {
    socket.join(serverId);
    console.log(`User joined server: ${serverId}`);
  });

  socket.on("sendMessage", async (data) => {
    const { content, userId, channelId } = data;
    const message = await prisma.message.create({
      data: {
        content,
        userId,
        channelId,
      },
    });
    io.to(channelId).emit("receiveMessage", message);
  });
});

app.post("/createServer", async (req, res) => {
  const { name } = req.body;
  const server = await prisma.server.create({
    data: {
      name,
    },
  });
  res.json(server);
});

app.post("/createChannel", async (req, res) => {
  const { name, serverId } = req.body;
  const channel = await prisma.channel.create({
    data: {
      name,
      serverId,
    },
  });
  res.json(channel);
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server is running on port: ", PORT);
});
