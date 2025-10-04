"use client";

import { PropsWithChildren } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LogOut,
  BrainCircuit,
  MessagesSquare,
  Store,
  Database,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { useUser } from "@/context/user-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThreadList } from "@/components/chat-history/ThreadList";
import { ScrollArea } from "@/components/ui/scroll-area";

const navItems = [
  {
    title: "Create Campaign",
    href: "/dashboard/thread",
    icon: MessagesSquare,
  },
  {
    title: "Shop",
    href: "/dashboard/shop",
    icon: Store,
  },
  {
    title: "Data Source",
    href: "/dashboard/data-source",
    icon: Database,
  },
];

export default function DashboardLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { user } = useUser();
  const router = useRouter();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size={"lg"}>
                <Link
                  href="/dashboard/thread"
                  className="flex items-center space-x-2"
                >
                  <BrainCircuit size={30} />
                  <span className="font-bold">AI Marketing</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarSeparator className="m-0" />

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        size={"lg"}
                      >
                        <Link href={item.href}>
                          <Icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator className="m-0" />

          <ScrollArea className="flex-1 h-[500]">
            <SidebarGroup className="overflow-y-auto flex-1">
              <SidebarGroupContent>
                <SidebarMenu>
                  <ThreadList />
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </ScrollArea>
        </SidebarContent>

        <SidebarSeparator className="m-0" />

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton asChild size={"lg"}>
                    <button className="flex w-full items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-muted-foreground text-background">
                          {user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start">
                        <span className="font-bold">{user?.name}</span>
                        <span className="text-sm">{user?.email}</span>
                      </div>
                    </button>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" className="w-60">
                  <DropdownMenuItem asChild>
                    <button
                      onClick={() => {
                        // Call your logout function here
                        fetch("/api/auth/logout", {
                          method: "POST",
                          credentials: "include",
                        }).then(() => {
                          router.replace("/login");
                        });
                      }}
                      className="flex w-full items-center "
                    >
                      <LogOut />
                      <span>Logout</span>
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <main className="flex-1 py-6 px-10 h-svh">{children}</main>
    </SidebarProvider>
  );
}
