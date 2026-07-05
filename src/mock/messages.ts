import type { Conversation } from "@/types/message";

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv1",
    participant: { id: "u1", name: "Emily Walsh", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily", online: true },
    lastMessage: "Great work on your IELTS Writing assignment!",
    lastMessageTime: "10m ago",
    unreadCount: 2,
    messages: [
      { id: "m1", senderId: "u1", text: "Hi! How's your IELTS preparation going?", timestamp: "Yesterday 3:00 PM", read: true },
      { id: "m2", senderId: "me", text: "Going well! I'm working on the speaking section.", timestamp: "Yesterday 3:15 PM", read: true },
      { id: "m3", senderId: "u1", text: "That's great. AI speaking practice is very helpful.", timestamp: "Yesterday 3:20 PM", read: true },
      { id: "m4", senderId: "u1", text: "Great work on your IELTS Writing assignment!", timestamp: "10m ago", read: false },
    ],
  },
  {
    id: "conv2",
    participant: { id: "u2", name: "James Park", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James", online: false },
    lastMessage: "The TOEIC quiz is ready for review",
    lastMessageTime: "2h ago",
    unreadCount: 0,
    messages: [
      { id: "m5", senderId: "u2", text: "I've updated the TOEIC quiz questions.", timestamp: "3h ago", read: true },
      { id: "m6", senderId: "me", text: "Thanks! I'll review them tonight.", timestamp: "2h ago", read: true },
      { id: "m7", senderId: "u2", text: "The TOEIC quiz is ready for review", timestamp: "2h ago", read: true },
    ],
  },
  {
    id: "conv3",
    participant: { id: "u9", name: "Study Buddy", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Buddy", online: true },
    lastMessage: "Ready for the group study session?",
    lastMessageTime: "1d ago",
    unreadCount: 1,
    messages: [
      { id: "m8", senderId: "u9", text: "Ready for the group study session?", timestamp: "1d ago", read: false },
    ],
  },
];
