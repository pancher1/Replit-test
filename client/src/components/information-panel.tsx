import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AlertTriangle, Lightbulb, TrendingUp, ExternalLink } from "lucide-react";
import type { Employee, ExpertiseScore, Project } from "@shared/schema";

interface InformationPanelProps {
  employee: Employee;
  expertiseScore: ExpertiseScore;
  projects: Project[];
}

export function InformationPanel({ employee, expertiseScore, projects }: InformationPanelProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "bg-ms-green";
    if (score >= 6) return "bg-ms-yellow";
    return "bg-ms-red";
  };

  const getPerformanceLevel = (score: number) => {
    if (score >= 8.5) return "Excellent";
    if (score >= 7.5) return "Above Average";
    if (score >= 6.5) return "Average";
    return "Needs Improvement";
  };

  const skillsData = [
    { name: "Technical Skills", score: expertiseScore.technicalSkills, color: "bg-ms-blue" },
    { name: "Communication", score: expertiseScore.communication, color: "bg-ms-yellow" },
    { name: "Innovation", score: expertiseScore.innovation, color: "bg-ms-purple" },
    { name: "Domain Knowledge", score: expertiseScore.domainKnowledge, color: "bg-gray-600" },
    { name: "Leadership", score: expertiseScore.leadership, color: "bg-ms-green" },
    { name: "Project Management", score: expertiseScore.projectManagement, color: "bg-ms-red" },
  ];

  const recommendations = [
    {
      type: "warning",
      icon: AlertTriangle,
      text: "Consider leadership training to strengthen management skills",
      show: expertiseScore.leadership < 7.5,
    },
    {
      type: "success",
      icon: Lightbulb,
      text: "Excellent technical skills - mentor junior developers",
      show: expertiseScore.technicalSkills >= 8,
    },
    {
      type: "info",
      icon: TrendingUp,
      text: "Strong communication - ideal for client-facing roles",
      show: expertiseScore.communication >= 8,
    },
  ].filter(rec => rec.show);

  return (
    <div className="w-96 bg-ms-bg border-l border-gray-200 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Employee Profile Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-ms-blue text-white font-semibold">
                  {getInitials(employee.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold ms-text">{employee.name}</h3>
                <p className="text-sm text-gray-600">{employee.title}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Experience:</span>
                <span className="block font-medium">{employee.experienceYears} years</span>
              </div>
              <div>
                <span className="text-gray-600">Department:</span>
                <span className="block font-medium">{employee.department}</span>
              </div>
              <div>
                <span className="text-gray-600">Location:</span>
                <span className="block font-medium">{employee.location}</span>
              </div>
              <div>
                <span className="text-gray-600">Team Size:</span>
                <span className="block font-medium">{employee.teamSize || "N/A"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overall Score */}
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">Overall Expertise Score</h4>
            <div className="text-center">
              <div className="text-3xl font-bold text-ms-blue mb-2">
                {expertiseScore.overallScore.toFixed(1)}
              </div>
              <Progress 
                value={expertiseScore.overallScore * 10} 
                className="w-full mb-2"
              />
              <p className="text-sm text-gray-600">
                {getPerformanceLevel(expertiseScore.overallScore)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Scores */}
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">Detailed Breakdown</h4>
            <div className="space-y-3">
              {skillsData.map((skill) => (
                <div key={skill.name} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{skill.name}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`${getScoreColor(skill.score)} h-1.5 rounded-full`}
                        style={{ width: `${skill.score * 10}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{skill.score.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">Recent Projects</h4>
            <div className="space-y-3">
              {projects.length > 0 ? (
                projects.slice(0, 3).map((project) => (
                  <div key={project.id} className="border-l-4 border-ms-blue pl-3">
                    <h5 className="font-medium text-sm">{project.name}</h5>
                    <p className="text-xs text-gray-600">
                      {project.role} • {project.duration}
                    </p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.technologies.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No projects available</p>
              )}
              {projects.length > 3 && (
                <Button variant="link" className="text-ms-blue text-sm p-0 h-auto">
                  View all projects <ExternalLink size={12} className="ml-1" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3">Development Recommendations</h4>
              <div className="space-y-2">
                {recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <rec.icon 
                      className={`mt-1 text-xs ${
                        rec.type === 'warning' ? 'text-ms-yellow' :
                        rec.type === 'success' ? 'text-ms-green' : 'text-ms-blue'
                      }`}
                      size={12}
                    />
                    <p className="text-sm text-gray-700">{rec.text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Last Updated */}
        <div className="text-xs text-gray-500 text-center">
          Last updated: {new Date(expertiseScore.lastUpdated).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
