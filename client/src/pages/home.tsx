import { useState } from "react";
import { Link } from "wouter";
import { PillBottle, Heart, Phone, UserRound, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMedicationTimer } from "@/hooks/use-medication-timer";
import { PillOrganizer } from "@/components/pill-organizer";
import { CurrentTime } from "@/components/current-time";
import { ActionButtons } from "@/components/action-buttons";
import { DailyProgress } from "@/components/daily-progress";

export default function Home() {
  const { currentTime, currentDate, activeCompartment, nextMedicationTime } = useMedicationTimer();

  const handleEmergencyCall = () => {
    window.location.href = "tel:911";
  };

  const handleFamilyCall = () => {
    // In a real app, this would be configured
    window.location.href = "tel:+1234567890";
  };

  const handleDoctorCall = () => {
    // In a real app, this would be configured
    window.location.href = "tel:+1234567890";
  };

  return (
    <div className="bg-background min-h-screen font-sans">
      {/* Header */}
      <header className="bg-card shadow-sm border-b-2 border-border p-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            <PillBottle className="inline text-primary mr-3" size={48} />
            Medication Reminder
          </h1>
          <p className="text-xl text-muted-foreground">Your Daily Pill Organizer</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6">
        {/* Current Time */}
        <CurrentTime 
          currentTime={currentTime}
          currentDate={currentDate}
          nextMedicationTime={nextMedicationTime}
        />

        {/* Pill Organizer */}
        <PillOrganizer activeCompartment={activeCompartment} />

        {/* Action Buttons */}
        <ActionButtons activeCompartment={activeCompartment} />

        {/* Daily Progress */}
        <DailyProgress />
      </main>

      {/* Footer */}
      <footer className="bg-card border-t-2 border-border p-6 mt-12">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg text-muted-foreground mb-4">
            <Heart className="inline text-error mr-2" size={20} />
            Made with love for Dad
          </p>
          <div className="grid grid-cols-3 gap-4">
            <Button
              onClick={handleFamilyCall}
              variant="outline"
              size="lg"
              className="text-lg font-semibold py-6 px-6 h-auto"
            >
              <Phone className="mr-2" size={20} />
              Call Family
            </Button>
            <Button
              onClick={handleDoctorCall}
              variant="outline"
              size="lg"
              className="text-lg font-semibold py-6 px-6 h-auto"
            >
              <UserRound className="mr-2" size={20} />
              Call Doctor
            </Button>
            <Button
              onClick={handleEmergencyCall}
              variant="destructive"
              size="lg"
              className="text-lg font-semibold py-6 px-6 h-auto"
            >
              <AlertTriangle className="mr-2" size={20} />
              Emergency
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
