import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Code } from "lucide-react";

export const ViewJsonDialog = ({ campaign }: { campaign: any }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Code className="w-4 h-4" />
          JSON
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Campaign JSON Data</DialogTitle>
        </DialogHeader>
        <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
          <code>{JSON.stringify(campaign, null, 2)}</code>
        </pre>
      </DialogContent>
    </Dialog>
  );
};
