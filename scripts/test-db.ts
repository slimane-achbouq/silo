import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

async function main() {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  const userCount = await prisma.user.count();
  console.log("Connected to database. User count:", userCount);

  const user = await prisma.user.findUnique({
    where: { email: "slach@dev.io" },
    include: {
      collections: {
        include: { items: { include: { type: true } } },
      },
    },
  });

  if (!user) {
    console.log("Demo user (slach@dev.io) not found. Run `npx prisma db seed` first.");
    await prisma.$disconnect();
    return;
  }

  console.log(`\nDemo user: ${user.name} <${user.email}> (isPro: ${user.isPro})`);

  for (const collection of user.collections) {
    console.log(`\n${collection.name} — ${collection.description ?? "no description"}`);
    for (const item of collection.items) {
      const detail = item.url ?? item.content?.split("\n")[0];
      console.log(`  [${item.type.name}] ${item.title} — ${detail}`);
    }
  }

  await prisma.$disconnect();
}

main().catch((error: unknown) => {
  console.error("Database connection test failed:", error);
  process.exit(1);
});
