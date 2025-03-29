"use client";

import { useParams, useRouter } from "next/navigation";
import { useCurrentUserId } from "@/lib/dashboard_utils/useCurrentUserId";
import { useIdeaStorage } from "@/lib/dashboard_utils/useIdeaStorage";
import { useComments } from "@/lib/dashboard_utils/useComments";
import { addLogEntry } from "@/lib/dashboard_utils/logHelpers";
import { isIdeaEmpty } from "@/lib/dashboard_utils/ideaHelpers";
import { toggleVoteInIdeas } from "@/lib/dashboard_utils/toggleVote";
import { useStoreLog } from "@/lib/dashboard_utils/useStoreLog";
import ProjectDashboard from "@/components/dashboard_Project/ProjectDashboard";
import NewIdeaButton from "@/components/dashboard_Project/NewIdeaButton";
import ChangeLogSidebar from "@/components/dashboard_Project/ChangeLogSidebar";
import ProjectHeader from "@/components/dashboard_Project/ProjectHeader";
import IdeaModal from "@/components/dashboard_Project/IdeaModal";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id, projectId, ideaId } = useParams();
  const router = useRouter();
  const currentUserId = useCurrentUserId();

  const { logEntries, pushLog } = useStoreLog(projectId as string);

  const {
    ideas,
    setIdeas,
    createIdea,
    saveIdea,
    deleteIdea,
    getSelectedIdea,
    storageKey,
  } = useIdeaStorage(projectId as string, currentUserId);

  const { addComment, deleteComment } = useComments(setIdeas, currentUserId);

  const selectedIdea = getSelectedIdea(ideaId as string);
  const selectedIdeaId = selectedIdea?.id || null;

  const handleCreate = () => {
    const newIdea = createIdea();
    router.push(`/users/${id}/projects/${projectId}/ideas/${newIdea.id}`);
  };

  const handleDelete = (ideaId: number) => {
    const ideaToDelete = ideas.find((i) => i.id === ideaId);
    if (!ideaToDelete) return;

    if (!isIdeaEmpty(ideaToDelete)) {
      const confirmed = window.confirm("This idea will be permanently deleted, proceed?");
      if (!confirmed) return;
    }
    addLogEntry(pushLog, currentUserId, "Deleted idea", ideaToDelete.title, projectId as string);
    deleteIdea(ideaId);
    router.push(`/users/${id}/projects/${projectId}`);
  };

  const handleSave = (id: number, title: string, body: string) => {
    const oldIdea = ideas.find((i) => i.id === id);
    const oldTitle = oldIdea?.title || "";

    saveIdea(id, title, body);

    const action = oldTitle.trim() === "" ? "Created idea" : "Edited idea";
    addLogEntry(pushLog, currentUserId, action, title || oldTitle, projectId as string);

  };

  const handleCancel = (idea: typeof selectedIdea) => {
    if (idea && isIdeaEmpty(idea)) {
      deleteIdea(idea.id);
    }
    router.push(`/users/${id}/projects/${projectId}`);
  };

  const toggleVote = (ideaId: number, userId: number, type: "up" | "down") => {
    setIdeas((prev) => toggleVoteInIdeas(prev, ideaId, userId, type));
  };

  return (
    <>
      <div
        style={{
          height: "100vh",
          padding: "2rem",
          background: "#eaf4fc",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <ProjectHeader projectId={projectId as string} />
        <ChangeLogSidebar logEntries={logEntries} />
        <div
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            alignItems: "stretch",
            gap: "2rem",
          }}
        >
          <ProjectDashboard
            ideas={ideas}
            setIdeas={setIdeas}
            selectedIdeaId={selectedIdeaId}
            onIdeaClick={(ideaId) =>
              router.push(`/users/${id}/projects/${projectId}/ideas/${ideaId}`)
            }
            onToggleVote={toggleVote} 
            storageKey={storageKey}
          />
          {children}
        </div>
        <NewIdeaButton onClick={handleCreate} />
      </div>

      {selectedIdea && (
        <IdeaModal
          idea={selectedIdea}
          canEdit={selectedIdea.creatorId === currentUserId}
          onSave={(title, body) => {
            handleSave(selectedIdea.id, title, body);
            router.push(`/users/${id}/projects/${projectId}/ideas/${selectedIdea.id}`);
          }}
          onDelete={() => handleDelete(selectedIdea.id)}
          onCancel={() => handleCancel(selectedIdea)}
          currentUserId={currentUserId}
          onAddComment={(content, parentId) => addComment(selectedIdea.id, content, parentId)}
          onDeleteComment={(commentId) => deleteComment(selectedIdea.id, commentId)}
          onLogComment={(action, title) =>
            addLogEntry(pushLog, currentUserId, action, title, projectId as string)
          }
        />
      )}
    </>
  );
}
