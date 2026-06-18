"use client";

import { motion } from "framer-motion";
import { Clock, Flame, Sparkles, Trophy, Zap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PetWidget } from "@/components/gamification/pet-widget";
import { useAppStore } from "@/store/app-store";
import { xpToNextLevel } from "@/services/gamification";

export default function ProfilePage() {
  const stats = useAppStore((s) => s.userStats);
  const xpRemaining = xpToNextLevel(stats.xp);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-6"
      >
        <Avatar className="h-24 w-24 ring-4 ring-violet-500/20">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" alt="You" />
          <AvatarFallback>You</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground">Level {stats.level} Learner</p>
          <div className="mt-2 flex items-center gap-1.5 text-sm">
            <Flame className="h-4 w-4 text-orange-500" />
            <span>{stats.streak.daily} day streak</span>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Learning Hours", value: `${stats.learningHours}h`, icon: Clock },
          { label: "Total XP", value: stats.xp.toLocaleString(), icon: Zap },
          { label: "Tokens", value: stats.tokens.toString(), icon: Sparkles },
          { label: "Focus Score", value: `${stats.focusScore}%`, icon: Trophy },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <s.icon className="h-5 w-5 text-violet-500" />
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-xl font-bold">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="mb-2 flex justify-between text-sm">
            <span>Level {stats.level}</span>
            <span className="text-muted-foreground">{xpRemaining} XP to next level</span>
          </div>
          <Progress value={((stats.xp % 1000) / 1000) * 100} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <PetWidget />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Achievements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.achievements.map((a) => (
              <div
                key={a.id}
                className={`flex items-center gap-3 rounded-xl p-3 ${
                  a.unlocked ? "bg-emerald-500/5" : "bg-muted/50"
                }`}
              >
                <span className="text-2xl">{a.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.description}</p>
                  {!a.unlocked && (
                    <Progress
                      value={(a.progress / a.target) * 100}
                      className="mt-2 h-1"
                    />
                  )}
                </div>
                {a.unlocked && (
                  <span className="text-xs font-medium text-emerald-500">Unlocked</span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Learning History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { course: "IELTS Academic Preparation", date: "Today", duration: "45 min" },
              { course: "TOEIC Listening & Reading", date: "Yesterday", duration: "1h 20m" },
              { course: "Business English Communication", date: "2 days ago", duration: "30 min" },
              { course: "English Grammar B1–B2", date: "3 days ago", duration: "55 min" },
            ].map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl bg-muted/30 p-3"
              >
                <div>
                  <p className="text-sm font-medium">{h.course}</p>
                  <p className="text-xs text-muted-foreground">{h.date}</p>
                </div>
                <span className="text-sm text-muted-foreground">{h.duration}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
