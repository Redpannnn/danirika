import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/** PUT /api/guests/[id] — edit nama tamu (code di-regenerate dari nama baru) */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";

    if (!name) {
      return NextResponse.json(
        { ok: false, error: "Nama tidak boleh kosong." },
        { status: 400 }
      );
    }

    // Generate code baru dari nama
    const sanitized = name.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
    const num = Math.floor(1000 + Math.random() * 9000);
    let code = `${num}-${sanitized}`;

    // Pastikan unik (kecuali untuk item ini sendiri)
    for (let i = 0; i < 10; i++) {
      const exists = await db.guest.findFirst({
        where: { code, NOT: { id } },
      });
      if (!exists) break;
      const n2 = Math.floor(1000 + Math.random() * 9000);
      code = `${n2}-${sanitized}`;
    }

    await db.guest.update({ where: { id }, data: { name, code } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Guest update error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal mengedit tamu." },
      { status: 500 }
    );
  }
}

/** DELETE /api/guests/[id] — hapus satu tamu */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.guest.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Guest delete error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal menghapus tamu." },
      { status: 500 }
    );
  }
}
