import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

async function main() {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  const userCount = await prisma.user.count();
  console.log("Connected to database. User count:", userCount);

  await prisma.$disconnect();
}

main().catch((error: unknown) => {
  console.error("Database connection test failed:", error);
  process.exit(1);
});
