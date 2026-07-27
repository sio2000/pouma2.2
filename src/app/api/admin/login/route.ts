import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  getAdminCookieOptions,
  getAdminSessionValue,
  validateAdminCredentials,
} from "@/lib/auth/admin";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!validateAdminCredentials(email ?? "", password ?? "")) {
      return NextResponse.json({ error: "Λάθος email ή κωδικός." }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE, getAdminSessionValue(), getAdminCookieOptions());
    return response;
  } catch {
    return NextResponse.json({ error: "Αποτυχία σύνδεσης." }, { status: 500 });
  }
}
