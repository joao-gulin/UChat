import express from "express";
import type { Request, Response } from "express";
import type { RequestHandler } from "express";
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
    origin: "http://localhost:3000",
  },
});

// Store typing users for each channel
const typingUsers = new Map<string, Set<string>>();

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
    // Clean up typing indicators when user disconnects
    typingUsers.forEach((users, channelId) => {
      if (users.has(socket.id)) {
        users.delete(socket.id);
        io.to(channelId).emit("stopTyping", { userId: socket.id });
      }
    });
  });

  socket.on("joinChannel", async (channelId) => {
    socket.join(channelId);
    console.log(`User joined channel: ${channelId}`);
    
    // Send existing messages for the channel
    const messages = await prisma.message.findMany({
      where: { channelId },
      include: { user: true },
      orderBy: { createdAt: "asc" },
    });
    socket.emit("messages", messages);
  });

  socket.on("message", async (data) => {
    const { content, userId, channelId } = data;
    try {
      const message = await prisma.message.create({
        data: {
          content,
          userId,
          channelId,
        },
        include: {
          user: true,
        },
      });
      io.to(channelId).emit("message", message);
    } catch (error) {
      console.error("Error saving message:", error);
      socket.emit("error", "Failed to send message");
    }
  });

  socket.on("typing", ({ channelId, userId, username }) => {
    if (!typingUsers.has(channelId)) {
      typingUsers.set(channelId, new Set());
    }
    typingUsers.get(channelId)?.add(socket.id);
    socket.to(channelId).emit("typing", { userId, username });
  });

  socket.on("stopTyping", ({ channelId, userId }) => {
    typingUsers.get(channelId)?.delete(socket.id);
    socket.to(channelId).emit("stopTyping", { userId });
  });
});

app.post("/api/servers", async (req, res) => {
  const { name } = req.body;
  const server = await prisma.server.create({
    data: {
      name,
    },
  });
  res.json(server);
});

app.post("/api/channels", async (req, res) => {
  const { name, serverId } = req.body;
  const channel = await prisma.channel.create({
    data: {
      name,
      serverId,
    },
  });
  res.json(channel);
});

app.get("/api/servers", async (req, res) => {
  const servers = await prisma.server.findMany({
    include: {
      channels: true,
    },
  });
  res.json(servers);
});

// Get channels for a specific server
app.get("/api/channels", async (req, res) => {
  const { serverId } = req.query;
  const channels = await prisma.channel.findMany({
    where: {
      serverId: String(serverId),
    },
  });
  res.json(channels);
});

// Get messages for a specific channel (old endpoint)
app.get("/messages", async (req, res) => {
  const { channelId } = req.query;
  const messages = await prisma.message.findMany({
    where: {
      channelId: String(channelId),
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  res.json(messages);
});

// Create a new message
app.post("/api/messages", (async (req: Request, res: Response) => {
  try {
    const { content, userId, channelId } = req.body;

    if (!content || !userId || !channelId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user exists, if not create a temporary one
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      // Create a temporary user based on socket ID
      try {
        user = await prisma.user.create({
          data: {
            id: userId,
            username: `User-${userId.substring(0, 5)}`,
            email: `user-${userId.substring(0, 5)}@example.com`,
            password: `password-${userId}`,
          },
        });
      } catch (error) {
        console.error("Failed to create user, using socket ID only");
      }
    }

    // Create message with either the existing/new user or without user relation
    try {
      const message = await prisma.message.create({
        data: {
          content,
          userId,
          channelId,
        },
        include: {
          user: true,
        },
      });

      // Emit the message to all users in the channel
      io.to(channelId).emit("message", message);

      res.status(201).json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ error: "Failed to create message", details: error });
    }
  } catch (error) {
    console.error("Error in messages route:", error);
    res.status(500).json({ error: "Failed to process message", details: error });
  }
}) as RequestHandler);

// Get messages for a specific channel
app.get("/api/messages", (async (req: Request, res: Response) => {
  try {
    const { channelId } = req.query;

    if (!channelId) {
      return res.status(400).json({ error: "Channel ID is required" });
    }

    // Verify channel exists
    const channel = await prisma.channel.findUnique({
      where: { id: String(channelId) },
    });

    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const messages = await prisma.message.findMany({
      where: {
        channelId: String(channelId),
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
}) as RequestHandler);

const PORT = process.env.PORT || 5050;

server.listen(PORT, () => {
  console.log("Server is running on port: ", PORT);
});
