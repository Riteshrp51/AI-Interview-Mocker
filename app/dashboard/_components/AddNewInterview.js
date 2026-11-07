"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { chatSession } from "@/utils/GeminiAIModel";
import { LoaderCircle, Plus, BriefcaseBusiness } from "lucide-react";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from 'uuid';
import { db } from "@/utils/db";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from 'sonner';

function AddNewInterview({ openDialog: controlledOpenDialog, setOpenDialog: controlledSetOpenDialog, hideCard = false }) {
  const [localOpenDialog, setLocalOpenDialog] = useState(false);
  const openDialog = controlledOpenDialog !== undefined ? controlledOpenDialog : localOpenDialog;
  const setOpenDialog = controlledSetOpenDialog !== undefined ? controlledSetOpenDialog : setLocalOpenDialog;
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!user?.email) {
      alert("Please login before uploading a resume.");
      return;
    }

    setUploadingResume(true);
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("email", user.email);

    try {
      const response = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      if (result.data?.analysis) {
        const { technicalSkills, experience } = result.data.analysis;

        // Auto prefill job position
        if (experience && experience.length > 0) {
          setJobPosition(experience[0].role || "");
        } else if (technicalSkills && technicalSkills.length > 0) {
          setJobPosition(`${technicalSkills[0]} Developer`);
        }

        // Auto prefill skills
        if (technicalSkills && technicalSkills.length > 0) {
          setJobDesc(technicalSkills.join(", "));
        }

        toast.success("Resume parsed and pre-filled successfully!");
      }
    } catch (err) {
      console.error("Resume Upload Error:", err);
      alert(err.message || "Failed to parse resume.");
    } finally {
      setUploadingResume(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!user?.email) {
      alert("Please login before creating a mock interview.");
      return;
    }

    setLoading(true);

    try {
      const InputPrompt = `Job position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}. Based on this information, please generate ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions with concise answers in JSON format. Give me "question" and "correctAns" fields in the JSON. The questions should be specifically tailored to the Job Description and Tech Stack provided. Ensure the difficulty level matches the Years of Experience.`;

      const result = await chatSession.sendMessage(InputPrompt);
      const rawText = await result.response.text();
      const MockJSONResp = rawText.replace('```json', '').replace('```', '').trim();

      if (MockJSONResp) {
        const newMockId = uuidv4();

        await db.insert(MockInterview).values({
          mockId: newMockId,
          jsonMockResp: MockJSONResp,
          jobPosition,
          jobDesc,
          jobExperience,
          createdBy: user.email,
          createdAt: new Date(),
        });

        // Save questions to MongoDB via API
        try {
          const questions = JSON.parse(MockJSONResp);
          const response = await fetch('/api/save-questions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              questions,
              mockId: newMockId,
              userEmail: user.email,
              jobPosition,
              jobDesc,
              jobExperience,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to save questions');
          }

          const result = await response.json();
          console.log(`Saved ${result.insertedCount} questions to MongoDB`);
        } catch (mongoError) {
          console.error("Error saving questions to MongoDB:", mongoError);
          // Continue with the flow even if MongoDB save fails
        }

        setOpenDialog(false);
        router.push(`/dashboard/interview/${newMockId}`);
      } else {
        alert("Failed to generate mock interview. Please try again.");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!hideCard && (
        <div
          className="p-8 sm:p-10 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-900/60 hover:bg-gray-100 dark:hover:bg-zinc-800/60 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3 group"
          onClick={() => setOpenDialog(true)}
        >
          <div className="bg-white dark:bg-zinc-800 p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
            <Plus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            Add New Interview
          </h2>
        </div>
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl text-zinc-900 dark:text-zinc-50">
              Tell us more about your job interview
            </DialogTitle>
          </DialogHeader>

          <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-sm">
            Add details manually, or import from your resume to populate values automatically.
          </DialogDescription>

          {/* Resume Upload Box */}
          <div className="mt-4 p-4 border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg text-center">
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Import from Resume (PDF / DOCX)
            </label>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleResumeUpload}
              disabled={uploadingResume}
              className="block w-full text-xs text-zinc-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 file:hover:bg-blue-100 dark:file:bg-zinc-850 dark:file:text-zinc-300 dark:file:hover:bg-zinc-800 cursor-pointer max-w-xs mx-auto"
            />
            {uploadingResume && (
              <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-2.5 flex items-center justify-center gap-1.5 animate-pulse">
                <LoaderCircle className="animate-spin w-3.5 h-3.5" />
                Uploading and extracting skills...
              </p>
            )}
          </div>

          <div className="relative my-2 text-center">
            <span className="absolute inset-y-1/2 left-0 right-0 h-px bg-zinc-200 dark:bg-zinc-800" />
            <span className="relative bg-white dark:bg-zinc-900 px-3 text-[10px] uppercase font-bold text-zinc-400">
              Or fill manually
            </span>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Job Role/Position</label>
              <Input
                placeholder="Ex. Full Stack Developer"
                required
                value={jobPosition}
                onChange={(e) => setJobPosition(e.target.value)}
                className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-250 dark:border-zinc-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Job Description/Tech Stack</label>
              <Textarea
                placeholder="Ex. React, Angular, Node.js, etc."
                required
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                className="min-h-[90px] bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-250 dark:border-zinc-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Years of Experience</label>
              <Input
                type="number"
                placeholder="Ex. 5"
                max="50"
                required
                value={jobExperience}
                onChange={(e) => setJobExperience(e.target.value)}
                className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-250 dark:border-zinc-800"
              />
            </div>

            <div className="flex gap-4 justify-end pt-2">
              <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)} className="text-zinc-650 hover:bg-zinc-105">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin mr-2 w-4 h-4" />
                    Generating Questions...
                  </>
                ) : (
                  "Start Interview"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
