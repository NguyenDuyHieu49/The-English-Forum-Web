"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { searchAll } from "@/services/search";
import type { SearchResult } from "@/types/mission";
import Link from "next/link";

const TYPE_LABELS: Record<SearchResult["type"], string> = {
  course: "Course",
  teacher: "Teacher",
  post: "Post",
  quiz: "Quiz",
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const results = searchAll(query);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">Search</h1>
        <p className="mt-1 text-muted-foreground">
          Find courses, teachers, quizzes, and posts
        </p>
      </motion.div>

      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search anything..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-12 pl-11 text-base"
          autoFocus
        />
      </div>

      <div className="space-y-2">
        {results.map((result, i) => (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Link href={result.href}>
              <Card className="transition-all hover:shadow-md hover:ring-1 hover:ring-violet-500/20">
                <CardContent className="flex items-center gap-4 p-4">
                  <span className="rounded-lg bg-violet-500/10 px-2 py-1 text-xs font-medium text-violet-600 dark:text-violet-400">
                    {TYPE_LABELS[result.type]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{result.title}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {result.subtitle}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
