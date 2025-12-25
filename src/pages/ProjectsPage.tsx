import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DueDatePicker } from "@/components/custom/due-date";
import { projects, colors, statusColors, type Project } from "@/data/projects";
import { gsap } from "gsap";

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [projectsState, setProjectsState] = useState(projects);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "active" as const,
    dueDate: "",
    color: colors[0],
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredProjects = projectsState.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddProject = () => {
    if (!newProject.name || !newProject.description || !newProject.dueDate) {
      toast.error("Please fill in all fields");
      return;
    }

    const project: Project = {
      id: String(projectsState.length + 1),
      name: newProject.name,
      description: newProject.description,
      status: newProject.status,
      progress: 0,
      team: 0,
      dueDate: newProject.dueDate,
      color: newProject.color,
    };

    setProjectsState([...projectsState, project]);
    setNewProject({
      name: "",
      description: "",
      status: "active",
      dueDate: "",
      color: colors[0],
    });
    setIsDialogOpen(false);
  };

  // Initial page load animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header blur-from-top animation
      gsap.fromTo(
        headerRef.current,
        {
          y: -20,
          opacity: 0,
          filter: "blur(20px)",
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
        }
      );

      // Search bar animation
      gsap.fromTo(
        searchRef.current,
        {
          y: -10,
          opacity: 0,
          filter: "blur(15px)",
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.8,
          delay: 0.3,
          ease: "power3.out",
        }
      );

      // Stagger project cards
      gsap.fromTo(
        ".project-card",
        {
          y: -50,
          opacity: 0,
          filter: "blur(12px)",
          scale: 0.95,
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          delay: 0.6,
          ease: "power3.out",
        }
      );

      // Animate progress bars
      gsap.fromTo(
        ".progress-fill",
        {
          scaleX: 0,
          transformOrigin: "left",
        },
        {
          scaleX: 1,
          duration: 1.2,
          delay: 1,
          ease: "power2.out",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Dialog animation
  useEffect(() => {
    if (isDialogOpen) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".dialog-wrapper",
          {
            scale: 0.9,
            opacity: 0,
            y: -20,
          },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "back.out(1.7)",
          }
        );

        gsap.fromTo(
          ".dialog-field",
          {
            x: -20,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.08,
            delay: 0.2,
            ease: "power2.out",
          }
        );
      });

      return () => ctx.revert();
    }
  }, []);

  // Filter animation
  useEffect(() => {
    if (gridRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".project-card",
          {
            scale: 0.95,
            opacity: 0,
            filter: "blur(8px)",
          },
          {
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.4,
            stagger: 0.06,
            ease: "power2.out",
          }
        );
      }, gridRef);

      return () => ctx.revert();
    }
  }, []);

  // Interactive hover animations
  useEffect(() => {
    const projectCards = document.querySelectorAll(".project-card");
    projectCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          y: -2,
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          duration: 0.4,
          ease: "power2.out",
        });

        const colorDot = card.querySelector(".color-dot");
        gsap.to(colorDot, {
          scale: 1.3,
          duration: 0.3,
          ease: "back.out(1.7)",
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          duration: 0.4,
          ease: "power2.out",
        });

        const colorDot = card.querySelector(".color-dot");
        gsap.to(colorDot, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });

    // Search input focus
    const searchInput = document.querySelector(".search-input");
    if (searchInput) {
      searchInput.addEventListener("focus", () => {
        gsap.to(searchInput, {
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          duration: 0.3,
          ease: "power2.out",
        });
      });

      searchInput.addEventListener("blur", () => {
        gsap.to(searchInput, {
          scale: 1,
          boxShadow: "0 0 0 rgba(0,0,0,0)",
          duration: 0.3,
          ease: "power2.out",
        });
      });
    }

    // Color picker hover
    const colorButtons = document.querySelectorAll(".color-picker-btn");
    colorButtons.forEach((btn) => {
      btn.addEventListener("mouseenter", () => {
        gsap.to(btn, {
          scale: 1.2,
          duration: 0.3,
          ease: "back.out(1.7)",
        });
      });

      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });
  }, [filteredProjects, isDialogOpen]);

  return (
    <div ref={containerRef} className="space-y-6 p-4">
      <div ref={headerRef} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your projects
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="dialog-wrapper">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Add a new project to your workspace
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="dialog-field">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  placeholder="Enter project name"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div className="dialog-field">
                <Label htmlFor="project-description">Description</Label>
                <Input
                  id="project-description"
                  placeholder="Enter project description"
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div className="w-full dialog-field">
                <Label htmlFor="project-status">Status</Label>
                <Select
                  value={newProject.status}
                  onValueChange={(value) =>
                    setNewProject({ ...newProject, status: value as typeof newProject.status })
                  }
                >
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="dialog-field">
                <Label htmlFor="project-duedate">Due Date</Label>
                <DueDatePicker
                  dueDate={newProject.dueDate}
                  setDueDate={(date) =>
                    setNewProject({ ...newProject, dueDate: date })
                  }
                />
              </div>
              <div className="dialog-field">
                <Label>Color</Label>
                <div className="flex gap-2 mt-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`color-picker-btn w-8 h-8 rounded-full ${color} ${newProject.color === color ? "ring-2 ring-offset-2 ring-foreground" : ""}`}
                      onClick={() => setNewProject({ ...newProject, color })}
                    />
                  ))}
                </div>
              </div>
              <Button onClick={handleAddProject} className="w-full dialog-field">
                Create Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div ref={searchRef} className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 search-input"
          />
        </div>
      </div>

      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((project) => (
          <Link key={project.id} to={`/projects/${project.id}`}>
            <Card className="project-card hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={`color-dot w-3 h-3 rounded-full ${project.color}`}
                      />
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                    </div>
                    <CardDescription className="mt-1">
                      {project.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className={`progress-fill h-2 rounded-full ${project.color}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={statusColors[project.status]}>
                      {project.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {project.team} members
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Due: {new Date(project.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
