"use client";

interface ProjectHeaderProps {
  projectId: string;
}

export default function ProjectHeader({ projectId }: ProjectHeaderProps) {
  return (
    <h1
      style={{
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        textAlign: "center",
        marginBottom: "1rem",
        zIndex: 1000,
        background: "#eaf4fc",
        padding: "0.5rem 1rem",
        borderRadius: "8px",
      }}
    >
      Project {projectId}
    </h1>
  );
}
