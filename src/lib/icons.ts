import * as lucideIcons from "lucide-react";
import { FileQuestion, type LucideIcon } from "lucide-react";

export function resolveLucideIcon(name: string | null | undefined): LucideIcon {
  if (!name) return FileQuestion;
  const icon = (lucideIcons as unknown as Record<string, LucideIcon>)[name];
  return icon ?? FileQuestion;
}
