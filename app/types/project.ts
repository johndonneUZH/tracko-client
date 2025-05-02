export interface ProjectMember {
  id: string;
  name: string;
  role: string;
}

export type Project = {
  projectId: string;
  projectName: string;
  projectDescription: string;
  projectMembers: string[];
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  projectLogoUrl: string;
};