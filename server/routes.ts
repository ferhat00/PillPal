import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMedicationScheduleSchema, insertMedicationLogSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current medication schedule
  app.get("/api/medication-schedule", async (req, res) => {
    try {
      const schedule = await storage.getMedicationSchedule();
      if (!schedule) {
        return res.status(404).json({ message: "No medication schedule found" });
      }
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ message: "Failed to get medication schedule" });
    }
  });

  // Update medication schedule
  app.patch("/api/medication-schedule/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = insertMedicationScheduleSchema.partial().parse(req.body);
      
      const updatedSchedule = await storage.updateMedicationSchedule(id, updates);
      if (!updatedSchedule) {
        return res.status(404).json({ message: "Medication schedule not found" });
      }
      
      res.json(updatedSchedule);
    } catch (error) {
      res.status(400).json({ message: "Invalid medication schedule data" });
    }
  });

  // Get medication logs for a specific date
  app.get("/api/medication-logs/:date", async (req, res) => {
    try {
      const { date } = req.params;
      const logs = await storage.getMedicationLogsForDate(date);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to get medication logs" });
    }
  });

  // Mark medication as taken
  app.post("/api/medication-logs", async (req, res) => {
    try {
      const logData = insertMedicationLogSchema.parse(req.body);
      
      // Check if already taken
      const existing = await storage.getMedicationLogForCompartmentAndDate(
        logData.compartment, 
        logData.date
      );
      
      if (existing) {
        return res.status(409).json({ message: "Medication already marked as taken for this time today" });
      }
      
      const log = await storage.createMedicationLog(logData);
      res.status(201).json(log);
    } catch (error) {
      res.status(400).json({ message: "Invalid medication log data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
