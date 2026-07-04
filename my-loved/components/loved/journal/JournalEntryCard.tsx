"use client";

import React, { useState } from "react";
import { Trash2, MessageCircle, Send } from "lucide-react";
import { JournalEntry } from "@/components/loved/core/types";

interface JournalEntryCardProps {
  entry: JournalEntry;
  currentUserCode: "A" | "B";
  currentUserName: string;
  partnerName: string;
  currentUserAvatar?: string;
  isOwnEntry: boolean;
  isTodayEntry: boolean;
  formattedDate: string;
  onRemoveEntry: (entryId: string) => void;
  onRemoveComment: (entryId: string, commentId: string) => void;
  onEditComment: (entryId: string, commentId: string, content: string) => void;
  onAddComment: (entryId: string, content: string) => void;
}

export default function JournalEntryCard({
  entry,
  currentUserCode,
  currentUserName,
  partnerName,
  currentUserAvatar,
  isOwnEntry,
  isTodayEntry,
  formattedDate,
  onRemoveEntry,
  onRemoveComment,
  onEditComment,
  onAddComment
}: JournalEntryCardProps) {
  const [commentText, setCommentText] = useState("");

  const handlePostComment = () => {
    if (!commentText.trim()) return;
    onAddComment(entry.id, commentText.trim());
    setCommentText("");
  };

  const isCommentToday = (createdAtStr: string) => {
    try {
      const commentDate = new Date(createdAtStr);
      const today = new Date();
      return commentDate.toDateString() === today.toDateString();
    } catch {
      return false;
    }
  };

  const CommentItem = ({ comment }: { comment: any }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.content);

    const handleSaveEdit = () => {
      if (!editText.trim()) return;
      onEditComment(entry.id, comment.id, editText.trim());
      setIsEditing(false);
    };

    const isOwnComment = comment.author === currentUserCode;
    const canModify = isOwnComment && isCommentToday(comment.createdAt);

    return (
      <div className="bg-white/40 dark:bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-200/10 text-xs flex justify-between gap-2 shrink-0 w-full">
        {isEditing ? (
          <div className="flex flex-col gap-2 w-full">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full text-xs p-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 outline-none text-zinc-900 dark:text-white"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setIsEditing(false)}
                className="px-2.5 py-1 rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-2.5 py-1 rounded bg-pink-500 hover:bg-pink-600 text-white font-semibold cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-start w-full gap-2">
            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
              <span className="font-bold text-zinc-700 dark:text-zinc-300">
                {comment.author === currentUserCode ? currentUserName : partnerName}
              </span>
              <p className="text-zinc-600 dark:text-zinc-300 break-words">{comment.content}</p>
            </div>
            
            {canModify && (
              <div className="flex gap-1.5 shrink-0 items-center">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-zinc-450 hover:text-rose-500 transition-colors p-1 cursor-pointer text-[10px] font-bold"
                  title="Edit Comment"
                >
                  Edit
                </button>
                <button
                  onClick={() => onRemoveComment(entry.id, comment.id)}
                  className="text-zinc-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                  title="Delete Comment"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (isOwnEntry) {
    if (isTodayEntry) {
      // Today's entry (My Feelings)
      return (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500/10 to-pink-500/10 border border-rose-200/30 dark:border-rose-900/30 flex flex-col gap-2 relative shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold">
                {entry.emotion}
              </span>
              <span className="text-[10px] text-zinc-400 font-medium">Today</span>
            </div>
            <button
              onClick={() => onRemoveEntry(entry.id)}
              className="text-zinc-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
              title="Delete Entry"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-zinc-800 dark:text-zinc-200 font-medium py-1">
            &ldquo;{entry.content}&rdquo;
          </p>

          {/* Partner Comments Section */}
          <div className="mt-2 border-t border-zinc-200/20 pt-2 flex flex-col gap-2">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              <span>Comments from {partnerName}</span>
            </span>

            {entry.comments.length === 0 ? (
              <p className="text-xs text-zinc-400 italic">
                No comments yet. Switch to {partnerName} to leave a comment!
              </p>
            ) : (
              <div className="flex flex-col gap-1.5 max-h-[100px] pr-1">
                {entry.comments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
              </div>
            )}
          </div>
        </div>
      );
    } else {
      // Past entry (My Feelings) - ONLY yesterday is displayed here
      return (
        <div className="p-3.5 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-200/20 flex flex-col gap-2 relative shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-200/50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold">
                {entry.emotion}
              </span>
              <span className="text-[10px] text-zinc-400">{formattedDate}</span>
            </div>
            {/* Delete button hidden for yesterday's feelings */}
          </div>
          <p className="text-zinc-700 dark:text-zinc-300 text-xs italic">
            &ldquo;{entry.content}&rdquo;
          </p>

          {/* Comments list */}
          {entry.comments.length > 0 && (
            <div className="mt-1 border-t border-zinc-200/10 pt-1.5 flex flex-col gap-1.5">
              {entry.comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          )}
        </div>
      );
    }
  }

  // Partner's entry (Partner's Journal) - today or yesterday
  return (
    <div
      className={`p-4 rounded-2xl border flex flex-col gap-2 relative bg-zinc-50/50 dark:bg-zinc-900/20 border-zinc-200/30 dark:border-zinc-800/30 ${
        isTodayEntry ? "ring-2 ring-pink-500/20 shadow-md" : ""
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 font-bold border border-pink-500/10">
            {entry.emotion}
          </span>
          <span className="text-[10px] text-zinc-400 font-medium">
            {formattedDate}
          </span>
        </div>
      </div>

      <p className="text-zinc-800 dark:text-zinc-200 font-medium my-1">
        &ldquo;{entry.content}&rdquo;
      </p>

      {/* Comments on partner's entry */}
      <div className="mt-2 border-t border-zinc-200/20 pt-2.5 flex flex-col gap-2">
        <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase flex items-center gap-1">
          <MessageCircle className="w-3 h-3" />
          <span>Discussion ({entry.comments.length})</span>
        </span>

        {entry.comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}

        {/* Post a comment form - only visible if there are no comments yet */}
        {entry.comments.length === 0 && (
          <div className="flex gap-2 items-center mt-1">
            {currentUserAvatar ? (
              <img src={currentUserAvatar} className="w-6 h-6 rounded-full object-cover border border-zinc-200" alt="avatar" />
            ) : (
              <span className="w-6 h-6 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-600 dark:text-rose-200 text-[10px] flex items-center justify-center font-bold font-sans">
                {currentUserCode}
              </span>
            )}
            <input
              type="text"
              placeholder="Type a loving comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handlePostComment();
              }}
              className="flex-1 text-xs p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 outline-none text-zinc-900 dark:text-white placeholder:text-zinc-400"
            />
            <button
              onClick={handlePostComment}
              className="p-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white shadow-sm transition-colors cursor-pointer"
            >
              <Send className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
