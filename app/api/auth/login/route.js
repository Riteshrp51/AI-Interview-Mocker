import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUsersCollection } from "@/utils/mongo";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const users = await getUsersCollection();
    const normalizedEmail = email.toLowerCase();

    const existing = await users.findOne({ email: normalizedEmail });
    if (!existing) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, existing.passwordHash || "");
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = {
      _id: existing._id,
      username: existing.username,
      email: existing.email,
    };

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error("Login error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
