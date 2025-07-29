import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Check, Clock, Calendar, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface ActionButtonsProps {
  activeCompartment: string | null;
}

export function ActionButtons({ activeCompartment }: ActionButtonsProps) {
  const { toast } = useToast();

  const markTakenMutation = useMutation({
    mutationFn: async () => {
      if (!activeCompartment) throw new Error("No active compartment");
      
      const today = new Date().toISOString().split('T')[0];
      const response = await apiRequest("POST", "/api/medication-logs", {
        scheduleId: "default",
        compartment: activeCompartment,
        takenAt: new Date().toISOString(),
        date: today,
      });
      
      return response.json();
    },
    onSuccess: () => {
      const today = new Date().toISOString().split('T')[0];
      queryClient.invalidateQueries({ queryKey: ["/api/medication-logs", today] });
      toast({
        title: "Medication Taken",
        description: "Great job! Your medication has been marked as taken.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to mark medication as taken.",
        variant: "destructive",
      });
    },
  });

  const handleSnooze = () => {
    toast({
      title: "Reminder Snoozed",
      description: "We'll remind you again in 15 minutes.",
    });
    // In a real app, this would set a timer for 15 minutes
  };

  return (
    <Card className="bg-card shadow-lg p-8 mb-8 border-2">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Button
            onClick={() => markTakenMutation.mutate()}
            disabled={!activeCompartment || markTakenMutation.isPending}
            className="bg-success hover:bg-success/90 text-success-foreground text-2xl font-bold py-6 px-8 h-auto shadow-lg"
            size="lg"
          >
            <Check className="mr-3" size={28} />
            {markTakenMutation.isPending ? "Marking..." : "I Took My Medicine"}
          </Button>
          
          <Button
            onClick={handleSnooze}
            disabled={!activeCompartment}
            className="bg-warning hover:bg-warning/90 text-warning-foreground text-2xl font-bold py-6 px-8 h-auto shadow-lg"
            size="lg"
          >
            <Clock className="mr-3" size={28} />
            Remind Me Later
          </Button>
          
          <Button
            variant="outline"
            className="text-2xl font-bold py-6 px-8 h-auto shadow-lg border-2"
            size="lg"
            asChild
          >
            <Link href="/settings">
              <Calendar className="mr-3" size={28} />
              View Schedule
            </Link>
          </Button>
          
          <Button
            variant="outline"
            className="text-2xl font-bold py-6 px-8 h-auto shadow-lg border-2"
            size="lg"
            asChild
          >
            <Link href="/settings">
              <Settings className="mr-3" size={28} />
              Settings
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
