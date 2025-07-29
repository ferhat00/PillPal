import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { MedicationSchedule, MedicationLog } from "@shared/schema";

interface MedicationTimerReturn {
  currentTime: string;
  currentDate: string;
  activeCompartment: string | null;
  nextMedicationTime: string | null;
}

export function useMedicationTimer(): MedicationTimerReturn {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  const { data: schedule } = useQuery<MedicationSchedule>({
    queryKey: ["/api/medication-schedule"],
  });

  const today = new Date().toISOString().split('T')[0];
  const { data: logs } = useQuery<MedicationLog[]>({
    queryKey: ["/api/medication-logs", today],
  });

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }));
      setCurrentDate(now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const getActiveCompartment = (): string | null => {
    if (!schedule) return null;

    const now = new Date();
    const currentTimeString = now.toTimeString().slice(0, 5); // HH:MM format

    // Check if any medication log exists for today for each compartment
    const takenCompartments = logs?.map(log => log.compartment) || [];

    const compartments = [
      { name: "morning", time: schedule.morningTime, enabled: schedule.morningEnabled },
      { name: "afternoon", time: schedule.afternoonTime, enabled: schedule.afternoonEnabled },
      { name: "evening", time: schedule.eveningTime, enabled: schedule.eveningEnabled },
      { name: "night", time: schedule.nightTime, enabled: schedule.nightEnabled },
    ];

    // Find the current active compartment (within 30 minutes of scheduled time)
    for (const compartment of compartments) {
      if (!compartment.enabled || !compartment.time) continue;
      if (takenCompartments.includes(compartment.name)) continue;

      const [schedHour, schedMin] = compartment.time.split(':').map(Number);
      const schedTime = new Date();
      schedTime.setHours(schedHour, schedMin, 0, 0);

      const timeDiff = now.getTime() - schedTime.getTime();
      const diffInMinutes = timeDiff / (1000 * 60);

      // Active if within 30 minutes after scheduled time
      if (diffInMinutes >= 0 && diffInMinutes <= 30) {
        return compartment.name;
      }
    }

    return null;
  };

  const getNextMedicationTime = (): string | null => {
    if (!schedule) return null;

    const now = new Date();
    const takenCompartments = logs?.map(log => log.compartment) || [];

    const compartments = [
      { name: "morning", time: schedule.morningTime, enabled: schedule.morningEnabled },
      { name: "afternoon", time: schedule.afternoonTime, enabled: schedule.afternoonEnabled },
      { name: "evening", time: schedule.eveningTime, enabled: schedule.eveningEnabled },
      { name: "night", time: schedule.nightTime, enabled: schedule.nightEnabled },
    ];

    // Find next medication time
    for (const compartment of compartments) {
      if (!compartment.enabled || !compartment.time) continue;
      if (takenCompartments.includes(compartment.name)) continue;

      const [schedHour, schedMin] = compartment.time.split(':').map(Number);
      const schedTime = new Date();
      schedTime.setHours(schedHour, schedMin, 0, 0);

      if (schedTime > now) {
        const timeString = schedTime.toLocaleTimeString([], { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        });
        return `${compartment.name.charAt(0).toUpperCase() + compartment.name.slice(1)} at ${timeString}`;
      }
    }

    return "All medications completed for today";
  };

  return {
    currentTime,
    currentDate,
    activeCompartment: getActiveCompartment(),
    nextMedicationTime: getNextMedicationTime(),
  };
}
