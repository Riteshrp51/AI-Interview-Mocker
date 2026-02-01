"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  // If user is already logged in, send them straight to the dashboard
  useEffect(() => {
    if (user?.email) {
      router.replace("/dashboard");
    }
  }, [user?.email, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-4">
      <div className="max-w-4xl w-full grid gap-10 md:grid-cols-2 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Ace your next interview with
            <span className="text-blue-400"> AI Interview Mocker </span>
          </h1>
          <p className="text-slate-200 mb-6 text-sm md:text-base">
            Practice real-world interview questions, get instant AI feedback, and
            improve your confidence before you talk to a real recruiter.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/sign-up">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </Link>
            <Link href="/sign-in" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white text-black"
              >
                I already have an account
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-xs md:text-sm text-slate-300">
            No complex setup. Just sign in, describe your role, and start your
            mock interview in minutes.
          </p>
        </div>

        <div className="hidden md:block">
          <div className="relative rounded-2xl border border-slate-700 bg-slate-900/60 p-6 shadow-xl">
            <p className="text-sm text-slate-200 mb-4">
              "This tool helped me refine my answers and identify gaps in my
              preparation. The AI feedback felt like a real interviewer."
            </p>
            <img src="/interview.jpeg" alt="Interview preparation" className="h-32 w-full rounded-xl object-cover" />
          </div>
        </div>
      </div>
    </main>
  );
}
