import type { ResumeInput, EvaluationInput, ExpertiseScore } from "@shared/schema";

export interface AnalysisResult {
  technicalSkills: number;
  leadership: number;
  communication: number;
  projectManagement: number;
  innovation: number;
  domainKnowledge: number;
  overallScore: number;
  confidence: number;
  recommendations: string[];
}

export class ExpertiseAnalysisEngine {
  
  /**
   * Analyze expertise from resume data
   */
  static analyzeResume(resumeData: ResumeInput): AnalysisResult {
    const { personalInfo, projects = [], skills = [], achievements = [] } = resumeData;
    
    const baseExperience = Math.min(personalInfo.experienceYears * 0.3, 3);
    
    // Technical Skills Analysis
    const techKeywords = ['javascript', 'typescript', 'react', 'node', 'python', 'java', 'aws', 'docker', 'kubernetes'];
    const techScore = this.calculateTechnicalScore(projects, skills, techKeywords, baseExperience);
    
    // Leadership Analysis
    const leadershipScore = this.calculateLeadershipScore(projects, personalInfo.experienceYears, baseExperience);
    
    // Communication Analysis
    const communicationScore = this.calculateCommunicationScore(projects, achievements, baseExperience);
    
    // Project Management Analysis
    const projectMgmtScore = this.calculateProjectManagementScore(projects, baseExperience);
    
    // Innovation Analysis
    const innovationScore = this.calculateInnovationScore(projects, achievements, skills, baseExperience);
    
    // Domain Knowledge Analysis
    const domainScore = this.calculateDomainKnowledgeScore(personalInfo, projects, baseExperience);
    
    const overallScore = (techScore + leadershipScore + communicationScore + projectMgmtScore + innovationScore + domainScore) / 6;
    
    return {
      technicalSkills: Math.min(techScore, 10),
      leadership: Math.min(leadershipScore, 10),
      communication: Math.min(communicationScore, 10),
      projectManagement: Math.min(projectMgmtScore, 10),
      innovation: Math.min(innovationScore, 10),
      domainKnowledge: Math.min(domainScore, 10),
      overallScore: Math.min(overallScore, 10),
      confidence: this.calculateConfidence(projects.length, skills.length, achievements.length),
      recommendations: this.generateRecommendations(techScore, leadershipScore, communicationScore),
    };
  }

  /**
   * Analyze expertise from 360-degree evaluation
   */
  static analyzeEvaluation(evaluationData: EvaluationInput): AnalysisResult {
    const {
      technicalSkills,
      leadership,
      communication,
      projectManagement,
      innovation,
      domainKnowledge,
    } = evaluationData;

    const overallScore = (technicalSkills + leadership + communication + projectManagement + innovation + domainKnowledge) / 6;

    return {
      technicalSkills,
      leadership,
      communication,
      projectManagement,
      innovation,
      domainKnowledge,
      overallScore,
      confidence: 0.9, // High confidence from direct evaluation
      recommendations: this.generateRecommendations(technicalSkills, leadership, communication),
    };
  }

  /**
   * Combine multiple analysis results with weighted averaging
   */
  static combineAnalyses(analyses: AnalysisResult[], weights: number[]): AnalysisResult {
    if (analyses.length !== weights.length) {
      throw new Error("Analyses and weights arrays must have the same length");
    }

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const normalizedWeights = weights.map(w => w / totalWeight);

    const combined: AnalysisResult = {
      technicalSkills: 0,
      leadership: 0,
      communication: 0,
      projectManagement: 0,
      innovation: 0,
      domainKnowledge: 0,
      overallScore: 0,
      confidence: 0,
      recommendations: [],
    };

    analyses.forEach((analysis, index) => {
      const weight = normalizedWeights[index];
      combined.technicalSkills += analysis.technicalSkills * weight;
      combined.leadership += analysis.leadership * weight;
      combined.communication += analysis.communication * weight;
      combined.projectManagement += analysis.projectManagement * weight;
      combined.innovation += analysis.innovation * weight;
      combined.domainKnowledge += analysis.domainKnowledge * weight;
      combined.confidence += analysis.confidence * weight;
    });

    combined.overallScore = (
      combined.technicalSkills + combined.leadership + combined.communication +
      combined.projectManagement + combined.innovation + combined.domainKnowledge
    ) / 6;

    combined.recommendations = this.generateRecommendations(
      combined.technicalSkills,
      combined.leadership,
      combined.communication
    );

    return combined;
  }

