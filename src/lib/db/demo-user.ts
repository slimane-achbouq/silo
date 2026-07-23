import { cache } from "react";
import { prisma } from "@/lib/prisma";

// TODO: replace with the authenticated user's id once auth is wired up.
export const DEMO_USER_EMAIL = "slach@dev.io";

export const getDemoUser = cache(async () => {
  return prisma.user.findUnique({ where: { email: DEMO_USER_EMAIL } });
});
