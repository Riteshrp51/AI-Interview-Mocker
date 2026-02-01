import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUsersCollection } from "@/utils/mongo";

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email and password are required" },
        { status: 400 }
      );
    }

    const users = await getUsersCollection();
    const normalizedEmail = email.toLowerCase();

    const existing = await users.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        { error: "Email is already in use" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await users.insertOne({
      username,
      email: normalizedEmail,
      passwordHash,
      createdAt: new Date(),
    });

    const user = {
      _id: result.insertedId,
      username,
      email: normalizedEmail,
    };

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    console.error("Signup error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
