import { PrismaClient } from "@prisma/client";
import { createClient as createLibsqlClient } from "@libsql/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

/**
 * Database client — otomatis mendeteksi mode koneksi:
 *
 * - **Lokal** (dev): DATABASE_URL diawali "file:" → PrismaClient SQLite
 *   standar dengan file lokal.
 *
 * - **Produksi** (Vercel + Turso): DATABASE_URL diawali "libsql:" →
 *   gunakan adapter libSQL untuk konek ke Turso. Butuh env var:
 *     DATABASE_URL     = libsql://xxx.turso.io
 *     TURSO_AUTH_TOKEN = eyJxxx
 *
 * Debug: buka /api/debug-db untuk cek apakah env vars terbaca.
 * Setup: buka /api/setup-db untuk bikin tabel otomatis.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL || "";
  const authToken = process.env.TURSO_AUTH_TOKEN;

  // Produksi: Turso (libsql:// atau http://)
  if (
    dbUrl.startsWith("libsql:") ||
    dbUrl.startsWith("http:") ||
    dbUrl.startsWith("https:")
  ) {
    const libsql = createLibsqlClient({
      url: dbUrl,
      authToken: authToken || undefined,
    });
    const adapter = new PrismaLibSql(libsql);
    // adapter handle koneksi; datasources dibuat konsisten biar Prisma
    // tidak mencoba membaca URL dari schema (yang bisa "undefined")
    return new PrismaClient({
      adapter,
      datasources: { db: { url: dbUrl } },
    });
  }

  // Lokal: SQLite file
  if (dbUrl.startsWith("file:")) {
    return new PrismaClient({
      log: ["query"],
      datasources: { db: { url: dbUrl } },
    });
  }

  // DATABASE_URL tidak di-set — fallback ke SQLite lokal (dev) atau
  // throw error jelas di produksi.
  const fallbackUrl = "file:./db/custom.db";
  if (process.env.NODE_ENV === "production") {
    // Di produksi, tetap bikin client dengan URL dummy biar tidak crash
    // saat import module. Query akan gagal dengan error yang jelas.
    console.error(
      "[DB] DATABASE_URL belum di-set! Buka /api/debug-db untuk panduan."
    );
    return new PrismaClient({
      datasources: { db: { url: "file:/tmp/dummy.db" } },
    });
  }

  return new PrismaClient({
    log: ["query"],
    datasources: { db: { url: fallbackUrl } },
  });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
