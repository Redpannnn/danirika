import { NextResponse } from "next/server";

/**
 * GET /api/debug-db — cek env vars database yang terbaca oleh server.
 *
 * Buka link ini di browser untuk diagnose:
 *   https://nama-domain.vercel.app/api/debug-db
 *
 * Akan menampilkan apakah DATABASE_URL & TURSO_AUTH_TOKEN sudah
 * ter-set dengan benar di Vercel Environment Variables.
 */
export async function GET() {
  const dbUrl = process.env.DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;
  const nodeEnv = process.env.NODE_ENV;

  return NextResponse.json({
    // Status env vars
    DATABASE_URL: dbUrl
      ? {
          isSet: true,
          length: dbUrl.length,
          startsWith: dbUrl.slice(0, 15) + "...",
          looksLikeTurso:
            dbUrl.startsWith("libsql:") ||
            dbUrl.startsWith("http:") ||
            dbUrl.startsWith("https:"),
          looksLikeFile: dbUrl.startsWith("file:"),
        }
      : { isSet: false, hint: "DATABASE_URL BELUM di-set di Vercel!" },
    TURSO_AUTH_TOKEN: tursoToken
      ? { isSet: true, length: tursoToken.length }
      : { isSet: false, hint: "TURSO_AUTH_TOKEN BELUM di-set di Vercel!" },
    NODE_ENV: nodeEnv,

    // Diagnosis
    diagnosis: (() => {
      if (!dbUrl) {
        return {
          status: "❌ GAGAL",
          problem: "DATABASE_URL belum di-set di Vercel Environment Variables.",
          fix: [
            "1. Buka Vercel Dashboard → Project → Settings → Environment Variables",
            "2. Tambah/set: DATABASE_URL = libsql://nama-db-anda.turso.io",
            "3. Tambah/set: TURSO_AUTH_TOKEN = eyJxxxx...",
            "4. Pastikan Environment = 'Production' (bukan Preview/Development)",
            "5. Klik Deployments → deploy terbaru → Redeploy (uncheck 'Use Build Cache')",
          ],
        };
      }
      if (
        !dbUrl.startsWith("libsql:") &&
        !dbUrl.startsWith("http:") &&
        !dbUrl.startsWith("https:") &&
        !dbUrl.startsWith("file:")
      ) {
        return {
          status: "❌ GAGAL",
          problem: `DATABASE_URL format tidak dikenal. Mulai dengan: "${dbUrl.slice(0, 20)}"`,
          fix: "Pastikan DATABASE_URL diawali dengan 'libsql://' (untuk Turso).",
        };
      }
      if (dbUrl.startsWith("file:")) {
        return {
          status: "⚠️ MODE LOKAL",
          problem: "DATABASE_URL adalah file SQLite lokal. Ini hanya untuk dev, bukan produksi.",
          fix: "Set DATABASE_URL = libsql://... di Vercel Environment Variables untuk pakai Turso.",
        };
      }
      if (!tursoToken) {
        return {
          status: "❌ GAGAL",
          problem: "TURSO_AUTH_TOKEN belum di-set.",
          fix: "Set TURSO_AUTH_TOKEN di Vercel Environment Variables.",
        };
      }
      return {
        status: "✅ BISA",
        problem: "Env vars terbaca dengan benar. Database siak konek.",
        fix: "Jika masih error, jalankan /api/setup-db untuk bikin tabel.",
      };
    })(),
  });
}
