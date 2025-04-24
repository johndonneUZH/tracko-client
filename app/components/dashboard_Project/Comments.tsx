"use client";

import React, { useState } from "react";
import { Comment } from "@/types/comment";
import { Button } from "@/components/commons/button";
import { Textarea } from "@/components/commons/textarea";
import { MessageSquarePlus, Reply, Trash2, X } from "lucide-react";
import { User } from "@/types/user";

import {
  Avatar,
  AvatarImage,
} from "@/components/commons/avatar"

interface CommentWithChildren extends Comment {
  children: CommentWithChildren[];
}

interface CommentsProps {
  comments: CommentWithChildren[];
  currentUserId: string;
  onAddComment: (content: string, parentId?: string) => void;
  onDeleteComment: (commentId: string) => void;
  members: User[],
}

export default function Comments({
  comments,
  currentUserId,
  onAddComment,
  onDeleteComment,
  members,
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
      <div key={comment.commentId} className="ml-4 mt-4">
        <div className="border border-gray-300 p-3 rounded-md">
          <div className="flex flex-row gap-2 items-center">
            <Avatar className="h-4 w-4 rounded-sm">
              <AvatarImage src={members.find((m) => m.id === comment.ownerId)?.avatarUrl ?? "https://avatar.vercel.sh/john"} />
            </Avatar>
            <strong>{members.find((m) => m.id === comment.ownerId)?.username ?? "Unknown"}</strong>
          </div>
          <p> 
            {comment.commentText}
          </p>

          <div className="flex gap-2 mt-2">
            <Button
              size="sm"
              onClick={() => {
                setReplyTargetId(comment.commentId);
                setReplyContent("");
              }}
            >
              <Reply className="w-4 h-4" />
              Reply
            </Button>

            {comment.ownerId === currentUserId && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDeleteComment(comment.commentId)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            )}
          </div>
        </div>

        {comment.children && comment.children.length > 0 && (
          <div className="ml-4">
            {renderCommentList(comment.children)}
          </div>
        )}
      </div>
    ));
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Comments</h3>
      {renderCommentList(comments)}

      <hr className="my-4" />
      <div>
        <label className="text-sm font-medium block mb-1">
          {replyTargetId ? `Reply to comment:` : "Add new comment:"}
        </label>
        <Textarea
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          className="h-20"
        />
        <div className="flex justify-end gap-2 mt-2 flex-wrap">
          <Button onClick={handleSubmitReply}>
            {replyTargetId ? (
              <>
                <Reply className="w-4 h-4" />
                Add Reply
              </>
            ) : (
              <>
                <MessageSquarePlus className="w-4 h-4" />
                Add Comment
              </>
            )}
          </Button>
          {replyTargetId && (
            <Button
              variant="secondary"
              onClick={() => {
                setReplyTargetId(null);
                setReplyContent("");
              }}
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}