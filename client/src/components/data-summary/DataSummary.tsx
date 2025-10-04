import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { JsonView, darkStyles } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";

interface DataSummaryProps {
  data: any;
}

export const DataSummary: React.FC<DataSummaryProps> = ({ data }) => {
  if (!data) return null;

  return (
    <Card className="w-full max-w-full flex flex-col flex-1 min-h-0 max-h-[75svh]">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-lg font-semibold">
          Data Summary from all connected sources
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        <ScrollArea className="h-full w-full">
          <JsonView
            data={data}
            style={darkStyles}
            shouldExpandNode={(level) => level <= 1}
          />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
