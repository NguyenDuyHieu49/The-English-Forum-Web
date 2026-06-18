import type { Post, Story } from "@/types/social";

export const MOCK_STORIES: Story[] = [
  { id: "s1", user: { id: "u1", name: "Sarah Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", role: "Professor" }, image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=200&h=300&fit=crop", viewed: false },
  { id: "s2", user: { id: "u2", name: "James Wilson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James", role: "Professor" }, image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=200&h=300&fit=crop", viewed: true },
  { id: "s3", user: { id: "u3", name: "Emily R.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily", role: "Designer" }, image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200&h=300&fit=crop", viewed: false },
  { id: "s4", user: { id: "u4", name: "Alex Kim", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", role: "Researcher" }, image: "https://images.unsplash.com/photo-1531487816587-188a2d3b5b7a?w=200&h=300&fit=crop", viewed: false },
];

export const MOCK_POSTS: Post[] = [
  {
    id: "p1",
    user: { id: "u1", name: "Sarah Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", role: "Professor" },
    content: "Just published a new module on accessibility in HCI! Remember: good design is inclusive design. 🌟",
    image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600&h=400&fit=crop",
    likes: 234,
    shares: 45,
    saved: true,
    createdAt: "2h ago",
    comments: [
      { id: "c1", user: { id: "u5", name: "Tom Baker", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom", role: "Student" }, text: "This is incredibly helpful! Thank you professor.", createdAt: "1h ago", likes: 12 },
      { id: "c2", user: { id: "u6", name: "Priya Patel", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya", role: "Student" }, text: "The WCAG examples were perfect.", createdAt: "45m ago", likes: 8 },
    ],
  },
  {
    id: "p2",
    user: { id: "u3", name: "Emily Rodriguez", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily", role: "Designer" },
    content: "Completed my UX portfolio project using Figma! Feedback welcome 🎨",
    likes: 189,
    shares: 23,
    saved: false,
    createdAt: "5h ago",
    comments: [
      { id: "c3", user: { id: "u7", name: "Marcus Lee", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus", role: "Developer" }, text: "Love the color palette choices!", createdAt: "3h ago", likes: 15 },
    ],
  },
  {
    id: "p3",
    user: { id: "u8", name: "Study Group Alpha", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alpha", role: "Group" },
    content: "🎉 We hit a 30-day study streak! Consistency is key. Who's joining us for the ML quiz tonight?",
    likes: 456,
    shares: 67,
    saved: false,
    createdAt: "8h ago",
    comments: [],
  },
];
