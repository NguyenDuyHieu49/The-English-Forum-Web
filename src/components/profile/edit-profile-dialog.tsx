"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/store/app-store";
import { useArenaStore } from "@/store/arena-store";
import { useTranslation } from "@/hooks/use-translation";
import {
  DEFAULT_AVATAR_URL,
  fileToAvatarDataUrl,
} from "@/types/user-profile";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileDialog({ open, onOpenChange }: EditProfileDialogProps) {
  const { t } = useTranslation();
  const profile = useAppStore((s) => s.userProfile);
  const updateUserProfile = useAppStore((s) => s.updateUserProfile);
  const setDisplayName = useArenaStore((s) => s.setDisplayName);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(profile.displayName);
    setBio(profile.bio);
    setAvatarUrl(profile.avatarUrl);
    setError(null);
  }, [open, profile]);

  const handlePickAvatar = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const dataUrl = await fileToAvatarDataUrl(file);
      setAvatarUrl(dataUrl);
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      if (code === "too_large") setError(t.profile.avatarTooLarge);
      else if (code === "not_image") setError(t.profile.avatarInvalid);
      else setError(t.profile.avatarInvalid);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError(t.profile.nameRequired);
      return;
    }

    updateUserProfile({
      displayName: trimmed.slice(0, 40),
      bio: bio.trim().slice(0, 160),
      avatarUrl,
    });
    setDisplayName(trimmed.slice(0, 40));
    onOpenChange(false);
  };

  const handleResetAvatar = () => {
    setAvatarUrl(DEFAULT_AVATAR_URL);
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.profile.editTitle}</DialogTitle>
          <DialogDescription>{t.profile.editDesc}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-3 py-2">
          <div className="relative">
            <Avatar className="h-28 w-28 ring-4 ring-violet-500/20">
              <AvatarImage src={avatarUrl} alt={name || t.common.you} />
              <AvatarFallback>{(name || t.common.you)[0]}</AvatarFallback>
            </Avatar>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 h-9 w-9 rounded-full shadow-md"
              onClick={handlePickAvatar}
              disabled={uploading}
              aria-label={t.profile.changeAvatar}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handlePickAvatar} disabled={uploading}>
              {t.profile.uploadAvatar}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={handleResetAvatar}>
              {t.profile.resetAvatar}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profile-name">{t.profile.displayName}</Label>
            <Input
              id="profile-name"
              value={name}
              maxLength={40}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.profile.displayNamePlaceholder}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-bio">{t.profile.bio}</Label>
            <textarea
              id="profile-bio"
              value={bio}
              maxLength={160}
              rows={3}
              onChange={(e) => setBio(e.target.value)}
              placeholder={t.profile.bioPlaceholder}
              className="flex w-full rounded-xl border border-border bg-background px-4 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50"
            />
            <p className="text-right text-xs text-muted-foreground">{bio.length}/160</p>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t.common.cancel}
          </Button>
          <Button type="button" onClick={handleSave}>
            {t.common.save}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
