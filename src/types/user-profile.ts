export interface UserProfile {
  displayName: string;
  bio: string;
  avatarUrl: string;
}

export const DEFAULT_AVATAR_URL =
  "https://api.dicebear.com/7.x/avataaars/svg?seed=You";

export const DEFAULT_USER_PROFILE: UserProfile = {
  displayName: "You",
  bio: "",
  avatarUrl: DEFAULT_AVATAR_URL,
};

/** Compress an image file to a small data URL for localStorage. */
export function fileToAvatarDataUrl(file: File, maxSize = 512): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("not_image"));
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      reject(new Error("too_large"));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read_failed"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("invalid_image"));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("canvas"));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
