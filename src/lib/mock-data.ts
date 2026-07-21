export interface MockUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  isPro: boolean;
}

export interface MockItemType {
  id: string;
  name: string;
  icon: string;
  color: string;
  isSystem: boolean;
}

export interface MockCollection {
  id: string;
  name: string;
  description: string;
  isFavorite: boolean;
}

export interface MockItem {
  id: string;
  title: string;
  typeId: string;
  content: string;
  language?: string;
  url?: string;
  tags: string[];
  collectionIds: string[];
  isFavorite: boolean;
  isPinned: boolean;
  updatedAt: string;
}

export const mockUser: MockUser = {
  id: "user-1",
  name: "Slimane Achbouq",
  email: "slach@dev.me",
  initials: "SA",
  isPro: true,
};

export const mockItemTypes: MockItemType[] = [
  { id: "type-snippet", name: "Snippet", icon: "code", color: "blue", isSystem: true },
  { id: "type-prompt", name: "Prompt", icon: "sparkles", color: "purple", isSystem: true },
  { id: "type-command", name: "Command", icon: "terminal", color: "orange", isSystem: true },
  { id: "type-note", name: "Note", icon: "note", color: "yellow", isSystem: true },
  { id: "type-link", name: "Link", icon: "link", color: "green", isSystem: true },
  { id: "type-file", name: "File", icon: "file", color: "gray", isSystem: true },
  { id: "type-image", name: "Image", icon: "image", color: "pink", isSystem: true },
];

export const mockCollections: MockCollection[] = [
  {
    id: "collection-react-patterns",
    name: "React Patterns",
    description: "Reusable hooks, components, and rendering strategies.",
    isFavorite: true,
  },
  {
    id: "collection-ai-prompts",
    name: "AI Prompts",
    description: "System messages and prompts for daily workflows.",
    isFavorite: true,
  },
  {
    id: "collection-terminal-commands",
    name: "Terminal Commands",
    description: "One-liners I always forget.",
    isFavorite: false,
  },
  {
    id: "collection-interview-prep",
    name: "Interview Prep",
    description: "Snippets to review before coding rounds.",
    isFavorite: false,
  },
];

export const mockItems: MockItem[] = [
  {
    id: "item-1",
    title: "useDebounce hook",
    typeId: "type-snippet",
    content: "export function useDebounce<T>(value: T, delay = 300) {\n  const [debounced, setDebounced] = useState(value)\n  ...\n}",
    language: "TypeScript",
    tags: ["react", "hooks"],
    collectionIds: ["collection-react-patterns", "collection-interview-prep"],
    isFavorite: false,
    isPinned: true,
    updatedAt: "2026-07-21T08:00:00.000Z",
  },
  {
    id: "item-2",
    title: "useLocalStorage hook",
    typeId: "type-snippet",
    content: "export function useLocalStorage<T>(key: string, initialValue: T) {\n  ...\n}",
    language: "TypeScript",
    tags: ["react", "hooks"],
    collectionIds: ["collection-react-patterns"],
    isFavorite: false,
    isPinned: false,
    updatedAt: "2026-07-20T14:00:00.000Z",
  },
  {
    id: "item-3",
    title: "Senior code reviewer",
    typeId: "type-prompt",
    content: "You are a senior staff engineer. Review the following diff for correctness, security, and readability...",
    tags: ["review", "system-prompt"],
    collectionIds: ["collection-ai-prompts"],
    isFavorite: false,
    isPinned: true,
    updatedAt: "2026-07-21T05:00:00.000Z",
  },
  {
    id: "item-4",
    title: "Explain this code",
    typeId: "type-prompt",
    content: "Explain the following code to a mid-level developer. Break down the control flow and call out any...",
    tags: ["explain", "learning"],
    collectionIds: ["collection-ai-prompts"],
    isFavorite: false,
    isPinned: false,
    updatedAt: "2026-07-16T09:00:00.000Z",
  },
  {
    id: "item-5",
    title: "Reset local git to origin",
    typeId: "type-command",
    content: "git fetch origin && git reset --hard origin/main",
    language: "bash",
    tags: ["git"],
    collectionIds: ["collection-terminal-commands"],
    isFavorite: true,
    isPinned: false,
    updatedAt: "2026-07-20T10:00:00.000Z",
  },
  {
    id: "item-6",
    title: "Kill process on port",
    typeId: "type-command",
    content: "lsof -ti:3000 | xargs kill -9",
    language: "bash",
    tags: ["dev-server"],
    collectionIds: ["collection-terminal-commands"],
    isFavorite: false,
    isPinned: false,
    updatedAt: "2026-07-19T11:00:00.000Z",
  },
  {
    id: "item-7",
    title: "Docker cleanup",
    typeId: "type-command",
    content: "docker system prune -af --volumes",
    language: "bash",
    tags: ["docker"],
    collectionIds: ["collection-terminal-commands"],
    isFavorite: false,
    isPinned: false,
    updatedAt: "2026-07-15T11:00:00.000Z",
  },
  {
    id: "item-8",
    title: "Postgres connection string format",
    typeId: "type-note",
    content: "postgresql://USER:PASSWORD@HOST:PORT/DBNAME?sslmode=require — remember to URL-encode special characters in the password.",
    tags: ["database", "postgres"],
    collectionIds: [],
    isFavorite: false,
    isPinned: false,
    updatedAt: "2026-07-20T09:00:00.000Z",
  },
  {
    id: "item-9",
    title: "Interview prep checklist",
    typeId: "type-note",
    content: "1. Review big-O basics\n2. Practice one system design question\n3. Re-read past feedback docs",
    tags: ["interview"],
    collectionIds: ["collection-interview-prep"],
    isFavorite: false,
    isPinned: false,
    updatedAt: "2026-07-14T09:00:00.000Z",
  },
  {
    id: "item-10",
    title: "Next.js docs — App Router",
    typeId: "type-link",
    content: "",
    url: "https://nextjs.org/docs/app",
    tags: ["nextjs", "docs"],
    collectionIds: [],
    isFavorite: false,
    isPinned: false,
    updatedAt: "2026-07-19T09:00:00.000Z",
  },
  {
    id: "item-11",
    title: "resume.pdf",
    typeId: "type-file",
    content: "",
    tags: ["career"],
    collectionIds: ["collection-interview-prep"],
    isFavorite: false,
    isPinned: false,
    updatedAt: "2026-07-18T09:00:00.000Z",
  },
  {
    id: "item-12",
    title: "dashboard-mockup.png",
    typeId: "type-image",
    content: "",
    tags: ["design"],
    collectionIds: [],
    isFavorite: false,
    isPinned: false,
    updatedAt: "2026-07-17T09:00:00.000Z",
  },
];
