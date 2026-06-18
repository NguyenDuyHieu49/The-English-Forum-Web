"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { APP_NAME } from "@/constants/app";
import { useTranslation } from "@/hooks/use-translation";
import { useAuth } from "@/hooks/use-auth";
import { isFirebaseConfigured } from "@/services/firebase";

export default function SplashPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      if (!isFirebaseConfigured()) {
        router.replace("/");
        return;
      }
      if (user) {
        router.replace("/");
      } else {
        router.replace("/login");
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [router, user, loading]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-md"
        >
          <GraduationCap className="h-10 w-10 text-white" />
        </motion.div>
        <h1 className="text-4xl font-bold text-white">{APP_NAME}</h1>
        <p className="mt-2 text-white/70">{t.auth.splashTagline}</p>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="mx-auto mt-8 h-1 max-w-[200px] overflow-hidden rounded-full bg-white/20"
        >
          <div className="h-full rounded-full bg-white" />
        </motion.div>
      </motion.div>
    </div>
  );
}
