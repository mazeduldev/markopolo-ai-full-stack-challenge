import { ChatThread } from "@/types/chat-thread.type";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { SidebarMenuItem, SidebarMenuButton } from "../ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function ThreadList() {
  const pathname = usePathname();
  console.log("Current pathname:", pathname);

  const threadsQueryResult = useQuery({
    queryKey: ["threads"],
    queryFn: async (): Promise<ChatThread[]> => {
      const response = await fetch("/api/chat/threads");
      if (!response.ok) {
        throw new Error("Could not fetch agents");
      }
      return response.json();
    },
  });

  if (threadsQueryResult.isLoading) {
    return <div>Loading threads...</div>;
  }

  if (threadsQueryResult.error) {
    return <div>Error loading threads</div>;
  }

  const threads = threadsQueryResult.data || [];

  return (
    <>
      {threads.map((thread) => (
        <SidebarMenuItem key={thread.id}>
          <SidebarMenuButton
            asChild
            isActive={pathname === "/dashboard/thread/" + thread.id}
            size="lg"
            className="h-auto py-3"
          >
            <Link
              href={`/dashboard/thread?id=${thread.id}`}
              className="flex flex-col items-start gap-1"
            >
              <span className="font-bold text-sm line-clamp-1">
                {thread.title || "Untitled Thread"}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(thread.created_at).toLocaleString()}
              </span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
}
