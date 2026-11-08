import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Membuat kode unik dari nama: "NNNN-NAMASANITIZED"
 * Mis. "Budi Santoso" → "3821-BUDISANTOSO"
 */
function makeCode(name: string): string {
  const sanitized = name
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 12);
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${num}-${sanitized}`;
}

/** Pastikan kode unik — coba ulang sampai tidak bentrok */
async function uniqueCode(name: string): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const code = makeCode(name);
    const exists = await db.guest.findUnique({ where: { code } });
    if (!exists) return code;
  }
  // fallback dengan timestamp
  return `${Date.now().toString(36).toUpperCase()}-${name.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8)}`;
}

/**
 * POST /api/guests — tambah satu atau banyak tamu sekaligus.
 * Body: { names: string }  (nama dipisah newline; baris "code|nama" untuk custom code)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const raw = typeof body?.names === "string" ? body.names : "";

    // Parse: satu nama per baris. Format "code|nama" untuk custom code.
    const lines = raw
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Tidak ada nama yang diisi." },
        { status: 400 }
      );
    }

    const created = [];
    for (const line of lines) {
      let code: string;
      let name: string;

      if (line.includes("|")) {
        const [customCode, ...rest] = line.split("|");
        code = customCode.trim().toUpperCase();
        name = rest.join("|").trim();
      } else {
        name = line;
        code = await uniqueCode(name);
      }

      // Skip kalau kode sudah ada
      const exists = await db.guest.findUnique({ where: { code } });
      if (exists) continue;

      created.push(
        await db.guest.create({ data: { code, name } })
      );
    }

    return NextResponse.json({ ok: true, count: created.length });
  } catch (error) {
    console.error("Guest create error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal menambah tamu." },
      { status: 500 }
    );
  }
}

/** GET /api/guests — daftar semua tamu */
export async function GET() {
  try {
    const list = await db.guest.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ ok: true, data: list });
  } catch (error) {
    console.error("Guest list error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memuat data." },
      { status: 500 }
    );
  }
}
