import { pgTable, serial, text, varchar, json, timestamp, integer } from "drizzle-orm/pg-core";

export const MockInterview = pgTable("mockInterview", {
    id: serial("id").primaryKey(),
    jsonMockResp: json("jsonMockResp").notNull(),
    jobPosition: varchar("jobPosition", 255).notNull(),
    jobDesc: varchar("jobDesc", 255).notNull(),
    jobExperience: varchar("jobExperience", 255).notNull(),
    createdBy: varchar("createdBy", 255).notNull(),
    mockId: varchar("mockId", 255).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const UserAnswer = pgTable("userAnswer", {
    id: serial("id").primaryKey(),
    mockIdRef: varchar("mockIdRef", 255).notNull(),
    question: text("question").notNull(),
    correctAns: text("correctAns").notNull(),
    userAnswer: text("userAnswer").notNull(),
    feedback: text("feedback").notNull(),
    rating: integer("rating").notNull(),
    userEmail: varchar("userEmail", 255).notNull(),
    createdAt: varchar("createdAt", 255).notNull(),
});
