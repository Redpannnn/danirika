import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * DELETE /api/rsvp/[id] — hapus satu RSVP berdasarkan id.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { ok: false, error: "ID tidak valid." },
        { status: 400 }
      );
    }

    await db.rSVP.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("RSVP delete error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal menghapus data." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/rsvp/[id] — perbarui satu RSVP berdasarkan id.
 * Body: { name?, attendance?, guests?, message? }
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { ok: false, error: "ID tidak valid." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const data: Record<string, unknown> = {};

    if (typeof body?.name === "string" && body.name.trim()) {
      data.name = body.name.trim();
    }
    if (
      typeof body?.attendance === "string" &&
      ["hadir", "tidak", "ragu"].includes(body.attendance)
    ) {
      data.attendance = body.attendance;
    }
    if (typeof body?.guests === "number" && body.guests >= 1) {
      data.guests = Math.min(body.guests, 10);
    }
    if (typeof body?.message === "string") {
      data.message = body.message.trim().slice(0, 1000) || null;
    }

    await db.rSVP.update({ where: { id }, data });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("RSVP update error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memperbarui data." },
      { status: 500 }
    );
  }
}
