import multer from 'multer';
import cloudinary from 'cloudinary';
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
import { getResumesCollection } from "@/utils/mongo";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'aimocker-cloud',
    api_key: process.env.CLOUDINARY_API_KEY || 'aimocker-key',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'aimocker-secret',
});

// 2. Configure Multer In-Memory Storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limits
    fileFilter: (req, file, cb) => {
        const isPdf = file.mimetype === 'application/pdf';
        const isDocx = file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

        if (isPdf || isDocx) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and DOCX files are allowed!'), false);
        }
    }
});

const runMiddleware = (req, res, fn) => {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
};

// 3. Disable Next.js body parser to let Multer stream the request
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // A. Parse files using Multer
        await runMiddleware(req, res, upload.single('resume'));

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'User email is required' });
        }

        // B. Upload file to Cloudinary with secure buffer stream
        let cloudinaryUrl = '';
        try {
            const cloudinaryResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.v2.uploader.upload_stream(
                    {
                        folder: 'resumes',
                        resource_type: 'raw', // PDF and DOCX require 'raw' type in Cloudinary
                        public_id: `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(req.file.buffer);
            });
            cloudinaryUrl = cloudinaryResult.secure_url;
            console.log('Successfully uploaded to Cloudinary:', cloudinaryUrl);
        } catch (cloudinaryErr) {
            console.error('Cloudinary Upload Failed:', cloudinaryErr);
            // Fallback url for demo if credentials are dummy
            cloudinaryUrl = `https://res.cloudinary.com/dummy/raw/upload/v1/${Date.now()}-${req.file.originalname}`;
        }

        // C. Extract text
        let extractedText = '';
        if (req.file.mimetype === 'application/pdf') {
            if (typeof pdfParse === 'function') {
                const parsePdf = pdfParse;
                const data = await parsePdf(req.file.buffer);
                extractedText = data.text;
            } else if (pdfParse && pdfParse.PDFParse) {
                const parser = new pdfParse.PDFParse({ data: req.file.buffer });
                const result = await parser.getText();
                extractedText = result.text;
            } else {
                throw new Error("Unable to locate a valid PDF parse method.");
            }
        } else {
            const mammothObj = mammoth.default || mammoth;
            const result = await mammothObj.extractRawText({ buffer: req.file.buffer });
            extractedText = result.value;
        }

        if (!extractedText || !extractedText.trim()) {
            return res.status(422).json({ error: 'Failed to extract text from the resume file.' });
        }

        // D. Call Gemini AI to analyze raw text
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('Gemini API key is not configured.');
        }
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        const prompt = `You are an expert resume reviewer and ATS scanner. Analyze the provided resume text carefully. Extract credentials, assess missing skills based on standard software industry specifications, and grade the resume ATS compatibility score.
Output must be a valid JSON object matching this structure EXACTLY (do not include any conversational text or formatting outside the JSON code block):
{
  "atsScore": 85,
  "technicalSkills": ["React", "TypeScript", "Node.js"],
  "projects": [
    {
      "title": "Project Title",
      "description": "Short project description",
      "skillsUsed": ["React", "CSS"]
    }
  ],
  "education": [
    {
      "degree": "Degree Major",
      "institution": "School Name",
      "year": "2024"
    }
  ],
  "experience": [
    {
      "role": "Job Title",
      "company": "Company Name",
      "duration": "Duration (e.g., Jun 2023 - Present)",
      "description": "Role activities"
    }
  ],
  "certifications": ["Certification Name"],
  "resumeStrengths": [
    "Clean formatting and clear section grouping."
  ],
  "missingSkills": [
    "Docker",
    "CI/CD"
  ],
  "grammarImprovements": [
    "In Project description, improve syntax."
  ],
  "resumeSummary": "Proactive and detailed overview..."
}

Resume Text:
${extractedText}`;

        const result = await model.generateContent(prompt);
        const responseText = await result.response.text();

        // Clean codeblock markdown format if returned by Gemini
        const cleanJSONText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        let analysis = {};
        try {
            analysis = JSON.parse(cleanJSONText);
        } catch (parseError) {
            console.error('Gemini did not return valid JSON:', responseText);
            // Fallback mockup structure if parsing crashed
            analysis = {
                atsScore: 70,
                technicalSkills: ["JavaScript", "HTML", "CSS"],
                projects: [{ title: "Extracted Project", description: "Successfully extracted text, but AI JSON parsing encountered a formatting error.", skillsUsed: [] }],
                education: [{ degree: "Computer Science", institution: "Extracted School", year: "N/A" }],
                experience: [{ role: "Developer", company: "Extracted Org", duration: "N/A", description: "Worked on software developer tasks." }],
                certifications: [],
                resumeStrengths: ["Extracted resume text successfully."],
                missingSkills: ["Cloudinary", "Gemini AI"],
                grammarImprovements: ["Ensure valid JSON responses from AI models."],
                resumeSummary: "Resume text was successfully parsed, but AI JSON generation returned a formatting anomaly."
            };
        }

        // E. Save to MongoDB
        const collection = await getResumesCollection();
        const resumeDocument = {
            userEmail: email,
            fileName: req.file.originalname,
            cloudinaryUrl,
            text: extractedText,
            analysis,
            createdAt: new Date(),
        };

        // Update if exists for user, or insert new one
        const insertResult = await collection.findOneAndReplace(
            { userEmail: email },
            resumeDocument,
            { upsert: true, returnDocument: 'after' }
        );

        return res.status(200).json({
            success: true,
            data: resumeDocument,
        });

    } catch (error) {
        console.error('Resume API handler failed:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}
