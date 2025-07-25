import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Award, FileText, Users, TrendingUp } from "lucide-react";
import type { ExpertiseScore } from "@shared/schema";

interface FaceDetailModalProps {
  faceName: string;
  expertiseScore: ExpertiseScore;
  onClose: () => void;
}

const faceDetails = {
  technicalSkills: {
    title: "Technical Skills",
    color: "#0078D4",
    icon: "💻",
    subSkills: [
      { name: "JavaScript/TypeScript", score: 9.2 },
      { name: "React/Frontend", score: 8.8 },
      { name: "Node.js/Backend", score: 8.0 },
      { name: "Database Design", score: 7.5 },
      { name: "Cloud Platforms", score: 7.8 },
      { name: "DevOps/CI-CD", score: 7.2 },
    ],
    evidence: [
      { type: "certification", title: "AWS Certified Solutions Architect • React Developer Certification", icon: Award },
      { type: "project", title: "Led 3 major full-stack projects • 95% client satisfaction rate", icon: FileText },
      { type: "peer", title: "360° feedback from 8 colleagues • Average technical rating: 8.5/10", icon: Users },
    ],
    growthTrend: "+15% improvement",
  },
  leadership: {
    title: "Leadership",
    color: "#107C10",
    icon: "👥",
    subSkills: [
      { name: "Team Management", score: 7.5 },
      { name: "Strategic Planning", score: 6.8 },
      { name: "Decision Making", score: 7.2 },
      { name: "Mentoring", score: 8.0 },
      { name: "Conflict Resolution", score: 6.5 },
      { name: "Vision Setting", score: 7.0 },
    ],
    evidence: [
      { type: "project", title: "Successfully led team of 12 developers across 3 major projects", icon: FileText },
      { type: "peer", title: "Strong mentoring skills recognized by junior team members", icon: Users },
      { type: "certification", title: "Completed Leadership Excellence Program", icon: Award },
    ],
    growthTrend: "+8% improvement",
  },
  communication: {
    title: "Communication",
    color: "#FFB900",
    icon: "💬",
    subSkills: [
      { name: "Verbal Communication", score: 9.0 },
      { name: "Written Communication", score: 8.8 },
      { name: "Presentation Skills", score: 9.5 },
      { name: "Active Listening", score: 8.7 },
      { name: "Cross-team Collaboration", score: 9.2 },
      { name: "Client Interaction", score: 8.9 },
    ],
    evidence: [
      { type: "project", title: "Presented to C-level executives with 100% approval rate", icon: FileText },
      { type: "peer", title: "Consistently rated as top communicator in team surveys", icon: Users },
      { type: "certification", title: "Public Speaking and Presentation Certification", icon: Award },
    ],
    growthTrend: "+12% improvement",
  },
  projectManagement: {
    title: "Project Management",
    color: "#D13438",
    icon: "📋",
    subSkills: [
      { name: "Project Planning", score: 7.0 },
      { name: "Resource Management", score: 6.5 },
      { name: "Risk Assessment", score: 6.8 },
      { name: "Timeline Management", score: 7.2 },
      { name: "Stakeholder Management", score: 6.9 },
      { name: "Quality Assurance", score: 7.5 },
    ],
    evidence: [
      { type: "project", title: "Delivered 85% of projects on time and within budget", icon: FileText },
      { type: "certification", title: "PMP Certification in progress", icon: Award },
      { type: "peer", title: "Recognized for excellent planning and execution skills", icon: Users },
    ],
    growthTrend: "+5% improvement",
  },
  innovation: {
    title: "Innovation",
    color: "#881798",
    icon: "💡",
    subSkills: [
      { name: "Creative Problem Solving", score: 9.0 },
      { name: "Technology Adoption", score: 8.5 },
      { name: "Process Improvement", score: 8.8 },
      { name: "Research & Development", score: 8.2 },
      { name: "Ideation", score: 9.2 },
      { name: "Implementation", score: 8.7 },
    ],
    evidence: [
      { type: "project", title: "Introduced 3 innovative solutions that increased efficiency by 40%", icon: FileText },
      { type: "certification", title: "Design Thinking and Innovation Workshop", icon: Award },
      { type: "peer", title: "Known as the 'go-to person' for creative solutions", icon: Users },
    ],
    growthTrend: "+18% improvement",
  },
  domainKnowledge: {
    title: "Domain Knowledge",
    color: "#6B7280",
    icon: "🎓",
    subSkills: [
      { name: "Industry Understanding", score: 7.8 },
      { name: "Business Acumen", score: 7.2 },
      { name: "Regulatory Knowledge", score: 7.0 },
      { name: "Market Awareness", score: 7.5 },
      { name: "Technical Standards", score: 8.0 },
      { name: "Best Practices", score: 7.7 },
    ],
    evidence: [
      { type: "certification", title: "Industry-specific certifications and continuous learning", icon: Award },
      { type: "project", title: "Applied domain expertise to solve complex business challenges", icon: FileText },
      { type: "peer", title: "Recognized subject matter expert by colleagues", icon: Users },
    ],
    growthTrend: "+10% improvement",
  },
};

export function FaceDetailModal({ faceName, expertiseScore, onClose }: FaceDetailModalProps) {
  const detail = faceDetails[faceName as keyof typeof faceDetails];
  const score = expertiseScore[faceName as keyof ExpertiseScore] as number;

  if (!detail) return null;

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{detail.icon}</span>
              {detail.title} - Detailed Analysis
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Overall Score */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Overall Score</h3>
                <span className="text-2xl font-bold" style={{ color: detail.color }}>
                  {score.toFixed(1)}/10
                </span>
              </div>
              <Progress value={score * 10} className="mb-2" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Performance Level</span>
                <Badge variant={score >= 8 ? "default" : score >= 6 ? "secondary" : "destructive"}>
                  {score >= 8 ? "Excellent" : score >= 6 ? "Good" : "Needs Improvement"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Skills Breakdown */}
          <div>
            <h3 className="font-semibold mb-4">Skills Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {detail.subSkills.map((skill) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">{skill.name}</span>
                    <span className="font-medium">{skill.score.toFixed(1)}/10</span>
                  </div>
                  <Progress value={skill.score * 10} />
                </div>
              ))}
            </div>
          </div>

          {/* Evidence & Sources */}
          <div>
            <h3 className="font-semibold mb-4">Evidence & Sources</h3>
            <div className="space-y-3">
              {detail.evidence.map((evidence, index) => (
                <Card key={index}>
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <evidence.icon 
                        size={16} 
                        className={
                          evidence.type === 'certification' ? 'text-ms-blue' :
                          evidence.type === 'project' ? 'text-ms-green' : 'text-ms-purple'
                        }
                      />
                      <span className="font-medium text-sm capitalize">
                        {evidence.type === 'certification' ? 'Certification' :
                         evidence.type === 'project' ? 'Project' : 'Peer Reviews'} Evidence
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{evidence.title}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Growth Trend */}
          <Card style={{ background: `linear-gradient(135deg, ${detail.color}10, ${detail.color}05)` }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <TrendingUp size={16} style={{ color: detail.color }} />
                  Growth Trend (Last 12 Months)
                </h3>
                <span className="text-sm font-semibold text-green-600">
                  {detail.growthTrend}
                </span>
              </div>
              <Progress value={85} className="mb-2" />
              <p className="text-sm text-gray-600">
                Consistent improvement shown across all skill areas with notable growth in key competencies.
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button className="flex-1" variant="outline">
              View Historical Data
            </Button>
            <Button className="flex-1" style={{ backgroundColor: detail.color, color: 'white' }}>
              Create Development Plan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
