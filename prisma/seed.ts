import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const SYSTEM_ITEM_TYPES = [
  { name: "snippet", icon: "Code", color: "#3b82f6" },
  { name: "prompt", icon: "Sparkles", color: "#8b5cf6" },
  { name: "command", icon: "Terminal", color: "#f97316" },
  { name: "note", icon: "StickyNote", color: "#fde047" },
  { name: "file", icon: "File", color: "#6b7280" },
  { name: "image", icon: "Image", color: "#ec4899" },
  { name: "link", icon: "Link", color: "#10b981" },
] as const;

async function main() {
  const passwordHash = await bcrypt.hash(process.env.DEMO_USER_PASSWORD ?? "12345678", 12);

  const user = await prisma.user.upsert({
    where: { email: "slach@dev.io" },
    update: {
      name: "Demo User",
      password: passwordHash,
      isPro: false,
      emailVerified: new Date(),
    },
    create: {
      email: "slach@dev.io",
      name: "Demo User",
      password: passwordHash,
      isPro: false,
      emailVerified: new Date(),
    },
  });
  console.log(`Upserted user: ${user.email}`);

  const itemTypeIds = new Map<string, string>();
  for (const type of SYSTEM_ITEM_TYPES) {
    const existing = await prisma.itemType.findFirst({
      where: { userId: null, name: type.name },
    });
    const itemType = existing
      ? await prisma.itemType.update({
          where: { id: existing.id },
          data: { icon: type.icon, color: type.color, isSystem: true },
        })
      : await prisma.itemType.create({
          data: {
            name: type.name,
            icon: type.icon,
            color: type.color,
            isSystem: true,
            userId: null,
          },
        });
    itemTypeIds.set(type.name, itemType.id);
  }
  console.log(`Upserted ${itemTypeIds.size} system item types`);

  // Reset the demo user's collections/items so the script is safe to re-run.
  await prisma.itemTag.deleteMany({ where: { item: { userId: user.id } } });
  await prisma.item.deleteMany({ where: { userId: user.id } });
  await prisma.collection.deleteMany({ where: { userId: user.id } });
  await prisma.tag.deleteMany({ where: { userId: user.id } });

  const snippetTypeId = itemTypeIds.get("snippet")!;
  const promptTypeId = itemTypeIds.get("prompt")!;
  const commandTypeId = itemTypeIds.get("command")!;
  const linkTypeId = itemTypeIds.get("link")!;

  await prisma.collection.create({
    data: {
      name: "React Patterns",
      description: "Reusable React patterns and hooks",
      userId: user.id,
      isFavorite: true,
      items: {
        create: [
          {
            title: "useDebounce Hook",
            contentType: "text",
            language: "typescript",
            userId: user.id,
            typeId: snippetTypeId,
            isFavorite: true,
            description: "Debounces a fast-changing value, e.g. search input.",
            content: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debouncedValue;
}`,
          },
          {
            title: "useLocalStorage Hook",
            contentType: "text",
            language: "typescript",
            userId: user.id,
            typeId: snippetTypeId,
            description: "Syncs state with localStorage across renders and tabs.",
            content: `import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}`,
          },
          {
            title: "Compound Component Pattern",
            contentType: "text",
            language: "typescript",
            userId: user.id,
            typeId: snippetTypeId,
            description: "Context provider powering a compound Tabs component.",
            content: `import { createContext, useContext, useState, type ReactNode } from "react";

type TabsContextValue = {
  activeTab: string;
  setActiveTab: (id: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

export function Tabs({ defaultTab, children }: { defaultTab: string; children: ReactNode }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>{children}</TabsContext.Provider>
  );
}

export function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) throw new Error("useTabsContext must be used within <Tabs>");
  return context;
}

export function TabPanel({ id, children }: { id: string; children: ReactNode }) {
  const { activeTab } = useTabsContext();
  return activeTab === id ? <>{children}</> : null;
}`,
          },
        ],
      },
    },
  });

  await prisma.collection.create({
    data: {
      name: "AI Workflows",
      description: "AI prompts and workflow automations",
      userId: user.id,
      isFavorite: true,
      items: {
        create: [
          {
            title: "Code Review Prompt",
            contentType: "text",
            userId: user.id,
            typeId: promptTypeId,
            isFavorite: true,
            description: "Structured prompt for a thorough code review pass.",
            content: `Review the following code for:
1. Correctness and edge cases
2. Security issues (injection, auth, validation)
3. Performance (unnecessary re-renders, N+1 queries)
4. Readability and adherence to existing patterns

For each issue found, cite the file/line, explain the risk, and suggest a fix.

Code:
{{code}}`,
          },
          {
            title: "Documentation Generator Prompt",
            contentType: "text",
            userId: user.id,
            typeId: promptTypeId,
            description: "Generates concise docs from source code.",
            content: `Generate documentation for the following code. Include:
- A one-paragraph summary of its purpose
- Parameters/props with types and descriptions
- Return value or emitted events
- One realistic usage example

Keep it concise — skip anything obvious from the signature.

Code:
{{code}}`,
          },
          {
            title: "Refactoring Assistant Prompt",
            contentType: "text",
            userId: user.id,
            typeId: promptTypeId,
            description: "Guides a safe, incremental refactor of existing code.",
            content: `Refactor the following code without changing its external behavior.
Focus on: removing duplication, extracting unclear logic into named functions,
and simplifying control flow. Do not introduce new abstractions unless they
remove real duplication. List each change and why it's an improvement.

Code:
{{code}}`,
          },
        ],
      },
    },
  });

  await prisma.collection.create({
    data: {
      name: "DevOps",
      description: "Infrastructure and deployment resources",
      userId: user.id,
      items: {
        create: [
          {
            title: "GitHub Actions CI Workflow",
            contentType: "text",
            language: "yaml",
            userId: user.id,
            typeId: snippetTypeId,
            description: "Runs lint, build, and tests on every pull request.",
            content: `name: CI

on:
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run build`,
          },
          {
            title: "Deploy to Production",
            contentType: "text",
            userId: user.id,
            typeId: commandTypeId,
            description: "Build, tag, and push the production image, then deploy.",
            content: `docker build -t registry.example.com/app:latest .
docker push registry.example.com/app:latest
vercel deploy --prod`,
          },
          {
            title: "Docker Documentation",
            contentType: "text",
            userId: user.id,
            typeId: linkTypeId,
            url: "https://docs.docker.com/",
            description: "Official Docker documentation.",
          },
          {
            title: "GitHub Actions Documentation",
            contentType: "text",
            userId: user.id,
            typeId: linkTypeId,
            url: "https://docs.github.com/en/actions",
            description: "Official GitHub Actions documentation.",
          },
        ],
      },
    },
  });

  await prisma.collection.create({
    data: {
      name: "Terminal Commands",
      description: "Useful shell commands for everyday development",
      userId: user.id,
      items: {
        create: [
          {
            title: "Git: Undo Last Commit (Keep Changes)",
            contentType: "text",
            userId: user.id,
            typeId: commandTypeId,
            description: "Undoes the last commit but keeps the changes staged.",
            content: "git reset --soft HEAD~1",
          },
          {
            title: "Docker: Remove All Stopped Containers",
            contentType: "text",
            userId: user.id,
            typeId: commandTypeId,
            description: "Cleans up stopped containers to free disk space.",
            content: "docker container prune -f",
          },
          {
            title: "Kill Process on Port",
            contentType: "text",
            userId: user.id,
            typeId: commandTypeId,
            isFavorite: true,
            description: "Frees up a port by killing whatever process is bound to it.",
            content: "lsof -ti:3000 | xargs kill -9",
          },
          {
            title: "npm: Clean Install",
            contentType: "text",
            userId: user.id,
            typeId: commandTypeId,
            description: "Wipes node_modules and the lockfile, then reinstalls.",
            content: "rm -rf node_modules package-lock.json && npm install",
          },
        ],
      },
    },
  });

  await prisma.collection.create({
    data: {
      name: "Design Resources",
      description: "UI/UX resources and references",
      userId: user.id,
      items: {
        create: [
          {
            title: "Tailwind CSS Documentation",
            contentType: "text",
            userId: user.id,
            typeId: linkTypeId,
            url: "https://tailwindcss.com/docs",
            description: "Official Tailwind CSS reference.",
          },
          {
            title: "shadcn/ui",
            contentType: "text",
            userId: user.id,
            typeId: linkTypeId,
            url: "https://ui.shadcn.com/",
            description: "Composable component library built on Radix UI.",
          },
          {
            title: "Radix UI",
            contentType: "text",
            userId: user.id,
            typeId: linkTypeId,
            url: "https://www.radix-ui.com/",
            description: "Unstyled, accessible component primitives.",
          },
          {
            title: "Lucide Icons",
            contentType: "text",
            userId: user.id,
            typeId: linkTypeId,
            url: "https://lucide.dev/",
            description: "Open-source icon library used throughout the app.",
          },
        ],
      },
    },
  });

  console.log("Seeded 5 collections with items");
}

main()
  .catch((error: unknown) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
