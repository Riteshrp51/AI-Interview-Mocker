"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { chatSession } from "@/utils/GeminiAIModel";
import { LoaderCircle } from "lucide-react";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from 'uuid';
import { db } from "@/utils/db";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

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
      <div
        className="p-10 rounded-lg bg-secondary hover:scale-105 shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">
              Tell us more about your job interview
            </DialogTitle>
          </DialogHeader>

          <p className="text-gray-600">
            Add details about your job position/role, job description, and years of experience.
          </p>

          <form onSubmit={onSubmit}>
            <div className="mt-7 my-3">
              <label>Job Role/Position</label>
              <Input
                placeholder="Ex. Full Stack Developer"
                required
                onChange={(e) => setJobPosition(e.target.value)}
              />
            </div>

            <div className="my-3">
              <label>Job Description/Tech Stack</label>
              <Textarea
                placeholder="Ex. React, Angular, Node.js, etc."
                required
                onChange={(e) => setJobDesc(e.target.value)}
              />
            </div>

            <div className="my-3">
              <label>Years of Experience</label>
              <Input
                type="number"
                placeholder="Ex. 5"
                max="50"
                required
                onChange={(e) => setJobExperience(e.target.value)}
              />
            </div>

            <div className="flex gap-5 justify-end">
              <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin mr-2" />
                    Generating from AI...
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
