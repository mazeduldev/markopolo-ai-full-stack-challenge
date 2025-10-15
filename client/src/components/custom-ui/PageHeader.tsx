import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

type PageHeaderProps = {
  icon: LucideIcon;
  title: string;
};

function PageHeader({ icon: IconComponent, title }: PageHeaderProps) {
  const isMobile = useIsMobile();

  return (
    <div className="bg-background">
      <div className="flex items-center gap-2">
        <IconComponent
          className={cn("shrink-0", isMobile ? "w-6 h-6" : "w-8 h-8")}
        />
        <h1 className={cn("font-bold", isMobile ? "text-2xl" : "text-3xl")}>
          {title || ""}
        </h1>
      </div>
    </div>
  );
}

export { PageHeader };
