"use client";

import React, { useState } from "react";
import { Comment } from "@/types/comment";

interface CommentWithChildren extends Comment {
  children: CommentWithChildren[];
}

interface CommentsProps {
  comments: CommentWithChildren[];
  currentUserId: string;
  onAddComment: (content: string, parentId?: string) => void;
  onDeleteComment: (commentId: string) => void;
}

export default function Comments({
  comments,
  currentUserId,
  onAddComment,
  onDeleteComment,
}: CommentsProps) {
  const [replyTargetId, setReplyTargetId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  function handleSubmitReply() {
    if (!replyContent.trim()) return;
    onAddComment(replyContent, replyTargetId || undefined);
    setReplyContent("");
    setReplyTargetId(null);
  }

  function renderCommentList(commentList: CommentWithChildren[]): React.ReactNode[] {
    return commentList.map((comment) => (
      <div key={comment.commentId} style={{ marginLeft: "1rem", marginTop: "1rem" }}>
        <div style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
          <p>
            <strong>User {comment.ownerId}</strong>: {comment.commentText}
          </p>
  
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => {
                setReplyTargetId(comment.commentId);
                setReplyContent("");
              }}
              style={{
                background: "#1677ff",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "0.25rem 0.5rem",
                cursor: "pointer",
              }}
            >
              Reply
            </button>
  
            {comment.ownerId === currentUserId && (
              <button
                onClick={() => onDeleteComment(comment.commentId)}
                style={{
                  background: "#ff4d4f",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "0.25rem 0.5rem",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            )}
          </div>
        </div>
  
        {comment.children && comment.children.length > 0 && (
          <div style={{ marginLeft: "1rem" }}>
            {renderCommentList(comment.children)}
          </div>
        )}
      </div>
    ));
  }
  
  return (
    <div style={{ marginTop: "1rem" }}>
      <h3>Comments</h3>
      {renderCommentList(comments)}

      <hr />
      <div>
        <label>
          {replyTargetId ? `Reply to comment` : "Add new comment"}:
        </label>
        <textarea
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          style={{ width: "100%", height: "60px" }}
        />
        <div style={{ textAlign: "right", marginTop: "0.5rem" }}>
          <button
            onClick={handleSubmitReply}
            style={{
              background: "#1677ff",
              color: "#fff",
              border: "none",
              padding: "0.25rem 0.5rem",
              cursor: "pointer",
              marginRight: "0.5rem",
            }}
          >
            {replyTargetId ? "Add Reply" : "Add Comment"}
          </button>
          {replyTargetId && (
            <button
              onClick={() => {
                setReplyTargetId(null);
                setReplyContent("");
              }}
              style={{
                background: "#ccc",
                border: "none",
                padding: "0.25rem 0.5rem",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}