import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * POST /api/rsvp
 * Body: { name: string, attendance: "hadir"|"tidak"|"ragu", guests: number, message?: string }
 * Menyimpan konfirmasi kehadiran tamu ke tabel RSVP.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const attendance =
      typeof body?.attendance === "string" ? body.attendance : "";
    const guests =
      typeof body?.guests === "number" && body.guests > 0
        ? Math.min(body.guests, 10)
        : 1;
    const message =
      typeof body?.message === "string" ? body.message.trim().slice(0, 1000) : null;

    if (!name) {
      return NextResponse.json(
        { ok: false, error: "Nama harus diisi." },
        { status: 400 }
      );
    }
    if (!["hadir", "tidak", "ragu"].includes(attendance)) {
      return NextResponse.json(
        { ok: false, error: "Konfirmasi kehadiran tidak valid." },
        { status: 400 }
      );
    }

    const rsvp = await db.rSVP.create({
      data: { name, attendance, guests, message },
    });

    return NextResponse.json({ ok: true, id: rsvp.id });
  } catch (error) {
    console.error("RSVP error:", error);
    const msg =
      error instanceof Error ? error.message : "Terjadi kesalahan, silakan coba lagi.";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

/** GET /api/rsvp — daftar konfirmasi kehadiran (untuk admin/debug). */
export async function GET() {
  try {
    const list = await db.rSVP.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json({ ok: true, data: list });
  } catch (error) {
    console.error("RSVP list error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memuat data." },
      { status: 500 }
    );
  }
}
