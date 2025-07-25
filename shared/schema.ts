import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const employees = pgTable("employees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  title: text("title").notNull(),
  department: text("department").notNull(),
  location: text("location").notNull(),
  experienceYears: integer("experience_years").notNull(),
  teamSize: integer("team_size"),
  email: text("email"),
  resumeData: jsonb("resume_data"),
  evaluationData: jsonb("evaluation_data"),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").notNull().references(() => employees.id),
  name: text("name").notNull(),
  description: text("description"),
  duration: text("duration"),
  role: text("role"),
  technologies: jsonb("technologies").$type<string[]>(),
  impact: text("impact"),
});

export const expertiseScores = pgTable("expertise_scores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").notNull().references(() => employees.id),
  technicalSkills: real("technical_skills").notNull(),
  leadership: real("leadership").notNull(),
  communication: real("communication").notNull(),
  projectManagement: real("project_management").notNull(),
  innovation: real("innovation").notNull(),
  domainKnowledge: real("domain_knowledge").notNull(),
  overallScore: real("overall_score").notNull(),
  lastUpdated: text("last_updated").notNull(),
});

export const insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
});

export const insertExpertiseScoreSchema = createInsertSchema(expertiseScores).omit({
  id: true,
});

export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Employee = typeof employees.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertExpertiseScore = z.infer<typeof insertExpertiseScoreSchema>;
export type ExpertiseScore = typeof expertiseScores.$inferSelect;

export const resumeInputSchema = z.object({
  personalInfo: z.object({
    name: z.string().min(1, "Name is required"),
    title: z.string().min(1, "Title is required"),
    department: z.string().min(1, "Department is required"),
    location: z.string().min(1, "Location is required"),
    experienceYears: z.number().min(0).max(50),
    email: z.string().email().optional(),
  }),
  projects: z.array(z.object({
    name: z.string().min(1, "Project name is required"),
    description: z.string().optional(),
    duration: z.string().optional(),
    role: z.string().optional(),
    technologies: z.array(z.string()).optional(),
    impact: z.string().optional(),
  })).optional(),
  skills: z.array(z.string()).optional(),
  achievements: z.array(z.string()).optional(),
});

export const evaluationInputSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  technicalSkills: z.number().min(1).max(10),
  leadership: z.number().min(1).max(10),
  communication: z.number().min(1).max(10),
  projectManagement: z.number().min(1).max(10),
  innovation: z.number().min(1).max(10),
  domainKnowledge: z.number().min(1).max(10),
  feedback: z.string().optional(),
  evaluatorName: z.string().min(1, "Evaluator name is required"),
});

export type ResumeInput = z.infer<typeof resumeInputSchema>;
export type EvaluationInput = z.infer<typeof evaluationInputSchema>;
