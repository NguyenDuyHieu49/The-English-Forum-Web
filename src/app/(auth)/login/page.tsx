"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { APP_NAME } from "@/constants/app";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import {
  loginWithEmail,
  loginWithGoogle,
  isFirebaseConfigured,
  getFirebaseAuthErrorMessage,
} from "@/services/firebase";

export default function LoginPage() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!isFirebaseConfigured()) {
      router.push("/");
      setLoading(false);
      return;
    }

    try {
      await loginWithEmail(email, password);
      router.replace("/");
    } catch (err) {
      setError(getFirebaseAuthErrorMessage(err, locale));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (!isFirebaseConfigured()) {
      router.push("/");
      return;
    }
    try {
      await loginWithGoogle();
      router.replace("/");
    } catch (err) {
      setError(getFirebaseAuthErrorMessage(err, locale));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-4 dark:from-zinc-950 dark:via-zinc-900 dark:to-indigo-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold">{t.auth.welcomeBack}</h1>
          <p className="text-sm text-muted-foreground">{t.auth.signInContinue}</p>
          <p className="mt-1 text-xs font-medium text-violet-600">{APP_NAME}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t.auth.login}</CardTitle>
            <CardDescription>{t.auth.loginDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">{t.auth.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  className="mt-1.5"
                  required
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t.auth.password}</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-violet-600 hover:underline"
                  >
                    {t.auth.forgotPassword}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5"
                  required
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t.auth.signingIn : t.auth.signIn}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">{t.common.or}</span>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={handleGoogle}>
              {t.auth.continueGoogle}
            </Button>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {t.auth.noAccount}{" "}
              <Link href="/register" className="font-medium text-violet-600 hover:underline">
                {t.auth.register}
              </Link>
            </p>

            {!isFirebaseConfigured() && (
              <p className="mt-4 rounded-lg bg-yellow-500/10 p-3 text-center text-xs text-yellow-700 dark:text-yellow-400">
                {t.auth.demoMode}
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
