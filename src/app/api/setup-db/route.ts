import { NextResponse } from "next/server";
import { createClient } from "@libsql/client";

/**
 * GET /api/setup-db — bikin tabel Guest & RSVP di database Turso otomatis.
 *
 * Cara pakai: cukup buka link ini di browser SEKALI setelah deploy:
 *   https://nama-domain-vercel.vercel.app/api/setup-db
 *
 * Tidak perlu install apapun di PC. Tabel akan dibuat dengan
 * "CREATE TABLE IF NOT EXISTS" jadi aman dijalankan berkali-kali.
 */
export async function GET() {
  const dbUrl = process.env.DATABASE_URL || "";
  const authToken = process.env.TURSO_AUTH_TOKEN;

  // Validasi: pastikan env vars sudah di-set di Vercel
  if (!dbUrl || (!dbUrl.startsWith("libsql:") && !dbUrl.startsWith("http"))) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "DATABASE_URL belum di-set di Vercel atau bukan format Turso (libsql://...). Set di Vercel Dashboard → Settings → Environment Variables, lalu redeploy.",
      },
      { status: 500 }
    );
  }

  try {
    const client = createClient({ url: dbUrl, authToken: authToken || undefined });

    const results: string[] = [];

    // 1. Tabel RSVP
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "RSVP" (
        "id" TEXT PRIMARY KEY NOT NULL,
        "name" TEXT NOT NULL,
        "attendance" TEXT NOT NULL,
        "guests" INTEGER NOT NULL DEFAULT 1,
        "message" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    results.push("✅ Tabel RSVP dibuat");

    // 2. Tabel Guest
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "Guest" (
        "id" TEXT PRIMARY KEY NOT NULL,
        "code" TEXT NOT NULL UNIQUE,
        "name" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    results.push("✅ Tabel Guest dibuat");

    // 3. Hapus tabel contoh bawaan Prisma (User, Post) — opsional
    try {
      await client.execute(`DROP TABLE IF EXISTS "_prisma_migrations"`);
      results.push("ℹ️ Cache migration lama dibersihkan");
    } catch {
      // abaikan
    }

    // 4. Cek tabel yang ada
    const tables = await client.execute(
      `SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`
    );
    const tableNames = tables.rows.map((r) => r.name).filter(Boolean);

    return NextResponse.json({
      ok: true,
      message: "Setup database berhasil! Tabel sudah siap.",
      actions: results,
      tables: tableNames,
      nextStep:
        "Sekarang test: buka /manage → tambah tamu, dan isi form RSVP di undangan.",
    });
  } catch (error) {
    console.error("Setup DB error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        ok: false,
        error: msg,
        hint:
          "Pastikan DATABASE_URL dan TURSO_AUTH_TOKEN sudah benar di Vercel Environment Variables.",
      },
      { status: 500 }
    );
  }
}
