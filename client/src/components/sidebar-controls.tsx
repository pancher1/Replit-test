import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmployeeInputForm } from "./employee-input-form";
import { Upload, Users, ProjectorIcon, RefreshCw, Download } from "lucide-react";
import type { Employee } from "@shared/schema";

interface SidebarControlsProps {
  filters: {
    dimensions: Record<string, boolean>;
    minExperienceYears: number;
    department: string;
  };
  onFiltersChange: (filters: any) => void;
  employees: Employee[];
  onEmployeeSelect: (employeeId: string) => void;
  selectedEmployeeId?: string;
}

export function SidebarControls({
  filters,
  onFiltersChange,
  employees,
  onEmployeeSelect,
  selectedEmployeeId,
}: SidebarControlsProps) {
  
  const updateDimension = (dimension: string, checked: boolean) => {
    onFiltersChange({
      ...filters,
      dimensions: {
        ...filters.dimensions,
        [dimension]: checked,
      },
    });
  };

  const updateExperienceYears = (value: number[]) => {
    onFiltersChange({
      ...filters,
      minExperienceYears: value[0],
    });
  };

  const updateDepartment = (department: string) => {
    onFiltersChange({
      ...filters,
      department,
    });
  };

  return (
    <aside className="w-80 bg-white shadow-lg border-r border-gray-200 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Data Input Section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 ms-text">Data Input</h3>
          <div className="space-y-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-ms-blue text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors text-left justify-start">
                  <Upload className="mr-3" size={16} />
                  Upload Resume Data
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Upload Resume Data</DialogTitle>
                </DialogHeader>
                <EmployeeInputForm />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-ms-green text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors text-left justify-start">
                  <Users className="mr-3" size={16} />
                  Add 360° Evaluation
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add 360° Evaluation</DialogTitle>
                </DialogHeader>
                <EmployeeInputForm />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors text-left justify-start">
                  <ProjectorIcon className="mr-3" size={16} />
                  Import Project Data
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Import Project Data</DialogTitle>
                </DialogHeader>
                <EmployeeInputForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Employee Selection */}
        {employees.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold ms-text">Select Employee</h3>
            <Select value={selectedEmployeeId} onValueChange={onEmployeeSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name} - {employee.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Filters Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold ms-text">Filters & Analysis</h3>
          
          {/* Expertise Dimensions */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3 text-sm uppercase tracking-wide text-gray-600">
                Expertise Dimensions
              </h4>
              <div className="space-y-2">
                {[
                  { key: "technicalSkills", label: "Technical Skills" },
                  { key: "leadership", label: "Leadership" },
                  { key: "communication", label: "Communication" },
                  { key: "projectManagement", label: "Project Management" },
                  { key: "innovation", label: "Innovation" },
                  { key: "domainKnowledge", label: "Domain Knowledge" },
                ].map((dimension) => (
                  <div key={dimension.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={dimension.key}
                      checked={filters.dimensions[dimension.key] !== false}
                      onCheckedChange={(checked) => 
                        updateDimension(dimension.key, checked as boolean)
                      }
                    />
                    <Label htmlFor={dimension.key} className="text-sm">
                      {dimension.label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Experience Level Filter */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3 text-sm uppercase tracking-wide text-gray-600">
                Experience Level
              </h4>
              <div className="space-y-2">
                <Label className="text-sm text-gray-600 mb-1 block">
                  Minimum Years: <span className="font-medium">{filters.minExperienceYears}</span>
                </Label>
                <Slider
                  min={0}
                  max={20}
                  step={1}
                  value={[filters.minExperienceYears]}
                  onValueChange={updateExperienceYears}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Department Filter */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3 text-sm uppercase tracking-wide text-gray-600">
                Department
              </h4>
              <Select value={filters.department} onValueChange={updateDepartment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Departments">All Departments</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Product">Product</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Actions */}
        <div className="space-y-3">
          <Button className="w-full bg-ms-yellow text-ms-text py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors">
            <RefreshCw className="mr-2" size={16} />
            Refresh Analysis
          </Button>
          <Button className="w-full bg-gray-200 text-ms-text py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
            <Download className="mr-2" size={16} />
            Export Report
          </Button>
        </div>
      </div>
    </aside>
  );
}
