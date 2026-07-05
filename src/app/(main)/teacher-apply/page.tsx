"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileUp, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/use-translation";

export default function TeacherApplyPage() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [cvFile, setCvFile] = useState<string | null>(null);

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg py-20 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="mx-auto mb-4 text-5xl">🎓</div>
          <h1 className="text-2xl font-bold">{t.teacherApply.submitted}</h1>
          <p className="mt-2 text-muted-foreground">{t.teacherApply.submittedDesc}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold">{t.teacherApply.title}</h1>
        <p className="mt-1 text-muted-foreground">{t.teacherApply.subtitle}</p>
      </motion.div>

      <Card>
        <CardContent className="space-y-5 p-6">
          <div>
            <Label htmlFor="experience">{t.teacherApply.experience}</Label>
            <Input
              id="experience"
              placeholder={t.teacherApply.experiencePlaceholder}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="education">{t.teacherApply.education}</Label>
            <Input
              id="education"
              placeholder={t.teacherApply.educationPlaceholder}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="certificates">{t.teacherApply.certificates}</Label>
            <Input
              id="certificates"
              placeholder={t.teacherApply.certificatesPlaceholder}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="portfolio">{t.teacherApply.portfolio}</Label>
            <Input
              id="portfolio"
              placeholder={t.teacherApply.portfolioPlaceholder}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>{t.teacherApply.uploadCv}</Label>
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
                  <p className="text-sm text-muted-foreground">{t.teacherApply.uploadCvHint}</p>
                </>
              )}
            </div>
          </div>
          <Button className="w-full" size="lg" onClick={() => setSubmitted(true)}>
            {t.teacherApply.submit}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
