import React, { useEffect, useState } from "react";
import { ApiService } from "@/api/apiService"
import { useRouter } from "next/navigation";
import { getComponentFromString } from "@/components/sidebar/iconMappings";
import { Project } from "@/types/project";

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
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icon</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {projects.map((project) => (
            <tr key={project.projectId} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                {(() => {
                    const Icon = getComponentFromString(project.projectLogoUrl || "University");
                    return Icon ? <Icon className="w-5 h-5 text-gray-500" /> : null;
                })()}
              </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {project.projectName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${project.ownerId === userId ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {project.ownerId === userId ? 'Admin' : 'Contributor'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {project.projectMembers.length + 1 || 1}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}