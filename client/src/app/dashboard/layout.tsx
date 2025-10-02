import { PropsWithChildren } from "react";

export default async function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-background">
      {/* Left Navigation bar */}
      <aside></aside>

      {/* Main Content on the right side */}
      <main>{children}</main>
    </div>
  );
}
