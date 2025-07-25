import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExpertiseCube } from "@/components/expertise-cube";
import { SidebarControls } from "@/components/sidebar-controls";
import { InformationPanel } from "@/components/information-panel";
import { EmployeeInputForm } from "@/components/employee-input-form";
import { FaceDetailModal } from "@/components/face-detail-modal";
import { Box, Plus, User } from "lucide-react";
import type { Employee, ExpertiseScore, Project } from "@shared/schema";

export default function Dashboard() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [selectedFace, setSelectedFace] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    dimensions: {
      technicalSkills: true,
      leadership: true,
      communication: true,
      projectManagement: true,
      innovation: true,
      domainKnowledge: true,
    },
    minExperienceYears: 3,
    department: "All Departments",
  });

  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
  });

  const { data: expertiseScores = [] } = useQuery<ExpertiseScore[]>({
    queryKey: ["/api/expertise-scores"],
  });

  // Use first employee as default selection
  const currentEmployeeId = selectedEmployeeId || employees[0]?.id;
  
  const { data: currentEmployee } = useQuery<Employee>({
    queryKey: ["/api/employees", currentEmployeeId],
    enabled: !!currentEmployeeId,
  });

  const { data: currentExpertiseScore } = useQuery<ExpertiseScore>({
    queryKey: ["/api/employees", currentEmployeeId, "expertise"],
    enabled: !!currentEmployeeId,
  });

  const { data: currentProjects = [] } = useQuery<Project[]>({
    queryKey: ["/api/employees", currentEmployeeId, "projects"],
    enabled: !!currentEmployeeId,
  });

  const handleFaceClick = (faceName: string) => {
    setSelectedFace(faceName);
  };

  const handleEmployeeSelect = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
  };

  return (
    <div className="min-h-screen bg-ms-bg">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-ms-blue rounded-lg flex items-center justify-center">
                <Box className="text-white text-sm" size={16} />
              </div>
              <h1 className="text-xl font-semibold ms-text">Employee Expertise Analysis</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-ms-blue text-white hover:bg-blue-600">
                    <Plus className="mr-2" size={16} />
                    New Analysis
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Employee Data</DialogTitle>
                  </DialogHeader>
                  <EmployeeInputForm />
                </DialogContent>
              </Dialog>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User size={16} className="text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)] overflow-hidden">
        {/* Sidebar Controls */}
        <SidebarControls 
          filters={filters}
          onFiltersChange={setFilters}
          employees={employees}
          onEmployeeSelect={handleEmployeeSelect}
          selectedEmployeeId={currentEmployeeId}
        />

        {/* Main Dashboard Area */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex">
            {/* 3D Visualization Area */}
            <div className="flex-1 bg-white relative">
              {currentExpertiseScore ? (
                <ExpertiseCube
                  expertiseScore={currentExpertiseScore}
                  filters={filters}
                  onFaceClick={handleFaceClick}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                  <Card className="max-w-md mx-auto">
                    <CardContent className="pt-6 text-center">
                      <Box className="mx-auto mb-4 text-gray-400" size={48} />
                      <h3 className="font-semibold mb-2">No Data Available</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Add employee data to begin expertise analysis
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="bg-ms-blue text-white">
                            Add Employee Data
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Add Employee Data</DialogTitle>
                          </DialogHeader>
                          <EmployeeInputForm />
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Information Panel */}
            {currentEmployee && currentExpertiseScore && (
              <InformationPanel
                employee={currentEmployee}
                expertiseScore={currentExpertiseScore}
                projects={currentProjects}
              />
            )}
          </div>
        </main>
      </div>

      {/* Face Detail Modal */}
      {selectedFace && currentExpertiseScore && (
        <FaceDetailModal
          faceName={selectedFace}
          expertiseScore={currentExpertiseScore}
          onClose={() => setSelectedFace(null)}
        />
      )}
    </div>
  );
}
