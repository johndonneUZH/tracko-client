/* eslint-disable */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  X, 
  Save, 
  Trash2, 
  Undo2, 
  Pencil 
} from "lucide-react";
import { Idea } from "@/types/idea";
import { Comment } from "@/types/comment";
import { User } from "@/types/user";
import Comments from "./Comments";
import { Textarea } from "@/components/commons/textarea";
import { Input } from "@/components/commons/input";
import { Button } from "@/components/commons/button";
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import {
  Avatar,
  AvatarImage,
} from "@/components/commons/avatar"
import { DialogDescription } from "@radix-ui/react-dialog";

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
  alreadyOpenSub: boolean;
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
  alreadyOpenSub,
}: IdeaModalProps) {
  const [title, setTitle] = useState(idea.ideaName || "");
  const [body, setBody] = useState(idea.ideaDescription || "");
  const [isOpen, setIsOpen] = useState(true);
  const [isOpenSub, setIsOpenSub] = useState(alreadyOpenSub);

  const hasChanges = title !== idea.ideaName || body !== idea.ideaDescription;
  const canEditFr = canEdit || (idea.ownerId === currentUserId)

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleCloseSub = () => {
    setIsOpenSub(false)
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
      <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="border border-gray-300 p-3 rounded-md">
          <div className="flex flex-row gap-2 items-center">
            <Avatar className="h-4 w-4 rounded-sm">
              <AvatarImage
                src={
                  members.find((m) => m.id === idea.ownerId)?.avatarUrl ??
                  "https://avatar.vercel.sh/john"
                }
              />
            </Avatar>
            <strong>{members.find((m) => m.id === idea.ownerId)?.username ?? "Unknown"}</strong>
          </div>
          <p className="text-sm">{idea.ideaDescription}</p>
          {canEditFr && (
          <div className="flex justify-end mt-2 gap-2">
            <Button onClick={onDelete} variant="destructive">
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
            <Dialog open={isOpenSub} onOpenChange={(open) => !open && handleCloseSub()}>
              <DialogTrigger asChild>
                <Button onClick={() => {setIsOpenSub(true)}}>
                  <Pencil className="w-4 h-4" /> Edit
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Edit Idea</DialogTitle>
                  <DialogDescription>
                    Change your idea title or description.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={!canEditFr}
                    className="mt-1 overflow-auto whitespace-nowrap"
                    placeholder="Title"
                  />

                  <Textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    disabled={!canEditFr}
                    className="mt-1 min-h-60"
                    placeholder="Description"
                  />
                </div>

                <DialogFooter className="mt-4">
                  <Button onClick={() => {
                    onSave(title, body)
                    setIsOpenSub(false)
                  }}
                    disabled={!canEditFr}>
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          
          </div>
          )}
        </div>
        <div>
          
          {title.trim() !== "" && body.trim() !== "" && (
          <div>
            <div className="">
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