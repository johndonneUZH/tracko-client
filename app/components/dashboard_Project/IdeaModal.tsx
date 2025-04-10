"use client";

import React, { useState, useMemo } from "react";
import { Idea } from "@/types/idea";
import { Comment } from "@/types/comment";
import Comments from "./Comments";

interface CommentWithChildren extends Comment {
  children: CommentWithChildren[];
}

interface IdeaModalProps {
  idea: Idea;
  canEdit: boolean;
  onSave: (title: string, body: string) => void;
  onDelete: () => void;
  onCancel: () => void;
  currentUserId: string;
  onAddComment: (content: string, parentId?: string) => void;
  onDeleteComment: (commentId: string) => void;
  onLogComment?: (action: string, title: string) => void;
  commentMap: Record<string, Comment>;
}

export default function IdeaModal({
  idea,
  canEdit,
  onSave,
  onDelete,
  onCancel,
  currentUserId,
  onAddComment,
  onDeleteComment,
  onLogComment,
  commentMap,
}: IdeaModalProps) {
  const [title, setTitle] = useState(idea.ideaName || "");
  const [body, setBody] = useState(idea.ideaDescription || "");
  const hasChanges = title !== idea.ideaName || body !== idea.ideaDescription;

  const handleDiscardChanges = () => {
    setTitle(idea.ideaName);
    setBody(idea.ideaDescription);
  };

  const pastelColors = [
    "#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9",
    "#BAE1FF", "#E6E6FA", "#FADADD", "#D1C4E9",
  ];
  const modalBackground = pastelColors[parseInt(idea.ideaId, 16) % pastelColors.length];

  // ✅ Comentarios con árbol (sin romper estructura original)
  const buildCommentTree = (rootIds: string[]): CommentWithChildren[] => {
    return rootIds
      .map((id) => {
        const comment = commentMap[id];
        if (!comment) return null;
        return {
          ...comment,
          children: buildCommentTree(comment.replies || []),
        };
      })
      .filter(Boolean) as CommentWithChildren[];
  };

  const commentTree = useMemo(() => buildCommentTree(idea.comments || []), [idea.comments, commentMap]);

  return (
    <div
      className="idea-modal"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        style={{
          background: modalBackground,
          padding: "2rem",
          borderRadius: "8px",
          width: "400px",
          maxHeight: "80%",
          overflow: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <label>Title:</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={!canEdit}
          style={{ width: "100%", marginBottom: "1rem" }}
        />

        <label>Body:</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={!canEdit}
          style={{ width: "100%", height: "120px" }}
        />

        <div style={{ marginTop: "1rem", textAlign: "right" }}>
          {canEdit ? (
            hasChanges ? (
              <>
                <button
                  onClick={() => onSave(title, body)}
                  style={{
                    marginRight: "0.5rem",
                    background: "#1677ff",
                    color: "#fff",
                    border: "none",
                    padding: "0.5rem 1rem",
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
                <button
                  onClick={handleDiscardChanges}
                  style={{
                    marginRight: "0.5rem",
                    background: "#ccc",
                    border: "none",
                    padding: "0.5rem 1rem",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onDelete}
                  style={{
                    marginRight: "0.5rem",
                    background: "#ff4d4f",
                    color: "#fff",
                    border: "none",
                    padding: "0.5rem 1rem",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
                <button
                  onClick={onCancel}
                  style={{
                    background: "#ccc",
                    border: "none",
                    padding: "0.5rem 1rem",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </>
            )
          ) : (
            <button
              onClick={onCancel}
              style={{
                background: "#ccc",
                border: "none",
                padding: "0.5rem 1rem",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          )}
        </div>

        {title.trim() !== "" && body.trim() !== "" && (
          <>
            <hr style={{ margin: "1rem 0" }} />
            <Comments
              comments={commentTree}
              currentUserId={currentUserId}
              onAddComment={(content, parentId) => {
                onAddComment(content, parentId);
                onLogComment?.("Added comment", title);
              }}
              onDeleteComment={onDeleteComment}
            />
          </>
        )}
      </div>
    </div>
  );
}