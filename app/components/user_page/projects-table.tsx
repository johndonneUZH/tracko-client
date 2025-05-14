import React, { useEffect, useState } from "react";
import { ApiService } from "@/api/apiService"
import { useRouter } from "next/navigation";
import { getComponentFromString } from "@/components/sidebar/iconMappings";
import { Project } from "@/types/project";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/commons/card";

export function ProjectsTable() {
  const apiService = new ApiService();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
  
    if (!storedUserId) {
      router.push("/login");
      return;
    }
  
    setUserId(storedUserId);
  
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await apiService.getProjects<Project[]>(storedUserId);
        setProjects(data);
      } catch (err) {
        setError("Failed to load projects");
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProjects();
  }, [router]);

  if (loading) {
    return (
        <div className="flex flex-col items-start justify-center h-screen pt-10 px-4">
          <div className="flex space-x-2">
            <div className="h-4 w-4 bg-blue-700 rounded-full animate-bounce"></div>
            <div className="h-4 w-4 bg-blue-800 rounded-full animate-bounce delay-200"></div>
            <div className="h-4 w-4 bg-blue-900 rounded-full animate-bounce delay-400"></div>
          </div>
        </div>
      );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded">
        {error}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 text-gray-600 p-4 rounded">
        No projects found
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Projects</h2>
      <div className="relative">
        <div className="flex overflow-x-auto gap-1 pr-6">
          {projects.map((project) => {
            const Icon = getComponentFromString(project.projectLogoUrl || "University");
            const isOwner = project.ownerId === userId;

            return (
              <div
                key={project.projectId}
                className="flex flex-col items-start"
              >
                <div className="flex items-center gap-2 mr-8">
                  <div className="w-12 h-12 rounded-md bg-primary flex items-center justify-center">
                    {Icon && <Icon className="w-6 h-6 text-white" />}
                  </div>

                  <div className="flex flex-col">
                    <div className="text-sm font-semibold text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                      {project.projectName}
                    </div>

                    <div
                      className={`mt-1 text-xs font-medium rounded-full px-2 py-0.5 inline-block self-start
                        ${isOwner ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}
                    >
                      {isOwner ? 'Admin' : 'Contributor'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-white to-transparent" />
      </div>
    </div>
  );
}