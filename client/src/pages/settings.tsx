import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";
import { ArrowLeft, Settings as SettingsIcon, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { MedicationSchedule } from "@shared/schema";

const settingsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  morningEnabled: z.boolean(),
  morningTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  afternoonEnabled: z.boolean(),
  afternoonTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  eveningEnabled: z.boolean(),
  eveningTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  nightEnabled: z.boolean(),
  nightTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function Settings() {
  const { toast } = useToast();

  const { data: schedule, isLoading } = useQuery<MedicationSchedule>({
    queryKey: ["/api/medication-schedule"],
  });

  const updateMutation = useMutation({
    mutationFn: async (data: SettingsFormData) => {
      if (!schedule) throw new Error("No schedule found");
      const response = await apiRequest("PATCH", `/api/medication-schedule/${schedule.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/medication-schedule"] });
      toast({
        title: "Settings Updated",
        description: "Your medication schedule has been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update medication schedule. Please try again.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: schedule?.name || "Daily Medications",
      morningEnabled: schedule?.morningEnabled || false,
      morningTime: schedule?.morningTime || "08:00",
      afternoonEnabled: schedule?.afternoonEnabled || false,
      afternoonTime: schedule?.afternoonTime || "14:00",
      eveningEnabled: schedule?.eveningEnabled || false,
      eveningTime: schedule?.eveningTime || "18:00",
      nightEnabled: schedule?.nightEnabled || false,
      nightTime: schedule?.nightTime || "22:00",
    },
  });

  // Reset form when schedule data loads
  if (schedule && !form.formState.isDirty) {
    form.reset({
      name: schedule.name,
      morningEnabled: schedule.morningEnabled || false,
      morningTime: schedule.morningTime || "08:00",
      afternoonEnabled: schedule.afternoonEnabled || false,
      afternoonTime: schedule.afternoonTime || "14:00",
      eveningEnabled: schedule.eveningEnabled || false,
      eveningTime: schedule.eveningTime || "18:00",
      nightEnabled: schedule.nightEnabled || false,
      nightTime: schedule.nightTime || "22:00",
    });
  }

  const onSubmit = (data: SettingsFormData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen font-sans flex items-center justify-center">
        <div className="text-2xl text-muted-foreground">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen font-sans">
      {/* Header */}
      <header className="bg-card shadow-sm border-b-2 border-border p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="lg">
                <ArrowLeft className="mr-2" size={24} />
                Back
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-foreground">
              <SettingsIcon className="inline text-primary mr-3" size={48} />
              Settings
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Medication Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xl">Schedule Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="text-lg h-12" 
                          placeholder="Daily Medications"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Morning */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="text-xl font-semibold">Morning Medication</h3>
                  <FormField
                    control={form.control}
                    name="morningEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <FormLabel className="text-lg">Enable Morning Reminder</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="morningTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">Morning Time</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="time" 
                            className="text-lg h-12"
                            disabled={!form.watch("morningEnabled")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Afternoon */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="text-xl font-semibold">Afternoon Medication</h3>
                  <FormField
                    control={form.control}
                    name="afternoonEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <FormLabel className="text-lg">Enable Afternoon Reminder</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="afternoonTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">Afternoon Time</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="time" 
                            className="text-lg h-12"
                            disabled={!form.watch("afternoonEnabled")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Evening */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="text-xl font-semibold">Evening Medication</h3>
                  <FormField
                    control={form.control}
                    name="eveningEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <FormLabel className="text-lg">Enable Evening Reminder</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="eveningTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">Evening Time</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="time" 
                            className="text-lg h-12"
                            disabled={!form.watch("eveningEnabled")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Night */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="text-xl font-semibold">Night Medication</h3>
                  <FormField
                    control={form.control}
                    name="nightEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <FormLabel className="text-lg">Enable Night Reminder</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nightTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">Night Time</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="time" 
                            className="text-lg h-12"
                            disabled={!form.watch("nightEnabled")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-xl py-6"
                  disabled={updateMutation.isPending}
                >
                  <Save className="mr-3" size={24} />
                  {updateMutation.isPending ? "Saving..." : "Save Settings"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
