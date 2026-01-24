import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Get or create a conversation between two users
export const getOrCreateConversation = asyncHandler(async (req, res) => {
  const { participantId } = req.body;
  const userId = req.user._id;

  if (!participantId) {
    throw new ApiError(400, "Participant ID is required");
  }

  if (participantId === userId.toString()) {
    throw new ApiError(400, "Cannot create conversation with yourself");
  }

  // Check if participant exists
  const participant = await User.findById(participantId);
  if (!participant) {
    throw new ApiError(404, "Participant not found");
  }

  // Check if conversation already exists
  let conversation = await Conversation.findOne({
    participants: { $all: [userId, participantId] },
  }).populate("participants", "name email role");

  // If not, create new conversation
  if (!conversation) {
    conversation = await Conversation.create({
      participants: [userId, participantId],
      unreadCount: {
        [userId]: 0,
        [participantId]: 0,
      },
    });
    conversation = await Conversation.findById(conversation._id).populate(
      "participants",
      "name email role"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, conversation, "Conversation retrieved successfully"));
});

// Get all conversations for a user
export const getUserConversations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const conversations = await Conversation.find({
    participants: userId,
  })
    .populate("participants", "name email role")
    .sort({ lastMessageTime: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, conversations, "Conversations retrieved successfully"));
});

// Get messages for a conversation
export const getConversationMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user._id;
  const { page = 1, limit = 50 } = req.query;

  // Check if conversation exists and user is a participant
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  if (!conversation.participants.includes(userId)) {
    throw new ApiError(403, "You are not a participant in this conversation");
  }

  const skip = (page - 1) * limit;

  const messages = await Message.find({ conversationId })
    .populate("sender", "name email role")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Message.countDocuments({ conversationId });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        messages: messages.reverse(), // Reverse to show oldest first
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalMessages: total,
          hasMore: skip + messages.length < total,
        },
      },
      "Messages retrieved successfully"
    )
  );
});

// Send a message
export const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId, content } = req.body;
  const userId = req.user._id;

  if (!conversationId || !content) {
    throw new ApiError(400, "Conversation ID and content are required");
  }

  // Check if conversation exists and user is a participant
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  if (!conversation.participants.includes(userId)) {
    throw new ApiError(403, "You are not a participant in this conversation");
  }

  // Create message
  const message = await Message.create({
    conversationId,
    sender: userId,
    content: content.trim(),
  });

  // Update conversation
  const recipientId = conversation.participants.find(
    (p) => p.toString() !== userId.toString()
  );

  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: content.trim(),
    lastMessageTime: new Date(),
    $inc: {
      [`unreadCount.${recipientId}`]: 1,
    },
  });

  const populatedMessage = await Message.findById(message._id).populate(
    "sender",
    "name email role"
  );

  return res
    .status(201)
    .json(new ApiResponse(201, populatedMessage, "Message sent successfully"));
});

// Mark messages as read
export const markMessagesAsRead = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user._id;

  // Check if conversation exists and user is a participant
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  if (!conversation.participants.includes(userId)) {
    throw new ApiError(403, "You are not a participant in this conversation");
  }

  // Mark all unread messages in this conversation as read
  await Message.updateMany(
    {
      conversationId,
      sender: { $ne: userId },
      isRead: false,
    },
    {
      isRead: true,
      readAt: new Date(),
    }
  );

  // Reset unread count for this user
  await Conversation.findByIdAndUpdate(conversationId, {
    [`unreadCount.${userId}`]: 0,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Messages marked as read"));
});

// Get total unread count for a user
export const getUnreadCount = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const conversations = await Conversation.find({
    participants: userId,
  });

  let totalUnread = 0;
  conversations.forEach((conv) => {
    const count = conv.unreadCount.get(userId.toString());
    totalUnread += count || 0;
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { unreadCount: totalUnread }, "Unread count retrieved"));
});

// Search users to start a chat (for customers to find vendors and vice versa)
export const searchUsers = asyncHandler(async (req, res) => {
  const { role, search } = req.query;
  const userId = req.user._id;

  const query = {
    _id: { $ne: userId }, // Exclude current user
  };

  if (role) {
    query.role = role;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const users = await User.find(query)
    .select("name email role")
    .limit(20);

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users retrieved successfully"));
});
