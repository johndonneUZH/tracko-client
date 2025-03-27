"use client";

// for backend will be necesay to save the x and y cordinates of the ideas if we want them to be moved freely

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import IdeaModal, { Idea } from "./IdeaModal"; 
import { Comment } from "./comments"; 
import ChangeLog, {LogEntry} from "./ChangeLog";
import { useCurrentUserId } from "./useCurrentUserId";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id, projectId, ideaId } = useParams();
  const router = useRouter();
  const currentUserId = useCurrentUserId();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [nextId, setNextId] = useState(1);

  // list of the ideas for the project
  const storageKey = `ideas-${projectId}`;
  //log entries state
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  // Change when the backend is ready
  //////////////////////////////////////
  //Log
  
  function addLogEntry(action: string, ideaTitle: string) {
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString(); 

    const newEntry: LogEntry = {
      id: currentUserId,
      date: dateStr,
      time: timeStr,
      action: action,
      ideaTitle: ideaTitle || "Untitled",
    };

    setLogEntries((prev) => [...prev, newEntry]);
  }
  //////////////////////////////////////////////////////////////////
  // Load saved ideas
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed: Idea[] = JSON.parse(saved);
      setIdeas(parsed);
      setNextId(
        parsed.length > 0 ? Math.max(...parsed.map((i) => i.id)) + 1 : 1
      );
    }
  }, [storageKey]);

  // Save on change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(ideas));
  }, [ideas, storageKey]);

  // If you want the outside-click close, uncomment this block:
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     const target = event.target as HTMLElement;
  //     const isInsideIdea = target.closest('.idea-box, .idea-modal');
  //     if (!isInsideIdea) {
  //       router.push(`/users/${id}/projects/${projectId}`);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [id, projectId, router]);

  /////////////////////////////////////////////////////////////////////////
  // Creates an idea
  const createIdea = () => {
    const newId = nextId;

    const newIdea: Idea = {
      id: newId,
      title: "",
      body: "",
      x: 100 + nextId * 15,
      y: 100 + nextId * 15,
      creatorId: currentUserId,
      comments: [], // IMPORTANT: initialize comments array
    };

    setIdeas((prev) => [...prev, newIdea]);
    setNextId((prev) => prev + 1);
    // log creation
    addLogEntry("Created idea", newIdea.title);

    // changes url without changing page
    router.push(`/users/${id}/projects/${projectId}/ideas/${nextId}`);
  };

  // deletes an idea
  const deleteIdea = (ideaId: number) => {
  // Find the idea in state
    const ideaToDelete = ideas.find((idea) => idea.id === ideaId);
    if (!ideaToDelete) {
      router.push(`/users/${id}/projects/${projectId}`);
      return;
    }

    // Check if the idea is empty
    const isEmpty =
      ideaToDelete.title.trim() === "" && ideaToDelete.body.trim() === "";

    // If it's NOT empty, confirm before deleting
    if (!isEmpty) {
      const confirmed = window.confirm(
        "This idea will be permanently deleted, proceed?"
      );
      if (!confirmed) return;
  }
    // log deletion
    addLogEntry("Deleted idea", ideaToDelete.title);
    // If empty or confirmed, delete immediately
    setIdeas((prev) => prev.filter((idea) => idea.id !== ideaId));
    router.push(`/users/${id}/projects/${projectId}`);
  };
  // Saves idea
  const saveIdea = (id: number, newTitle: string, newBody: string) => {
    const oldIdea = ideas.find((i) => i.id === id);
    const oldTitle = oldIdea?.title || "";

    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === id
          ? { ...idea, title: newTitle, body: newBody }
          : idea
      )
    );

    // log editing
    addLogEntry("Edited idea", newTitle || oldTitle);
  };

  /////////////////////////////////////////////////////////////////////////
  // COMMENTS LOGIC
  // This will allow adding and deleting comments in the ideas
  /////////////////////////////////////////////////////////////////////////

  /**
   * Adds a comment or reply to the specified idea.
   * If parentId is not provided, it's a root-level comment.
   */
  const addComment = (ideaId: number, content: string, parentId?: number) => {

    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id !== ideaId) return idea;

        const newComment: Comment = {
          id: Date.now(),
          authorId: currentUserId,
          content,
          replies: [],
        };

        if (!parentId) {
          // root comment
          return {
            ...idea,
            comments: [...idea.comments, newComment],
          };
        } else {
          // reply to an existing comment
          return {
            ...idea,
            comments: addReplyRecursive(idea.comments, parentId, newComment),
          };
        }
      })
    );
  };

  /**
   * Recursively inserts a newComment into the replies of the comment with parentId
   */
  const addReplyRecursive = (
    commentList: Comment[],
    parentId: number,
    newComment: Comment
  ): Comment[] => {
    return commentList.map((c) => {
      if (c.id === parentId) {
        return { ...c, replies: [...c.replies, newComment] };
      } else {
        return {
          ...c,
          replies: addReplyRecursive(c.replies, parentId, newComment),
        };
      }
    });
  };

  /**
   * Deletes a comment from the specified idea if the currentUser is the author
   */
  const deleteComment = (ideaId: number, commentId: number) => {

    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id !== ideaId) return idea;
        return {
          ...idea,
          comments: deleteCommentRecursive(
            idea.comments,
            commentId,
            currentUserId
          ),
        };
      })
    );
  };

  /**
   * Recursively searches and deletes the comment that matches commentId
   * only if authorId == currentUserId
   */
  const deleteCommentRecursive = (
    commentList: Comment[],
    commentId: number,
    userId: number
  ): Comment[] => {
    return commentList
      .map((c) => {
        if (c.id === commentId && c.authorId === userId) {
          // remove this comment
          return null;
        }
        // otherwise, keep it and recurse in replies
        return {
          ...c,
          replies: deleteCommentRecursive(c.replies, commentId, userId),
        };
      })
      .filter(Boolean) as Comment[];
  };

  //////////////////////////////////////////////////////////////////
  // Convert ideaId to number
  const selectedIdeaId = parseInt(ideaId as string);
  const selectedIdea = ideas.find((idea) => idea.id === selectedIdeaId);

  // Render the modal if there's a selected idea
  let modal = null;


  if (selectedIdea) {
    const canEdit = selectedIdea.creatorId === currentUserId;

    modal = (
      <IdeaModal
        idea={selectedIdea}
        canEdit={canEdit}
        onSave={(title, body) => {
          saveIdea(selectedIdea.id, title, body);
          router.push(
            `/users/${id}/projects/${projectId}/ideas/${selectedIdeaId}`
          );
        }}
        onDelete={() => {
          deleteIdea(selectedIdea.id);
        }}
        onCancel={() => {
          // If the user never filled anything (title/body) => remove it from state
          if (
            selectedIdea.title.trim() === "" &&
            selectedIdea.body.trim() === ""
          ) {
            deleteIdea(selectedIdea.id);

          }
          router.push(`/users/${id}/projects/${projectId}`);
        }}

        // pass the currentUserId and the comment handlers to the modal
        currentUserId={currentUserId}
        onAddComment={(content, parentId) => {
          addComment(selectedIdea.id, content, parentId);
        }}
        onDeleteComment={(commentId) => {
          deleteComment(selectedIdea.id, commentId);
        }}
      />
    );
  }

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
        <h1
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            marginBottom: "1rem",
            zIndex: 1000,
            background: "#eaf4fc", // opcional, para que no se mezcle con el fondo
            padding: "0.5rem 1rem",
            borderRadius: "8px",
          }}
        >
          Project {projectId}
        </h1>
        
        <div
          style={{
            width: "16%",
            height: "45vh",      
            position: "fixed",
            top: "20px",           
            right: "20px",        
            background: "#f1f1f1",
            borderLeft: "2px dashed #ccc",
            overflow: "auto",
            borderRadius: "8px",   
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)", 
            zIndex: 1000,
          }}
        >
          <ChangeLog logEntries={logEntries} />
        </div>

        {/* main board*/}
        <div
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            alignItems: "stretch",
            gap: "2rem",
          }}
        >
          {/* Board view (66%) */}
          <div
            style={{
              width: "66%",
              background: "#fff",
              border: "2px dashed #ccc",
              position: "relative",
              overflow: "auto",
            }}
          >
            <div
              style={{
                width: "1220px",
                height: "800px",
                position: "relative",
              }}
            >


              {/* ideas no buttons */}
              {ideas.map((idea) => (
                <div
                  key={idea.id}
                  className="idea-box"
                  draggable
                  onDragEnd={(e) => {
                    const board =
                      e.currentTarget.parentElement?.getBoundingClientRect();
                    if (!board) return;

                    const ideaWidth = 200;
                    const ideaHeight = 120;

                    let newX = e.clientX - board.left;
                    let newY = e.clientY - board.top;

                    newX = Math.max(
                      0,
                      Math.min(newX, board.width - ideaWidth)
                    );
                    newY = Math.max(
                      0,
                      Math.min(newY, board.height - ideaHeight)
                    );

                    setIdeas((prev) =>
                      prev.map((i) =>
                        i.id === idea.id
                          ? { ...i, x: newX, y: newY }
                          : i
                      )
                    );
                  }}
                  onClick={() =>
                    router.push(
                      `/users/${id}/projects/${projectId}/ideas/${idea.id}`
                    )
                  }
                  style={{
                    position: "absolute",
                    left: idea.x,
                    top: idea.y,
                    width: "200px",
                    height: "120px",
                    border:
                      idea.id === selectedIdeaId
                        ? "2px solid #1677ff"
                        : "1px solid #ccc",
                    boxShadow:
                      idea.id === selectedIdeaId
                        ? "0 0 0 2px #91caff"
                        : "none",
                    background: "#fff",
                    cursor: "pointer",
                    overflow: "hidden",
                    padding: "1rem",
                  }}
                >
                  <strong>{idea.title || "Untitled Idea"}</strong>
                </div>
              ))}

              {children}
            </div>
          </div>
        </div>

        {/* new idea*/}
        <button
          onClick={createIdea}
          style={{
            position: "fixed",
            left: "1rem",
            top: "10%",
            transform: "translate(100px,-50%)",
            zIndex: 1000,
            padding: "0.5rem 1rem",
            backgroundColor: "#1677ff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add Idea +
        </button>
      </div>

      {/* modal*/}
      {modal}
    </>
  );
}
