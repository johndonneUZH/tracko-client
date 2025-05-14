/* eslint-disable */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { X, Save, Trash2, Undo2 } from "lucide-react";
import { Idea } from "@/types/idea";
import { Comment } from "@/types/comment";
import { User } from "@/types/user";
import Comments from "./Comments";
import { Textarea } from "@/components/commons/textarea";
import { Input } from "@/components/commons/input";
import { Button } from "@/components/commons/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

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
  const [isOpen, setIsOpen] = useState(true);

  const hasChanges = title !== idea.ideaName || body !== idea.ideaDescription;

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) {
      const timeout = setTimeout(() => {
        onCancel();
      }, 300); // Match with dialog close transition
      return () => clearTimeout(timeout);
    }
  }, [isOpen, onCancel]);

  const buildCommentTree = (rootIds: string[]): CommentWithChildren[] => {
    return rootIds
      .map((id) => {
        const comment = commentMap[id];
        if (!comment) return null;
        return {
          ...comment,
          key: `${comment.commentId}-${comment.ownerId || Date.now()}`,
          children: buildCommentTree(comment.replies || []),
        };
      })
      .filter(Boolean) as CommentWithChildren[];
  };

  const commentTree = useMemo(() => buildCommentTree(idea.comments || []), [idea.comments, commentMap]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogTitle>
        <VisuallyHidden>Edit Idea</VisuallyHidden>
      </DialogTitle>
      <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-[500px]">
        <div className="space-y-4 mt-2">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={!canEdit}
              className="mt-1 overflow-x-auto whitespace-nowrap resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={!canEdit}
              className="mt-1 h-20 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 mt-2 flex-wrap">
            {canEdit ? (
              hasChanges ? (
                <>
                  <Button onClick={() => onSave(title, body)}>
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setTitle(idea.ideaName);
                      setBody(idea.ideaDescription);
                    }}
                    variant="secondary"
                  >
                    <Undo2 className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={onDelete} variant="destructive">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              )
            ) : (
              <Button onClick={handleClose} variant="secondary">
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
            )}
          </div>
          
          {title.trim() !== "" && body.trim() !== "" && (
          <div>
            <div className="mt-4">
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
          </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}