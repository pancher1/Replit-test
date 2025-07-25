import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEmployeeSchema, resumeInputSchema, evaluationInputSchema, type ResumeInput, type EvaluationInput } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all employees
  app.get("/api/employees", async (req, res) => {
    try {
      const employees = await storage.getAllEmployees();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch employees" });
    }
  });

  // Get employee by ID
  app.get("/api/employees/:id", async (req, res) => {
    try {
      const employee = await storage.getEmployee(req.params.id);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch employee" });
    }
  });

  // Get projects for employee
  app.get("/api/employees/:id/projects", async (req, res) => {
    try {
      const projects = await storage.getProjectsByEmployeeId(req.params.id);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  // Get expertise score for employee
  app.get("/api/employees/:id/expertise", async (req, res) => {
    try {
      const score = await storage.getExpertiseScore(req.params.id);
      if (!score) {
        return res.status(404).json({ message: "Expertise score not found" });
      }
      res.json(score);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch expertise score" });
    }
  });

  // Create employee from resume data
  app.post("/api/employees/resume", async (req, res) => {
    try {
      const validatedData = resumeInputSchema.parse(req.body);
      
      // Create employee
      const employee = await storage.createEmployee({
        ...validatedData.personalInfo,
        resumeData: validatedData,
        evaluationData: null,
      });

      // Create projects if provided
      if (validatedData.projects) {
        for (const projectData of validatedData.projects) {
          await storage.createProject({
            employeeId: employee.id,
            ...projectData,
          });
        }
      }

      // Calculate initial expertise scores based on resume data
      const scores = calculateExpertiseFromResume(validatedData);
      await storage.createOrUpdateExpertiseScore({
        employeeId: employee.id,
        ...scores,
        lastUpdated: new Date().toISOString(),
      });

      res.json(employee);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create employee from resume" });
    }
  });

  // Add 360-degree evaluation
  app.post("/api/evaluations", async (req, res) => {
    try {
      const validatedData = evaluationInputSchema.parse(req.body);
      
      const employee = await storage.getEmployee(validatedData.employeeId);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      // Update evaluation data
      const updatedEvaluationData = {
        ...(employee.evaluationData as any || {}),
        evaluations: [
          ...((employee.evaluationData as any)?.evaluations || []),
          {
            ...validatedData,
            timestamp: new Date().toISOString(),
          }
        ]
      };

      await storage.updateEmployee(validatedData.employeeId, {
        evaluationData: updatedEvaluationData,
      });

      // Recalculate expertise scores incorporating the new evaluation
      const scores = calculateExpertiseFromEvaluation(validatedData, employee);
      await storage.createOrUpdateExpertiseScore({
        employeeId: validatedData.employeeId,
        ...scores,
        lastUpdated: new Date().toISOString(),
      });

      res.json({ message: "Evaluation added successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add evaluation" });
    }
  });

  // Get all expertise scores for analytics
  app.get("/api/expertise-scores", async (req, res) => {
    try {
      const scores = await storage.getAllExpertiseScores();
      res.json(scores);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch expertise scores" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to calculate expertise scores from resume data
function calculateExpertiseFromResume(resumeData: ResumeInput) {
  const { personalInfo, projects, skills } = resumeData;
  
  // Base scoring algorithm - can be enhanced with more sophisticated analysis
  const baseScore = Math.min(personalInfo.experienceYears * 0.5, 5); // Experience factor
  
  // Technical skills based on technologies used
  const techSkills = projects?.reduce((acc, project) => {
    return acc + (project.technologies?.length || 0) * 0.2;
  }, baseScore) || baseScore;
  
  // Leadership based on role descriptions
  const leadership = projects?.some(p => 
    p.role?.toLowerCase().includes('lead') || p.role?.toLowerCase().includes('senior')
  ) ? baseScore + 2 : baseScore;
  
  // Communication based on impact descriptions
  const communication = projects?.some(p => p.impact && p.impact.length > 50) 
    ? baseScore + 1.5 : baseScore;
  
  return {
    technicalSkills: Math.min(techSkills, 10),
    leadership: Math.min(leadership, 10),
    communication: Math.min(communication, 10),
    projectManagement: Math.min(baseScore + (projects?.length || 0) * 0.5, 10),
    innovation: Math.min(baseScore + 1, 10),
    domainKnowledge: Math.min(baseScore + 1.5, 10),
    overallScore: Math.min((techSkills + leadership + communication) / 3, 10),
  };
}

// Helper function to calculate expertise scores from evaluation data
function calculateExpertiseFromEvaluation(evaluationData: EvaluationInput, employee: any) {
  // Get existing scores or defaults
  const existing = employee.expertiseScores || {};
  
  // Simple average with existing scores (can be enhanced with weighted averages)
  return {
    technicalSkills: evaluationData.technicalSkills,
    leadership: evaluationData.leadership,
    communication: evaluationData.communication,
    projectManagement: evaluationData.projectManagement,
    innovation: evaluationData.innovation,
    domainKnowledge: evaluationData.domainKnowledge,
    overallScore: (
      evaluationData.technicalSkills +
      evaluationData.leadership +
      evaluationData.communication +
      evaluationData.projectManagement +
      evaluationData.innovation +
      evaluationData.domainKnowledge
    ) / 6,
  };
}
