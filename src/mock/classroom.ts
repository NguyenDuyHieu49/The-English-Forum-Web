import type { ClassroomSession } from "@/types/classroom";

export const MOCK_CLASSROOM: ClassroomSession = {
  id: "class-1",
  title: "IELTS Speaking Practice — Live Session",
  teacher: "Emily Walsh",
  members: [
    { id: "t1", name: "Emily Walsh", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily", role: "teacher", micOn: true, cameraOn: true, handRaised: false },
    { id: "s1", name: "You", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You", role: "student", micOn: false, cameraOn: true, handRaised: false },
    { id: "s2", name: "Tom Baker", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom", role: "student", micOn: false, cameraOn: false, handRaised: true },
    { id: "s3", name: "Priya Patel", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya", role: "student", micOn: true, cameraOn: true, handRaised: false },
    { id: "s4", name: "Minh Tran", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Minh", role: "student", micOn: false, cameraOn: true, handRaised: false },
  ],
  chat: [
    { id: "ch1", sender: "Emily Walsh", text: "Welcome everyone! Today we'll practice IELTS Speaking Part 2 cue cards.", timestamp: "10:00 AM" },
    { id: "ch2", sender: "Tom Baker", text: "Ready to practice! My target band is 7.0.", timestamp: "10:01 AM" },
    { id: "ch3", sender: "Priya Patel", text: "Can we review useful linking phrases first?", timestamp: "10:02 AM" },
    { id: "ch4", sender: "Emily Walsh", text: "Great idea — let's start with discourse markers like 'Furthermore' and 'On the other hand'.", timestamp: "10:03 AM" },
  ],
  files: [
    { id: "f1", name: "IELTS_Speaking_Part2_CueCards.pdf", type: "pdf", size: "1.8 MB", uploadedBy: "Emily Walsh" },
    { id: "f2", name: "Band_Descriptors_Speaking.pdf", type: "pdf", size: "920 KB", uploadedBy: "Emily Walsh" },
    { id: "f3", name: "Useful_Phrases_Worksheet.docx", type: "doc", size: "640 KB", uploadedBy: "Emily Walsh" },
  ],
};
