import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CurrentTimeProps {
  currentTime: string;
  currentDate: string;
  nextMedicationTime: string | null;
}

export function CurrentTime({ currentTime, currentDate, nextMedicationTime }: CurrentTimeProps) {
  return (
    <Card className="bg-card shadow-lg p-8 mb-8 border-2">
      <CardContent className="text-center p-0">
        <div className="text-6xl font-bold text-foreground mb-4">
          {currentTime}
        </div>
        <div className="text-2xl text-muted-foreground mb-4">
          {currentDate}
        </div>
        <div className="bg-success text-success-foreground px-8 py-4 rounded-xl text-2xl font-semibold">
          <Clock className="inline mr-3" size={28} />
          {nextMedicationTime ? `Next: ${nextMedicationTime}` : "All medications completed"}
        </div>
      </CardContent>
    </Card>
  );
}
