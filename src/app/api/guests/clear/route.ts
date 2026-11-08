import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/** DELETE /api/guests/clear — hapus semua tamu */
export async function DELETE() {
  try {
    await db.guest.deleteMany({});
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Guest clear error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal menghapus semua tamu." },
      { status: 500 }
    );
  }
}
