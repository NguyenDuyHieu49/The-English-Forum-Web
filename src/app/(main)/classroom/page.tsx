"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Hand,
  MessageSquare,
  Mic,
  MicOff,
  MonitorUp,
  Users,
  Video,
  VideoOff,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FocusCamera } from "@/components/focus/focus-camera";
import { MouseBehaviorWarning } from "@/components/focus/mouse-behavior-warning";
import { MOCK_CLASSROOM } from "@/mock/classroom";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

export default function ClassroomPage() {
  const [micOn, setMicOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const focusMode = useAppStore((s) => s.focusMode);

  return (
    <div className="space-y-4">
      <MouseBehaviorWarning enabled />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{MOCK_CLASSROOM.title}</h1>
          <p className="text-sm text-muted-foreground">
            {MOCK_CLASSROOM.teacher} · {MOCK_CLASSROOM.members.length} members
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <div className="lg:col-span-3 space-y-4">
          <Card className="overflow-hidden">
            <div className="relative flex aspect-video items-center justify-center bg-zinc-900">
              <div className="text-center text-white/60">
                <MonitorUp className="mx-auto mb-2 h-12 w-12" />
                <p className="text-sm">Teacher Screen Share</p>
                <p className="text-xs">IELTS Speaking Part 2 — Slide 8/18</p>
              </div>
              {!focusMode && (
                <div className="absolute bottom-4 right-4">
                  <FocusCamera className="h-28 w-36" />
                </div>
              )}
            </div>
          </Card>

          <div className="flex items-center justify-center gap-3">
            <Button
              variant={micOn ? "default" : "outline"}
              size="icon"
              onClick={() => setMicOn(!micOn)}
              aria-label="Toggle microphone"
            >
              {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>
            <Button
              variant={cameraOn ? "default" : "outline"}
              size="icon"
              onClick={() => setCameraOn(!cameraOn)}
              aria-label="Toggle camera"
            >
              {cameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </Button>
            <Button
              variant={handRaised ? "default" : "outline"}
              size="icon"
              onClick={() => setHandRaised(!handRaised)}
              aria-label="Raise hand"
            >
              <Hand className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" aria-label="Screen share">
              <MonitorUp className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {MOCK_CLASSROOM.members.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="overflow-hidden">
                  <div className="relative flex aspect-video items-center justify-center bg-muted">
                    {member.cameraOn ? (
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <VideoOff className="h-8 w-8 text-muted-foreground" />
                    )}
                    {member.handRaised && (
                      <span className="absolute right-2 top-2 text-lg">✋</span>
                    )}
                  </div>
                  <CardContent className="flex items-center justify-between p-2">
                    <span className="truncate text-xs font-medium">{member.name}</span>
                    <div className="flex gap-1">
                      {member.micOn ? (
                        <Mic className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <MicOff className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <MessageSquare className="h-4 w-4" />
                Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="max-h-48 space-y-2 overflow-y-auto">
                {MOCK_CLASSROOM.chat.map((msg) => (
                  <div key={msg.id} className="text-xs">
                    <span className="font-semibold">{msg.sender}: </span>
                    <span className="text-muted-foreground">{msg.text}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                Members ({MOCK_CLASSROOM.members.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {MOCK_CLASSROOM.members.map((m) => (
                <div key={m.id} className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={m.avatar} alt={m.name} />
                    <AvatarFallback>{m.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="flex-1 truncate text-xs">{m.name}</span>
                  <span
                    className={cn(
                      "text-[10px] capitalize",
                      m.role === "teacher"
                        ? "text-violet-500"
                        : "text-muted-foreground"
                    )}
                  >
                    {m.role}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4" />
                Files
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {MOCK_CLASSROOM.files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-2 rounded-lg bg-muted/50 p-2"
                >
                  <FileText className="h-4 w-4 shrink-0 text-violet-500" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{file.name}</p>
                    <p className="text-[10px] text-muted-foreground">{file.size}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
