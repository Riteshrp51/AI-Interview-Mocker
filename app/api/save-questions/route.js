import { getQuestionsCollection } from "@/utils/mongo";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { questions, mockId, userEmail, jobPosition, jobDesc, jobExperience } = await request.json();

    if (!questions || !Array.isArray(questions) || !mockId || !userEmail) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const questionsCollection = await getQuestionsCollection();

    const questionsToInsert = questions.map(q => ({
      mockId,
      question: q.question,
      correctAns: q.correctAns,
      userEmail,
      jobPosition,
      jobDesc,
      jobExperience,
      createdAt: new Date(),
    }));

    const result = await questionsCollection.insertMany(questionsToInsert);

    return NextResponse.json({
      success: true,
      insertedCount: result.insertedCount
    });
  } catch (error) {
    console.error("Error saving questions to MongoDB:", error);
    return NextResponse.json({ error: "Failed to save questions" }, { status: 500 });
  }
}
