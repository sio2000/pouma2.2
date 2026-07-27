import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { getContacts, updateContactStatus } from "@/lib/db/file-store";
import type { ContactStatus } from "@/lib/db/types";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Μη εξουσιοδοτημένο." }, { status: 401 });
  }

  try {
    const contacts = await getContacts();
    return NextResponse.json(contacts);
  } catch (err) {
    console.error("[GET /api/contacts]", err);
    return NextResponse.json({ error: "Αποτυχία φόρτωσης αιτημάτων." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Μη εξουσιοδοτημένο." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status } = body as { id?: string; status?: ContactStatus };

    if (!id || !status || !["new", "replied", "archived"].includes(status)) {
      return NextResponse.json({ error: "Μη έγκυρα δεδομένα." }, { status: 400 });
    }

    const updated = await updateContactStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: "Δεν βρέθηκε το αίτημα." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Αποτυχία ενημέρωσης." }, { status: 500 });
  }
}
