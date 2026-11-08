import { PrismaClient } from "@prisma/client";

/**
 * Database client.
 *
 * - **Lokal** (development): pakai SQLite file lewat `DATABASE_URL`
 *   (mis. `file:./db/custom.db`). PrismaClient standar.
 * - **Produksi** (Vercel + Turso): jika `TURSO_DATABASE_URL` di-set,
 *   gunakan adapter libSQL untuk konek ke Turso.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const tursoUrl = process.env.TURSO_DATABASE_URL;

  // Konek ke Turso via adapter libSQL (produksi / Vercel)
  if (tursoUrl) {
    // lazy import agar paket adapter tidak dibutuhkan di dev lokal
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createClient } = require("@libsql/client");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaLibSQL } = require("@prisma/adapter-libsql");
    const libsql = createClient({
      url: tursoUrl,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({ adapter });
  }

  // Konek ke SQLite file lokal (development)
  return new PrismaClient({ log: ["query"] });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
