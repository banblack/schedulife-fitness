
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Loader2 } from "lucide-react";

export function ChartLoadingState() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-primary" />
              Progress Tracking
            </CardTitle>
            <CardDescription>
              Monitor your workout frequency and duration
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </CardContent>
    </Card>
  );
}
