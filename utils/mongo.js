import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not set in environment variables");
}

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, {});
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export async function getDb() {
  const client = await clientPromise;
  const dbName =
    process.env.MONGODB_DB_NAME ||
    (() => {
      try {
        const url = new URL(uri);
        return url.pathname?.replace(/^\//, "") || "ai-interview-mocker";
      } catch {
        return "ai-interview-mocker";
      }
    })();
  return client.db(dbName);
}

export async function getUsersCollection() {
  const db = await getDb();
  return db.collection("users");
}

export async function getQuestionsCollection() {
  const db = await getDb();
  return db.collection("questions");
}

export async function getResumesCollection() {
  const db = await getDb();
  return db.collection("resumes");
}

export async function getMatchesCollection() {
  const db = await getDb();
  return db.collection("resume_matches");
}

