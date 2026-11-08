import { PrismaClient } from "@prisma/client";

/**
 * Database client.
 *
 * - **Lokal** (development): PrismaClient standar dengan SQLite file.
 * - **Produksi** (Vercel + Turso): lihat catatan di bawah.
 *
 * --- DEPLOY KE VERCEL + TURSO ---
 * Saat deploy, ganti file ini dengan versi adapter libSQL:
 *
 *   import { PrismaClient } from "@prisma/client";
 *   import { createClient } from "@libsql/client";
 *   import { PrismaLibSQL } from "@prisma/adapter-libsql";
 *
 *   const libsql = createClient({
 *     url: process.env.TURSO_DATABASE_URL!,
 *     authToken: process.env.TURSO_AUTH_TOKEN,
 *   });
 *   const adapter = new PrismaLibSQL(libsql);
 *   export const db = new PrismaClient({ adapter });
 *
 * Dan set env vars di Vercel:
 *   TURSO_DATABASE_URL = libsql://xxx.turso.io
 *   TURSO_AUTH_TOKEN   = eyJxxx
 *
 * Lihat .env.example untuk panduan lengkap.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({ log: ["query"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
