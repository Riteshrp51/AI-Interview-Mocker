import { getMatchesCollection, getResumesCollection } from "@/utils/mongo";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        return handlePost(req, res);
    } else if (req.method === 'GET') {
        return handleGet(req, res);
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}

async function handlePost(req, res) {
    try {
        const { email, jobDescription, resumeText } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email parameter is required" });
        }
        if (!jobDescription) {
            return res.status(400).json({ error: "Job description is required" });
        }

        let finalResumeText = resumeText;

        // If custom resume text isn't provided, fetch the latest upload from DB
        if (!finalResumeText) {
            const resumesCollection = await getResumesCollection();
            const loadedResume = await resumesCollection.findOne({ userEmail: email });
            if (!loadedResume || !loadedResume.text) {
                return res.status(404).json({ error: "Please upload your resume to the Resume Analyzer first, or supply custom text." });
            }
            finalResumeText = loadedResume.text;
        }

        // Configure Gemini AI model
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "Gemini API key is not configured" });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const promptText = `
You are an expert applicant tracking system (ATS) matching tool.
Given the candidate Resume text and target Job Description below:

Candidate Resume:
---
${finalResumeText}
---

Target Job Description:
---
${jobDescription}
---

Analyze compatibility and provide a detailed review format.
You must return only the JSON format containing the exact schema. Do not output blockquotes or code blocks or backticks. Return a single flat JSON object with these keys:
{
  "overallMatchPercentage": 75,
  "skillsMatch": 80,
  "experienceMatch": 70,
  "educationMatch": 90,
  "missingSkills": ["React Native", "GraphQL"],
  "missingTechnologies": ["Docker", "Kubernetes"],
  "aiSuggestions": [
    "Highlight your project handling container configurations",
    "Describe custom hooks implementation for API layers"
  ]
}
`;

        const result = await model.generateContent(promptText);
        let rawText = result.response.text().trim();

        // Clean markdown tags if Gemini includes them
        rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

        const firstBrace = rawText.indexOf('{');
        const lastBrace = rawText.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
            rawText = rawText.substring(firstBrace, lastBrace + 1);
        }

        const parsed = JSON.parse(rawText);

        // Save report to MongoDB
        const matchesCollection = await getMatchesCollection();
        const payload = {
            userEmail: email,
            jobDescription,
            overallMatchPercentage: Number(parsed.overallMatchPercentage || 0),
            skillsMatch: Number(parsed.skillsMatch || 0),
            experienceMatch: Number(parsed.experienceMatch || 0),
            educationMatch: Number(parsed.educationMatch || 0),
            missingSkills: parsed.missingSkills || [],
            missingTechnologies: parsed.missingTechnologies || [],
            aiSuggestions: parsed.aiSuggestions || [],
            createdAt: new Date()
        };

        const insertResult = await matchesCollection.insertOne(payload);
        payload._id = insertResult.insertedId.toString();

        return res.status(200).json({
            success: true,
            data: payload
        });

    } catch (error) {
        console.error("Match POST API failed:", error);
        return res.status(500).json({ error: error.message || "Failed to analyze document match" });
    }
}

async function handleGet(req, res) {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ error: "Email parameter is required" });
        }

        const matchesCollection = await getMatchesCollection();
        const matchesList = await matchesCollection
            .find({ userEmail: email })
            .sort({ createdAt: -1 })
            .toArray();

        // stringify ids
        const cleaned = matchesList.map(item => {
            if (item._id) {
                item._id = item._id.toString();
            }
            return item;
        });

        return res.status(200).json({
            success: true,
            data: cleaned
        });

    } catch (error) {
        console.error("Match GET API failed:", error);
        return res.status(500).json({ error: error.message || "Failed to fetch matches history" });
    }
}
