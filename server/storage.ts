import { type MedicationSchedule, type InsertMedicationSchedule, type MedicationLog, type InsertMedicationLog, type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods (existing)
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Medication schedule methods
  getMedicationSchedule(): Promise<MedicationSchedule | undefined>;
  createMedicationSchedule(schedule: InsertMedicationSchedule): Promise<MedicationSchedule>;
  updateMedicationSchedule(id: string, schedule: Partial<InsertMedicationSchedule>): Promise<MedicationSchedule | undefined>;
  
  // Medication log methods
  getMedicationLogsForDate(date: string): Promise<MedicationLog[]>;
  createMedicationLog(log: InsertMedicationLog): Promise<MedicationLog>;
  getMedicationLogForCompartmentAndDate(compartment: string, date: string): Promise<MedicationLog | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private medicationSchedules: Map<string, MedicationSchedule>;
  private medicationLogs: Map<string, MedicationLog>;

  constructor() {
    this.users = new Map();
    this.medicationSchedules = new Map();
    this.medicationLogs = new Map();
    
    // Create default medication schedule
    this.initializeDefaultSchedule();
  }

  private async initializeDefaultSchedule() {
    const defaultSchedule: MedicationSchedule = {
      id: randomUUID(),
      name: "Daily Medications",
      morningTime: "08:00",
      morningEnabled: true,
      afternoonTime: "14:00",
      afternoonEnabled: true,
      eveningTime: "18:00",
      eveningEnabled: true,
      nightTime: "22:00",
      nightEnabled: true,
    };
    this.medicationSchedules.set(defaultSchedule.id, defaultSchedule);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Medication schedule methods
  async getMedicationSchedule(): Promise<MedicationSchedule | undefined> {
    // Return the first (and likely only) schedule
    return Array.from(this.medicationSchedules.values())[0];
  }

  async createMedicationSchedule(insertSchedule: InsertMedicationSchedule): Promise<MedicationSchedule> {
    const id = randomUUID();
    const schedule: MedicationSchedule = { 
      id,
      name: insertSchedule.name,
      morningTime: insertSchedule.morningTime || null,
      morningEnabled: insertSchedule.morningEnabled || null,
      afternoonTime: insertSchedule.afternoonTime || null,
      afternoonEnabled: insertSchedule.afternoonEnabled || null,
      eveningTime: insertSchedule.eveningTime || null,
      eveningEnabled: insertSchedule.eveningEnabled || null,
      nightTime: insertSchedule.nightTime || null,
      nightEnabled: insertSchedule.nightEnabled || null,
    };
    this.medicationSchedules.set(id, schedule);
    return schedule;
  }

  async updateMedicationSchedule(id: string, updates: Partial<InsertMedicationSchedule>): Promise<MedicationSchedule | undefined> {
    const existing = this.medicationSchedules.get(id);
    if (!existing) return undefined;
    
    const updated: MedicationSchedule = { ...existing, ...updates };
    this.medicationSchedules.set(id, updated);
    return updated;
  }

  // Medication log methods
  async getMedicationLogsForDate(date: string): Promise<MedicationLog[]> {
    return Array.from(this.medicationLogs.values()).filter(log => log.date === date);
  }

  async createMedicationLog(insertLog: InsertMedicationLog): Promise<MedicationLog> {
    const id = randomUUID();
    const log: MedicationLog = { ...insertLog, id };
    this.medicationLogs.set(id, log);
    return log;
  }

  async getMedicationLogForCompartmentAndDate(compartment: string, date: string): Promise<MedicationLog | undefined> {
    return Array.from(this.medicationLogs.values()).find(
      log => log.compartment === compartment && log.date === date
    );
  }
}

export const storage = new MemStorage();
