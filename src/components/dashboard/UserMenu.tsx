"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/shared/UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  name: string;
  email: string;
  image?: string | null;
  collapsed?: boolean;
}

export function UserMenu({ name, email, image, collapsed = false }: UserMenuProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-md px-2 py-2",
        collapsed && "flex-col justify-center px-0"
      )}
    >
      <Link href="/profile" className="shrink-0">
        <UserAvatar name={name} image={image} size="sm" />
      </Link>

      {!collapsed && (
        <DropdownMenu>
          <DropdownMenuTrigger
            className="min-w-0 flex-1 rounded-md p-1 text-left hover:bg-muted"
          >
            <p className="truncate text-sm font-medium">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top">
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/sign-in" })}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
