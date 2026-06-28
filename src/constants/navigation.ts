import {
  Award,
  BookOpen,
  Bot,
  GraduationCap,
  Home,
  MessageSquare,
  Mic,
  PenLine,
  Search,
  Settings,
  Target,
  User,
  Users,
  Video,
} from "lucide-react";
import type { NavItem } from "@/types/navigation";

export const NAV_ITEMS: NavItem[] = [
  { labelKey: "home", href: "/", icon: Home },
  { labelKey: "search", href: "/search", icon: Search },
  { labelKey: "social", href: "/social", icon: Users },
  { labelKey: "messages", href: "/messages", icon: MessageSquare },
  { labelKey: "missions", href: "/missions", icon: Target },
  { labelKey: "courses", href: "/courses", icon: BookOpen },
  { labelKey: "achievements", href: "/achievements", icon: Award },
  { labelKey: "classroom", href: "/classroom", icon: Video },
  { labelKey: "quiz", href: "/quiz", icon: GraduationCap },
  { labelKey: "createQuiz", href: "/quiz/create", icon: PenLine },
  { labelKey: "aiSpeaking", href: "/ai-speaking", icon: Mic },
  { labelKey: "teacherApply", href: "/teacher-apply", icon: Bot },
  { labelKey: "profile", href: "/profile", icon: User },
  { labelKey: "settings", href: "/settings", icon: Settings },
];

export const FOCUS_MODE_HIDDEN_ROUTES = ["/social", "/messages"];
