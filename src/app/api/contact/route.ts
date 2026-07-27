import { NextResponse } from "next/server";
import { addContact } from "@/lib/db/file-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, level, goal, message } = body;

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "Απαιτούνται όνομα και email." }, { status: 400 });
    }

    const entry = await addContact({
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone ?? "").trim(),
      level: String(level ?? "").trim(),
      goal: String(goal ?? "").trim(),
      message: String(message ?? "").trim(),
    });

    return NextResponse.json({ ok: true, id: entry.id });
  } catch {
    return NextResponse.json({ error: "Αποτυχία αποθήκευσης αιτήματος." }, { status: 500 });
  }
}
