/* eslint-disable */
"use client";

import React, { useState, useMemo } from "react";
import { X, Save, Trash2, Undo2 } from "lucide-react";
import { Idea } from "@/types/idea";
import { Comment } from "@/types/comment";
import Comments from "./Comments";
import { Textarea } from "@/components/commons/textarea";
import { Input } from "@/components/commons/input";
import { Button } from "@/components/commons/button";
import { Card, CardContent } from "@/components/commons/card";
import { User } from '@/types/user';

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
  members: User[];
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
  members,
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
      className="fixed top-0 left-0 w-full h-full bg-black/50 z-[10000] flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <Card
        className="relative w-[400px] max-h-[80%] overflow-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={!canEdit}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={!canEdit}
              className="mt-1 h-32"
            />
          </div>

          <div className="flex justify-end gap-2 mt-2 flex-wrap">
            {canEdit ? (
              hasChanges ? (
                <>
                  <Button onClick={() => onSave(title, body)} variant="default">
                    <Save className="w-4 h-4" />
                    Save
                  </Button>
                  <Button onClick={handleDiscardChanges} variant="secondary">
                    <Undo2 className="w-4 h-4" />
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={onDelete} variant="destructive">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </>
              )
            ) : (
              <Button onClick={onCancel} variant="secondary">
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
            )}
          </div>

          {title.trim() !== "" && body.trim() !== "" && (
            <div className="mt-4">
              <hr className="mb-4" />
              <Comments
                comments={commentTree}
                currentUserId={currentUserId}
                onAddComment={(content, parentId) => {
                  onAddComment(content, parentId);
                  onLogComment?.("Added comment", title);
                }}
                onDeleteComment={onDeleteComment}
                members={members}
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}