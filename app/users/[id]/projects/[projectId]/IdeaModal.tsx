"use client";

import React, { useState } from "react";
import Comments, { Comment } from "./comments";

export interface Idea {
  id: number;
  title: string;
  body: string;
  x: number;
  y: number;
  creatorId: number;
  comments: Comment[];
}

interface IdeaModalProps {
  idea: Idea;
  canEdit: boolean;
  onSave: (title: string, body: string) => void;
  onDelete: () => void;
  onCancel: () => void;
  currentUserId: number;
  onAddComment: (content: string, parentId?: number) => void;
  onDeleteComment: (commentId: number) => void;
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
}: IdeaModalProps) {
  const [title, setTitle] = useState(idea.title);
  const [body, setBody] = useState(idea.body);
  // detects changes on content
  const hasChanges = title !== idea.title || body !== idea.body;
  const handleDiscardChanges = () => {
    setTitle(idea.title);
    setBody(idea.body);
  };
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
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "8px",
          width: "400px",
          maxHeight: "80%",
          overflow: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Idea {idea.id}</h2>

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

        {/* Save / Cancel / Delete */}
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

        {/* Comments section */}
        {idea.title.trim() !== "" && idea.body.trim() !== "" && (
          <>
            <hr style={{ margin: "1rem 0" }} />
            <Comments
              comments={idea.comments}
              currentUserId={currentUserId}
              onAddComment={onAddComment}
              onDeleteComment={onDeleteComment}
            />
          </>
        )}
      </div>
    </div>
  );
}