  private static calculateTechnicalScore(projects: any[], skills: string[], techKeywords: string[], baseScore: number): number {
    let score = baseScore;
    
    // Score from projects
    projects.forEach(project => {
      if (project.technologies) {
        score += project.technologies.length * 0.2;
      }
      if (project.role?.toLowerCase().includes('lead') || project.role?.toLowerCase().includes('senior')) {
        score += 0.5;
      }
    });
    
    // Score from skills
    const techSkillsCount = skills.filter(skill => 
      techKeywords.some(keyword => skill.toLowerCase().includes(keyword))
    ).length;
    score += techSkillsCount * 0.3;
    
    return score;
  }

  private static calculateLeadershipScore(projects: any[], experience: number, baseScore: number): number {
    let score = baseScore;
    
    // Experience factor
    if (experience >= 5) score += 1;
    if (experience >= 8) score += 1;
    
    // Leadership roles in projects
    projects.forEach(project => {
      if (project.role?.toLowerCase().includes('lead')) score += 1;
      if (project.role?.toLowerCase().includes('manager')) score += 1.5;
      if (project.role?.toLowerCase().includes('senior')) score += 0.5;
    });
    
    return score;
  }

  private static calculateCommunicationScore(projects: any[], achievements: string[], baseScore: number): number {
    let score = baseScore;
    
    // Project impact descriptions (indicator of communication skills)
    projects.forEach(project => {
      if (project.impact && project.impact.length > 50) score += 0.5;
      if (project.description && project.description.length > 100) score += 0.3;
    });
    
    // Achievements that indicate communication
    const commAchievements = achievements.filter(achievement =>
      achievement.toLowerCase().includes('presentation') ||
      achievement.toLowerCase().includes('training') ||
      achievement.toLowerCase().includes('workshop')
    );
    score += commAchievements.length * 0.5;
    
    return score;
  }

  private static calculateProjectManagementScore(projects: any[], baseScore: number): number {
    let score = baseScore;
    
    // Number of projects managed
    score += projects.length * 0.4;
    
    // Project complexity indicators
    projects.forEach(project => {
      if (project.duration && project.duration.includes('month')) {
        const months = parseInt(project.duration);
        if (months >= 6) score += 0.5;
        if (months >= 12) score += 0.5;
      }
    });
    
    return score;
  }

  private static calculateInnovationScore(projects: any[], achievements: string[], skills: string[], baseScore: number): number {
    let score = baseScore;
    
    // Innovation keywords in projects
    const innovationKeywords = ['new', 'innovative', 'created', 'designed', 'improved', 'optimization'];
    projects.forEach(project => {
      const desc = (project.description || '').toLowerCase();
      const impact = (project.impact || '').toLowerCase();
      const hasInnovation = innovationKeywords.some(keyword => 
        desc.includes(keyword) || impact.includes(keyword)
      );
      if (hasInnovation) score += 0.5;
    });
    
    // Modern technologies (indicator of innovation adoption)
    const modernTech = ['react', 'vue', 'angular', 'kubernetes', 'microservices', 'ai', 'ml'];
    const hasModernTech = skills.some(skill =>
      modernTech.some(tech => skill.toLowerCase().includes(tech))
    );
    if (hasModernTech) score += 1;
    
    return score;
  }

  private static calculateDomainKnowledgeScore(personalInfo: any, projects: any[], baseScore: number): number {
    let score = baseScore;
    
    // Experience in specific domain
    score += personalInfo.experienceYears * 0.2;
    
    // Consistency in department/role
    if (personalInfo.title && personalInfo.department) {
      score += 1;
    }
    
    // Project variety and depth
    if (projects.length >= 3) score += 0.5;
    if (projects.length >= 5) score += 0.5;
    
    return score;
  }

  private static calculateConfidence(projectsCount: number, skillsCount: number, achievementsCount: number): number {
    let confidence = 0.3; // Base confidence
    
    if (projectsCount >= 2) confidence += 0.2;
    if (projectsCount >= 4) confidence += 0.2;
    if (skillsCount >= 5) confidence += 0.1;
    if (achievementsCount >= 2) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }

  private static generateRecommendations(tech: number, leadership: number, communication: number): string[] {
    const recommendations: string[] = [];
    
    if (tech >= 8) {
      recommendations.push("Excellent technical skills - consider mentoring junior developers");
    } else if (tech < 6) {
      recommendations.push("Focus on strengthening technical skills through training and hands-on projects");
    }
    
    if (leadership < 7) {
      recommendations.push("Consider leadership training to strengthen management capabilities");
    } else if (leadership >= 8) {
      recommendations.push("Strong leadership skills - ready for senior management roles");
    }
    
    if (communication >= 8) {
      recommendations.push("Outstanding communication skills - ideal for client-facing roles");
    } else if (communication < 6) {
      recommendations.push("Improve communication skills through presentation training and workshops");
    }
    
    return recommendations;
  }
}
