import { Router } from "express";
import {
  getOrCreateConversation,
  getUserConversations,
  getConversationMessages,
  sendMessage,
  markMessagesAsRead,
  getUnreadCount,
  searchUsers,
} from "../controllers/chat.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(verifyToken);

// Search users to chat with
router.get("/search-users", searchUsers);

// Get or create conversation
router.post("/conversations", getOrCreateConversation);

// Get all conversations for user
router.get("/conversations", getUserConversations);

// Get messages for a conversation
router.get("/conversations/:conversationId/messages", getConversationMessages);

// Send a message (also available via REST, but WebSocket is preferred)
router.post("/messages", sendMessage);

// Mark messages as read
router.patch("/conversations/:conversationId/read", markMessagesAsRead);

// Get unread count
router.get("/unread-count", getUnreadCount);

export default router;
