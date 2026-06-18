export interface ClassroomMember {
  id: string;
  name: string;
  avatar: string;
  role: "teacher" | "student";
  micOn: boolean;
  cameraOn: boolean;
  handRaised: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
}

export interface ClassroomFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
}

export interface ClassroomSession {
  id: string;
  title: string;
  teacher: string;
  members: ClassroomMember[];
  chat: ChatMessage[];
  files: ClassroomFile[];
}
