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
 * Lihat .env.example untuk panduan lengkap.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL || "";

  // Produksi: Turso (libsql:// atau http://)
  if (
    dbUrl.startsWith("libsql:") ||
    dbUrl.startsWith("http:") ||
    dbUrl.startsWith("https:")
  ) {
    const libsql = createLibsqlClient({
      url: dbUrl,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    const adapter = new PrismaLibSql(libsql);
    return new PrismaClient({ adapter });
  }

  // Lokal: SQLite file
  return new PrismaClient({ log: ["query"] });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
