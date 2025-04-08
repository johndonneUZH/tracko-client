export interface ProjectMember {
  id: string;
  name: string;
  role: string;
}

export type Project = {
  projectId: any;
  projectName: any;
  id: string;
  name: string;
  projectDescription: string;
  projectMembers: ProjectMember[];
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
};
  