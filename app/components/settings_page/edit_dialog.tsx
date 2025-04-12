/* eslint-disable */
import { Button } from "@/components/commons/button"
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/project_browser/dialog"
import { Input } from "@/components/commons/input"
import { Label } from "@/components/commons/label"
import { DynamicIcon } from 'lucide-react/dynamic';
import { LogoDialog } from "@/components/settings_page/logo_dialog";
import { ApiService } from "@/api/apiService";

import {
    Pencil,
} from "lucide-react"

interface ProjectData {
    projectName: string;
    projectDescription: string;
    projectMembers: string[];
    ownerId: string;
    createdAt: string;
    updatedAt: string;
    projectLogoUrl: string;
}

interface Props {
    projectData: ProjectData | null
    reload: () => void
}

export function EditDialog( {projectData, reload} : Props) {

    const router = useRouter();
    const [projectName, setProjectName] = useState(projectData?.projectName);
    const [projectDescription, setProjectDescription] = useState(projectData?.projectDescription);
    const [projectLogo, setProjectLogo] = useState(projectData?.projectLogoUrl);
    const apiService = new ApiService();

    const handleSave = async () => {
        
        const projectId = sessionStorage.getItem("projectId");
        const token = sessionStorage.getItem("token");
  
      if (!projectId || !token) {
        router.push("/login");
        return;
      }
  
      try {
        const updatedProject = {
            projectName: projectName,
            projectDescription: projectDescription,
            projectMembers: projectData?.projectMembers,
            ownerId: projectData?.ownerId,
            createdAt: projectData?.createdAt,
            updatedAt: projectData?.updatedAt,
            projectLogoUrl: projectLogo,
        }
        const response = await apiService.put<ProjectData>(`/projects/${projectId}`, updatedProject)
        reload()
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

    };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="min-w-25 w-auto py-3">
            <Pencil/> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit project</DialogTitle>
          <DialogDescription>
            Make changes to your project here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="relative w-fit">
            <DynamicIcon
                className="h-16 w-16 rounded-lg bg-primary p-2 text-white"
                name={(projectLogo?.toLowerCase() || "university") as any}
            />
            <LogoDialog setLogo={setProjectLogo}/>
            </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input 
                id="name" 
                value={projectName} 
                className="col-span-3"
                onChange={(e) => setProjectName(e.target.value)} 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Description
            </Label>
            <Input 
                id="username" 
                value={projectDescription} 
                className="col-span-3" 
                onChange={(e) => setProjectDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="submit" onClick={handleSave}>Save changes</Button>
            </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
