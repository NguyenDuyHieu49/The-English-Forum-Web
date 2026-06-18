"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Bookmark, Heart, MessageCircle, Share2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_POSTS, MOCK_STORIES } from "@/mock/social";
import { cn } from "@/lib/utils";

export default function SocialPage() {
  const [posts, setPosts] = useState(MOCK_POSTS);

  const toggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, likes: p.likes + 1 } : p
      )
    );
  };

  const toggleSave = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, saved: !p.saved } : p
      )
    );
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold">Social Feed</h1>
        <p className="mt-1 text-muted-foreground">
          Connect with learners and educators
        </p>
      </motion.div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {MOCK_STORIES.map((story, i) => (
          <motion.button
            key={story.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="flex shrink-0 flex-col items-center gap-1.5"
          >
            <div
              className={cn(
                "rounded-full p-0.5",
                story.viewed
                  ? "bg-muted"
                  : "bg-gradient-to-br from-violet-500 to-indigo-500"
              )}
            >
              <Avatar className="h-14 w-14 border-2 border-background">
                <AvatarImage src={story.user.avatar} alt={story.user.name} />
                <AvatarFallback>{story.user.name[0]}</AvatarFallback>
              </Avatar>
            </div>
            <span className="max-w-[64px] truncate text-xs">
              {story.user.name.split(" ")[0]}
            </span>
          </motion.button>
        ))}
      </div>

      {posts.map((post, i) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <Card>
            <CardContent className="p-5">
              <div className="mb-4 flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={post.user.avatar} alt={post.user.name} />
                  <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{post.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {post.user.role} · {post.createdAt}
                  </p>
                </div>
              </div>
              <p className="mb-3 whitespace-pre-wrap">{post.content}</p>
              {post.image && (
                <div className="relative mb-4 h-64 overflow-hidden rounded-xl">
                  <Image
                    src={post.image}
                    alt="Post image"
                    fill
                    className="object-cover"
                    sizes="600px"
                  />
                </div>
              )}
              <div className="flex items-center gap-1 border-t border-border pt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleLike(post.id)}
                >
                  <Heart className="mr-1.5 h-4 w-4" />
                  {post.likes}
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="mr-1.5 h-4 w-4" />
                  {post.comments.length}
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="mr-1.5 h-4 w-4" />
                  {post.shares}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                  onClick={() => toggleSave(post.id)}
                >
                  <Bookmark
                    className={cn(
                      "h-4 w-4",
                      post.saved && "fill-violet-500 text-violet-500"
                    )}
                  />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
