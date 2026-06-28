"use client";

import { useState } from "react";
import { ImagePlus, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";

interface CreatePostProps {
  onPost: (content: string, image?: string) => void;
}

export function CreatePost({ onPost }: CreatePostProps) {
  const { t } = useTranslation();
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    e.target.value = "";
  };

  const handleSubmit = () => {
    if (!content.trim()) return;
    onPost(content.trim(), imagePreview ?? undefined);
    setContent("");
    setImagePreview(null);
  };

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" alt="You" />
            <AvatarFallback>Y</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t.social.createPlaceholder}
              rows={3}
              className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500/30"
            />
            {imagePreview && (
              <div className="relative h-40 overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute right-2 top-2"
                  onClick={() => setImagePreview(null)}
                >
                  {t.common.cancel}
                </Button>
              </div>
            )}
            <div className="flex items-center justify-between">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                />
                <span className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  <ImagePlus className="h-4 w-4" />
                  {t.social.addPhoto}
                </span>
              </label>
              <Button size="sm" disabled={!content.trim()} onClick={handleSubmit}>
                <Send className="mr-2 h-4 w-4" />
                {t.social.post}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
