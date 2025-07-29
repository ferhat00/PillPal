import { sql } from "drizzle-orm";
import { pgTable, text, varchar, time, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const medicationSchedules = pgTable("medication_schedules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  morningTime: time("morning_time"),
  morningEnabled: boolean("morning_enabled").default(false),
  afternoonTime: time("afternoon_time"),
  afternoonEnabled: boolean("afternoon_enabled").default(false),
  eveningTime: time("evening_time"),
  eveningEnabled: boolean("evening_enabled").default(false),
  nightTime: time("night_time"),
  nightEnabled: boolean("night_enabled").default(false),
});

export const medicationLogs = pgTable("medication_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  scheduleId: varchar("schedule_id").notNull(),
  compartment: text("compartment").notNull(), // morning, afternoon, evening, night
  takenAt: text("taken_at").notNull(), // ISO date string
  date: text("date").notNull(), // YYYY-MM-DD format
});

export const insertMedicationScheduleSchema = createInsertSchema(medicationSchedules).omit({
  id: true,
});

export const insertMedicationLogSchema = createInsertSchema(medicationLogs).omit({
  id: true,
});

export type MedicationSchedule = typeof medicationSchedules.$inferSelect;
export type InsertMedicationSchedule = z.infer<typeof insertMedicationScheduleSchema>;
export type MedicationLog = typeof medicationLogs.$inferSelect;
export type InsertMedicationLog = z.infer<typeof insertMedicationLogSchema>;

// User schema (keeping existing for potential future use)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
