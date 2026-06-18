"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MOCK_CONVERSATIONS } from "@/mock/messages";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState(MOCK_CONVERSATIONS[0].id);
  const [message, setMessage] = useState("");
  const conversation = MOCK_CONVERSATIONS.find((c) => c.id === selectedId)!;

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-2xl border border-border">
      <div className="w-80 shrink-0 border-r border-border bg-card/50">
        <div className="border-b border-border p-4">
          <h2 className="font-semibold">Messages</h2>
        </div>
        <div className="overflow-y-auto">
          {MOCK_CONVERSATIONS.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedId(conv.id)}
              className={cn(
                "flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-accent/50",
                selectedId === conv.id && "bg-violet-500/5"
              )}
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src={conv.participant.avatar} alt={conv.participant.name} />
                  <AvatarFallback>{conv.participant.name[0]}</AvatarFallback>
                </Avatar>
                {conv.participant.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="truncate font-medium">{conv.participant.name}</p>
                  <span className="text-[10px] text-muted-foreground">
                    {conv.lastMessageTime}
                  </span>
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {conv.lastMessage}
                </p>
              </div>
              {conv.unreadCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
                  {conv.unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-border p-4">
          <Avatar>
            <AvatarImage src={conversation.participant.avatar} alt={conversation.participant.name} />
            <AvatarFallback>{conversation.participant.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{conversation.participant.name}</p>
            <p className="text-xs text-muted-foreground">
              {conversation.participant.online ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {conversation.messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={cn(
                "flex",
                msg.senderId === "me" ? "justify-end" : "justify-start"
              )}
            >
              <Card
                className={cn(
                  "max-w-[70%] px-4 py-2.5",
                  msg.senderId === "me"
                    ? "bg-violet-600 text-white border-violet-600"
                    : "bg-muted"
                )}
              >
                <p className="text-sm">{msg.text}</p>
                <p
                  className={cn(
                    "mt-1 text-[10px]",
                    msg.senderId === "me"
                      ? "text-violet-200"
                      : "text-muted-foreground"
                  )}
                >
                  {msg.timestamp}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-2 border-t border-border p-4">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setMessage("")}
          />
          <Button size="icon" onClick={() => setMessage("")}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
