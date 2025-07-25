import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { resumeInputSchema, evaluationInputSchema, type ResumeInput, type EvaluationInput } from "@shared/schema";
import { Upload, Users, Plus, Trash2 } from "lucide-react";

export function EmployeeInputForm() {
  const [activeTab, setActiveTab] = useState("resume");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const resumeForm = useForm<ResumeInput>({
    resolver: zodResolver(resumeInputSchema),
    defaultValues: {
      personalInfo: {
        name: "",
        title: "",
        department: "",
        location: "",
        experienceYears: 0,
        email: "",
      },
      projects: [],
      skills: [],
      achievements: [],
    },
  });

  const evaluationForm = useForm<EvaluationInput>({
    resolver: zodResolver(evaluationInputSchema),
    defaultValues: {
      employeeId: "",
      technicalSkills: 5,
      leadership: 5,
      communication: 5,
      projectManagement: 5,
      innovation: 5,
      domainKnowledge: 5,
      feedback: "",
      evaluatorName: "",
    },
  });

  const resumeMutation = useMutation({
    mutationFn: (data: ResumeInput) => 
      apiRequest("POST", "/api/employees/resume", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      queryClient.invalidateQueries({ queryKey: ["/api/expertise-scores"] });
      toast({ title: "Success", description: "Employee data added successfully" });
      resumeForm.reset();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add employee data", variant: "destructive" });
    },
  });

  const evaluationMutation = useMutation({
    mutationFn: (data: EvaluationInput) => 
      apiRequest("POST", "/api/evaluations", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      queryClient.invalidateQueries({ queryKey: ["/api/expertise-scores"] });
      toast({ title: "Success", description: "Evaluation added successfully" });
      evaluationForm.reset();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add evaluation", variant: "destructive" });
    },
  });

  const onResumeSubmit = (data: ResumeInput) => {
    resumeMutation.mutate(data);
  };

  const onEvaluationSubmit = (data: EvaluationInput) => {
    evaluationMutation.mutate(data);
  };

  const addProject = () => {
    const currentProjects = resumeForm.getValues("projects") || [];
    resumeForm.setValue("projects", [
      ...currentProjects,
      { name: "", description: "", duration: "", role: "", technologies: [], impact: "" }
    ]);
  };

  const removeProject = (index: number) => {
    const currentProjects = resumeForm.getValues("projects") || [];
    resumeForm.setValue("projects", currentProjects.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="resume" className="flex items-center gap-2">
            <Upload size={16} />
            Resume Data
          </TabsTrigger>
          <TabsTrigger value="evaluation" className="flex items-center gap-2">
            <Users size={16} />
            360° Evaluation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resume" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload size={20} />
                Employee Resume Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...resumeForm}>
                <form onSubmit={resumeForm.handleSubmit(onResumeSubmit)} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={resumeForm.control}
                        name="personalInfo.name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Smith" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={resumeForm.control}
                        name="personalInfo.title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Senior Software Engineer" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={resumeForm.control}
                        name="personalInfo.department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Department</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Engineering">Engineering</SelectItem>
                                <SelectItem value="Product">Product</SelectItem>
                                <SelectItem value="Design">Design</SelectItem>
                                <SelectItem value="Marketing">Marketing</SelectItem>
                                <SelectItem value="Sales">Sales</SelectItem>
                                <SelectItem value="Operations">Operations</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={resumeForm.control}
                        name="personalInfo.location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input placeholder="San Francisco, CA" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={resumeForm.control}
                        name="personalInfo.experienceYears"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Years of Experience: {field.value}</FormLabel>
                            <FormControl>
                              <Slider
                                min={0}
                                max={20}
                                step={1}
                                value={[field.value]}
                                onValueChange={(value) => field.onChange(value[0])}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={resumeForm.control}
                        name="personalInfo.email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="john@company.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Projects */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Projects</h3>
                      <Button type="button" onClick={addProject} variant="outline" size="sm">
                        <Plus size={16} className="mr-2" />
                        Add Project
                      </Button>
                    </div>
                    
                    {resumeForm.watch("projects")?.map((_, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Project {index + 1}</h4>
                          <Button
                            type="button"
                            onClick={() => removeProject(index)}
                            variant="outline"
                            size="sm"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={resumeForm.control}
                            name={`projects.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Project Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="E-commerce Platform" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={resumeForm.control}
                            name={`projects.${index}.duration`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Duration</FormLabel>
                                <FormControl>
                                  <Input placeholder="6 months" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={resumeForm.control}
                            name={`projects.${index}.role`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Role</FormLabel>
                                <FormControl>
                                  <Input placeholder="Lead Developer" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={resumeForm.control}
                            name={`projects.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Project description..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-ms-blue text-white hover:bg-blue-600"
                    disabled={resumeMutation.isPending}
                  >
                    {resumeMutation.isPending ? "Processing..." : "Analyze Resume Data"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evaluation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users size={20} />
                360° Performance Evaluation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...evaluationForm}>
                <form onSubmit={evaluationForm.handleSubmit(onEvaluationSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={evaluationForm.control}
                      name="employeeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employee ID</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter employee ID" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={evaluationForm.control}
                      name="evaluatorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Evaluator Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Skill Ratings (1-10)</h3>
                    
                    {[
                      { name: "technicalSkills", label: "Technical Skills", color: "bg-ms-blue" },
                      { name: "leadership", label: "Leadership", color: "bg-ms-green" },
                      { name: "communication", label: "Communication", color: "bg-ms-yellow" },
                      { name: "projectManagement", label: "Project Management", color: "bg-ms-red" },
                      { name: "innovation", label: "Innovation", color: "bg-ms-purple" },
                      { name: "domainKnowledge", label: "Domain Knowledge", color: "bg-gray-600" },
                    ].map((skill) => (
                      <FormField
                        key={skill.name}
                        control={evaluationForm.control}
                        name={skill.name as keyof EvaluationInput}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded ${skill.color}`} />
                              {skill.label}: {field.value}/10
                            </FormLabel>
                            <FormControl>
                              <Slider
                                min={1}
                                max={10}
                                step={0.1}
                                value={[field.value || 5]}
                                onValueChange={(value) => field.onChange(value[0])}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  <FormField
                    control={evaluationForm.control}
                    name="feedback"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Feedback (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide detailed feedback and recommendations..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-ms-green text-white hover:bg-green-600"
                    disabled={evaluationMutation.isPending}
                  >
                    {evaluationMutation.isPending ? "Submitting..." : "Submit Evaluation"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
