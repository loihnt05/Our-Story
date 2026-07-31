import { PrismaClient } from "./generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not defined");
  }

  // Create a connection pool using the pg driver
  const pool = new pg.Pool({ connectionString });

  // Instantiate the Prisma PG adapter
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

const getPrismaInstance = (): PrismaClient => {
  if (globalForPrisma.prisma && (globalForPrisma.prisma as any).coupleInvitation) {
    return globalForPrisma.prisma;
  }
  const client = createPrismaClient();
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }
  return client;
};

// Proxy wrapper guarantees hot-reloaded Next.js dev modules always get the latest PrismaClient instance with all models
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol) {
    const instance = getPrismaInstance();
    const value = (instance as any)[prop];
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});
