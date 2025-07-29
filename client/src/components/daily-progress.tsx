import { useQuery } from "@tanstack/react-query";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MedicationSchedule, MedicationLog } from "@shared/schema";

export function DailyProgress() {
  const { data: schedule } = useQuery<MedicationSchedule>({
    queryKey: ["/api/medication-schedule"],
  });

  const today = new Date().toISOString().split('T')[0];
  const { data: logs } = useQuery<MedicationLog[]>({
    queryKey: ["/api/medication-logs", today],
  });

  const enabledCompartments = schedule ? [
    schedule.morningEnabled,
    schedule.afternoonEnabled,
    schedule.eveningEnabled,
    schedule.nightEnabled,
  ].filter(Boolean).length : 0;

  const completedCount = logs?.length || 0;
  const progressPercentage = enabledCompartments > 0 ? (completedCount / enabledCompartments) * 100 : 0;

  return (
    <Card className="bg-card shadow-lg p-8 border-2">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-2xl font-bold text-foreground text-center">
          <TrendingUp className="inline text-primary mr-3" size={32} />
          Today's Progress
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="bg-muted rounded-full h-8 mb-4">
          <div 
            className="bg-success h-8 rounded-full transition-all duration-300" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="text-center">
          <span className="text-3xl font-bold text-success">{completedCount}</span>
          <span className="text-2xl text-muted-foreground"> of </span>
          <span className="text-3xl font-bold text-foreground">{enabledCompartments}</span>
          <span className="text-2xl text-muted-foreground"> medications taken today</span>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-xl text-muted-foreground">
            {completedCount === enabledCompartments && enabledCompartments > 0
              ? "Excellent! All medications completed for today!"
              : "Keep up the great work!"
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
