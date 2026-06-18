"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileUp, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TeacherApplyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [cvFile, setCvFile] = useState<string | null>(null);

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg py-20 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="mx-auto mb-4 text-5xl">🎓</div>
          <h1 className="text-2xl font-bold">Application Submitted!</h1>
          <p className="mt-2 text-muted-foreground">
            We&apos;ll review your application and get back to you within 5 business days.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold">Teacher Application</h1>
        <p className="mt-1 text-muted-foreground">
          Join our community of educators
        </p>
      </motion.div>

      <Card>
        <CardContent className="space-y-5 p-6">
          <div>
            <Label htmlFor="experience">Experience</Label>
            <Input
              id="experience"
              placeholder="Years of teaching experience, subjects taught..."
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="education">Education</Label>
            <Input
              id="education"
              placeholder="Degrees, certifications, institutions..."
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="certificates">Certificates</Label>
            <Input
              id="certificates"
              placeholder="Relevant certifications (comma separated)"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="portfolio">Portfolio URL</Label>
            <Input
              id="portfolio"
              placeholder="https://your-portfolio.com"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Upload CV</Label>
            <div
              className="mt-1.5 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-8 transition-colors hover:border-violet-500/50 hover:bg-violet-500/5"
              onClick={() => setCvFile("resume.pdf")}
            >
              {cvFile ? (
                <>
                  <FileUp className="mb-2 h-8 w-8 text-violet-500" />
                  <p className="text-sm font-medium">{cvFile}</p>
                </>
              ) : (
                <>
                  <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload PDF (mock)
                  </p>
                </>
              )}
            </div>
          </div>
          <Button className="w-full" size="lg" onClick={() => setSubmitted(true)}>
            Submit Application
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
