import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { getWorkshopById, listRegistrations } from "@/lib/workshops/service";
import { toWorkshopView } from "@/lib/workshops/status";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/workshops/:id/registrations — admin participant list for a workshop. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Μη εξουσιοδοτημένο." }, { status: 401 });
  }

  const { id } = await params;
  try {
    const workshop = await getWorkshopById(id);
    if (!workshop) {
      return NextResponse.json({ error: "Το workshop δεν βρέθηκε." }, { status: 404 });
    }
    const registrations = await listRegistrations(id);
    return NextResponse.json({
      workshop: toWorkshopView(workshop),
      registrations,
    });
  } catch (err) {
    console.error("[GET /api/workshops/:id/registrations]", err);
    return NextResponse.json(
      { error: "Αποτυχία φόρτωσης συμμετοχών." },
      { status: 500 }
    );
  }
}
