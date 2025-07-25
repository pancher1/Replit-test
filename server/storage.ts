import { type Employee, type InsertEmployee, type Project, type InsertProject, type ExpertiseScore, type InsertExpertiseScore } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Employee operations
  getEmployee(id: string): Promise<Employee | undefined>;
  getAllEmployees(): Promise<Employee[]>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: string, employee: Partial<InsertEmployee>): Promise<Employee | undefined>;
  
  // Project operations
  getProjectsByEmployeeId(employeeId: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  
  // Expertise score operations
  getExpertiseScore(employeeId: string): Promise<ExpertiseScore | undefined>;
  createOrUpdateExpertiseScore(score: InsertExpertiseScore): Promise<ExpertiseScore>;
  getAllExpertiseScores(): Promise<ExpertiseScore[]>;
}

export class MemStorage implements IStorage {
  private employees: Map<string, Employee>;
  private projects: Map<string, Project>;
  private expertiseScores: Map<string, ExpertiseScore>;

  constructor() {
    this.employees = new Map();
    this.projects = new Map();
    this.expertiseScores = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample employee
    const employeeId = randomUUID();
    const employee: Employee = {
      id: employeeId,
      name: "John Smith",
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "San Francisco",
      experienceYears: 8,
      teamSize: 12,
      email: "john.smith@company.com",
      resumeData: null,
      evaluationData: null,
    };
    this.employees.set(employeeId, employee);

    // Sample projects
    const project1: Project = {
      id: randomUUID(),
      employeeId,
      name: "E-commerce Platform Redesign",
      description: "Led frontend development team for complete platform redesign",
      duration: "6 months",
      role: "Lead Frontend Developer",
      technologies: ["React", "TypeScript", "Node.js", "PostgreSQL"],
      impact: "Increased user engagement by 35% and reduced load times by 50%",
    };

    const project2: Project = {
      id: randomUUID(),
      employeeId,
      name: "API Microservices Migration",
      description: "Migrated monolithic API to microservices architecture",
      duration: "4 months",
      role: "Technical Lead",
      technologies: ["Python", "Docker", "Kubernetes", "MongoDB"],
      impact: "Improved system scalability and reduced deployment times by 60%",
    };

    this.projects.set(project1.id, project1);
    this.projects.set(project2.id, project2);

    // Sample expertise scores
    const expertiseScore: ExpertiseScore = {
      id: randomUUID(),
      employeeId,
      technicalSkills: 8.5,
      leadership: 7.2,
      communication: 9.1,
      projectManagement: 6.8,
      innovation: 8.9,
      domainKnowledge: 7.5,
      overallScore: 8.0,
      lastUpdated: new Date().toISOString(),
    };
    this.expertiseScores.set(employeeId, expertiseScore);
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    return this.employees.get(id);
  }

  async getAllEmployees(): Promise<Employee[]> {
    return Array.from(this.employees.values());
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const id = randomUUID();
    const employee: Employee = { 
      ...insertEmployee, 
      id,
      teamSize: insertEmployee.teamSize ?? null,
      email: insertEmployee.email ?? null,
      resumeData: insertEmployee.resumeData ?? null,
      evaluationData: insertEmployee.evaluationData ?? null,
    };
    this.employees.set(id, employee);
    return employee;
  }

  async updateEmployee(id: string, updateData: Partial<InsertEmployee>): Promise<Employee | undefined> {
    const existing = this.employees.get(id);
    if (!existing) return undefined;
    
    const updated: Employee = { ...existing, ...updateData };
    this.employees.set(id, updated);
    return updated;
  }

  async getProjectsByEmployeeId(employeeId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.employeeId === employeeId
    );
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = { 
      ...insertProject, 
      id,
      description: insertProject.description ?? null,
      duration: insertProject.duration ?? null,
      role: insertProject.role ?? null,
      technologies: insertProject.technologies ? Array.from(insertProject.technologies) : null,
      impact: insertProject.impact ?? null,
    };
    this.projects.set(id, project);
    return project;
  }

  async getExpertiseScore(employeeId: string): Promise<ExpertiseScore | undefined> {
    return this.expertiseScores.get(employeeId);
  }

  async createOrUpdateExpertiseScore(insertScore: InsertExpertiseScore): Promise<ExpertiseScore> {
    const existing = this.expertiseScores.get(insertScore.employeeId);
    const id = existing?.id || randomUUID();
    const score: ExpertiseScore = { ...insertScore, id };
    this.expertiseScores.set(insertScore.employeeId, score);
    return score;
  }

  async getAllExpertiseScores(): Promise<ExpertiseScore[]> {
    return Array.from(this.expertiseScores.values());
  }
}

export const storage = new MemStorage();
