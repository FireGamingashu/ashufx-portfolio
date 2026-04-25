import { NextRequest, NextResponse } from "next/server";

// ⚠️  Change this password to whatever you want
const ADMIN_PASSWORD  = "ashufx@anubhav7275";
const SESSION_COOKIE  = "ashufx_admin_session";
const SESSION_VALUE   = "authenticated_ashufx_2025";

// POST /api/admin/login  — body: { password }
export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json() as { password: string };

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Wrong password" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, SESSION_VALUE, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// POST /api/admin/logout
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("ashufx_admin_session", "", { maxAge: 0, path: "/" });
  return res;
}
