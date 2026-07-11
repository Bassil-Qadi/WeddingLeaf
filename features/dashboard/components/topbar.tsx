"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Leaf, LogOut, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { PageContainer } from "@/components/common/page-container";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopbarProps {
  userName: string;
  userEmail: string;
}

const NAV_LINKS = [{ href: "/dashboard", label: "دعواتي" }];

export function Topbar({ userName, userEmail }: TopbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-background/80 backdrop-blur-xl">
      <PageContainer>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Leaf className="h-5 w-5" />
              </div>
              <p className="font-heading text-lg">WeddingLeaf</p>
            </Link>

            <nav className="hidden items-center gap-6 text-sm md:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-muted-foreground transition hover:text-foreground",
                    pathname === link.href && "font-medium text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button nativeButton={false} size="sm" render={<Link href="/dashboard/events/new" />}>
              <Plus data-icon="inline-start" />
              دعوة جديدة
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  />
                }
              >
                <span className="text-sm font-medium">
                  {userName.charAt(0)}
                </span>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <p className="font-medium text-foreground">{userName}</p>
                    <p className="text-xs font-normal text-muted-foreground">
                      {userEmail}
                    </p>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut />
                    تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </PageContainer>
    </header>
  );
}