import { PillBottle, Sun, Moon, Star, ArrowRight, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import type { MedicationSchedule, MedicationLog } from "@shared/schema";

interface PillOrganizerProps {
  activeCompartment: string | null;
}

export function PillOrganizer({ activeCompartment }: PillOrganizerProps) {
  const { data: schedule } = useQuery<MedicationSchedule>({
    queryKey: ["/api/medication-schedule"],
  });

  const today = new Date().toISOString().split('T')[0];
  const { data: logs } = useQuery<MedicationLog[]>({
    queryKey: ["/api/medication-logs", today],
  });

  const takenCompartments = logs?.map(log => log.compartment) || [];

  const compartments = [
    {
      name: "morning",
      label: "Morning",
      time: schedule?.morningTime || "08:00",
      enabled: schedule?.morningEnabled || false,
      icon: Sun,
      bgColor: "bg-yellow-100",
      iconColor: "text-warning",
      compartmentNumber: 1,
    },
    {
      name: "afternoon",
      label: "Afternoon",
      time: schedule?.afternoonTime || "14:00",
      enabled: schedule?.afternoonEnabled || false,
      icon: Sun,
      bgColor: "bg-orange-100",
      iconColor: "text-warning",
      compartmentNumber: 2,
    },
    {
      name: "evening",
      label: "Evening",
      time: schedule?.eveningTime || "18:00",
      enabled: schedule?.eveningEnabled || false,
      icon: Moon,
      bgColor: "bg-blue-100",
      iconColor: "text-primary",
      compartmentNumber: 3,
    },
    {
      name: "night",
      label: "Night",
      time: schedule?.nightTime || "22:00",
      enabled: schedule?.nightEnabled || false,
      icon: Star,
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-600",
      compartmentNumber: 4,
    },
  ];

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <Card className="bg-card shadow-lg p-8 mb-8 border-2">
      <CardHeader className="p-0 mb-8">
        <CardTitle className="text-3xl font-bold text-foreground text-center">
          <PillBottle className="inline text-primary mr-3" size={40} />
          Today's Medications
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="relative bg-muted rounded-2xl p-6 border-4 border-border">
          <div className="space-y-6">
            {compartments.map((compartment, index) => {
              const isActive = activeCompartment === compartment.name;
              const isTaken = takenCompartments.includes(compartment.name);
              const IconComponent = compartment.icon;

              if (!compartment.enabled) return null;

              return (
                <div key={compartment.name} className="relative">
                  {/* Active Arrow Indicator */}
                  {isActive && (
                    <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="bg-error text-error-foreground p-4 rounded-full shadow-lg animate-pulse">
                        <ArrowRight size={32} />
                      </div>
                    </div>
                  )}
                  
                  <div className={`
                    rounded-xl border-4 p-6 flex items-center justify-between min-h-[120px] transition-all duration-300
                    ${isActive 
                      ? 'bg-red-50 border-error shadow-lg' 
                      : isTaken 
                        ? 'bg-green-50 border-success'
                        : 'bg-card border-border'
                    }
                  `}>
                    <div className="flex items-center">
                      <div className={`w-16 h-16 ${compartment.bgColor} rounded-full flex items-center justify-center mr-6`}>
                        <IconComponent className={`${compartment.iconColor}`} size={32} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">{compartment.label}</h3>
                        <p className="text-xl text-muted-foreground">{formatTime(compartment.time)}</p>
                        <div className="flex items-center mt-2">
                          <div className={`w-4 h-4 rounded-full mr-2 ${
                            isTaken 
                              ? 'bg-success' 
                              : isActive 
                                ? 'bg-error animate-pulse' 
                                : 'bg-muted-foreground'
                          }`} />
                          <span className={`text-lg font-semibold ${
                            isTaken 
                              ? 'text-success' 
                              : isActive 
                                ? 'text-error' 
                                : 'text-muted-foreground'
                          }`}>
                            {isTaken 
                              ? 'Completed' 
                              : isActive 
                                ? 'TIME TO TAKE!' 
                                : 'Pending'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg text-muted-foreground mb-2">
                        Compartment {compartment.compartmentNumber}
                      </div>
                      {isTaken ? (
                        <CheckCircle className="text-success" size={48} />
                      ) : isActive ? (
                        <div className="bg-error text-error-foreground px-4 py-2 rounded-lg text-xl font-bold">
                          OPEN NOW
                        </div>
                      ) : (
                        <Clock className="text-muted-foreground" size={48} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
