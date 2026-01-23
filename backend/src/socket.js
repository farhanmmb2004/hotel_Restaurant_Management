import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { Message } from "./models/message.model.js";
import { Conversation } from "./models/conversation.model.js";

// Store active connections: userId -> socketId
const activeUsers = new Map();

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Middleware to authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error("Authentication error: Token not provided"));
      }

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      socket.userId = decoded._id;
      socket.userRole = decoded.role;
      socket.userName = decoded.name;
      
      next();
    } catch (error) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.userId} (${socket.userName})`);
    
    // Store active user
    activeUsers.set(socket.userId, socket.id);
    
    // Emit online status to all users
    io.emit("user:online", { userId: socket.userId });

    // Join user to their personal room
    socket.join(socket.userId);

    // Join conversation rooms
    socket.on("conversation:join", async (conversationId) => {
      try {
        // Verify user is a participant in the conversation
        const conversation = await Conversation.findById(conversationId);
        if (conversation && conversation.participants.includes(socket.userId)) {
          socket.join(conversationId);
          console.log(`User ${socket.userId} joined conversation ${conversationId}`);
        }
      } catch (error) {
        console.error("Error joining conversation:", error);
      }
    });

    // Leave conversation room
    socket.on("conversation:leave", (conversationId) => {
      socket.leave(conversationId);
      console.log(`User ${socket.userId} left conversation ${conversationId}`);
    });

    // Send message
    socket.on("message:send", async (data) => {
      try {
        const { conversationId, content } = data;

        // Verify user is a participant
        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.participants.includes(socket.userId)) {
          socket.emit("error", { message: "Not authorized" });
          return;
        }

        // Create message
        const message = await Message.create({
          conversationId,
          sender: socket.userId,
          content: content.trim(),
        });

        // Update conversation
        const recipientId = conversation.participants.find(
          (p) => p.toString() !== socket.userId
        );

        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: content.trim(),
          lastMessageTime: new Date(),
          $inc: {
            [`unreadCount.${recipientId}`]: 1,
          },
        });

        // Populate message with sender info
        const populatedMessage = await Message.findById(message._id).populate(
          "sender",
          "name email role"
        );

        // Emit to conversation room
        io.to(conversationId).emit("message:received", populatedMessage);

        // Notify recipient if they're online but not in the conversation room
        const recipientSocketId = activeUsers.get(recipientId.toString());
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("notification:newMessage", {
            conversationId,
            message: populatedMessage,
          });
        }

        console.log(`Message sent in conversation ${conversationId}`);
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Typing indicator
    socket.on("typing:start", (data) => {
      const { conversationId } = data;
      socket.to(conversationId).emit("typing:started", {
        userId: socket.userId,
        userName: socket.userName,
      });
    });

    socket.on("typing:stop", (data) => {
      const { conversationId } = data;
      socket.to(conversationId).emit("typing:stopped", {
        userId: socket.userId,
      });
    });

    // Mark messages as read
    socket.on("messages:markAsRead", async (data) => {
      try {
        const { conversationId } = data;

        // Verify user is a participant
        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.participants.includes(socket.userId)) {
          return;
        }

        // Mark messages as read
        await Message.updateMany(
          {
            conversationId,
            sender: { $ne: socket.userId },
            isRead: false,
          },
          {
            isRead: true,
            readAt: new Date(),
          }
        );

        // Reset unread count
        await Conversation.findByIdAndUpdate(conversationId, {
          [`unreadCount.${socket.userId}`]: 0,
        });

        // Notify the other participant
        socket.to(conversationId).emit("messages:read", {
          conversationId,
          readBy: socket.userId,
        });
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    });

    // Get online status
    socket.on("user:checkOnline", (userId) => {
      const isOnline = activeUsers.has(userId);
      socket.emit("user:onlineStatus", { userId, isOnline });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
      activeUsers.delete(socket.userId);
      
      // Emit offline status
      io.emit("user:offline", { userId: socket.userId });
    });
  });

  return io;
};

export const getActiveUsers = () => activeUsers;
