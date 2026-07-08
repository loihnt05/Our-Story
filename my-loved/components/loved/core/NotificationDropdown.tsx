"use client";

import React from "react";
import { Sparkles, BookHeart, Calendar, Flame, MessageCircle } from "lucide-react";

export interface NotificationItem {
  id: string;
  type: "memory" | "anniversary" | "streak" | "notes" | "quiz";
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onClick?: () => void;
}

export function getNotifications(
  loved: any,
  onTabChange?: (href: string) => void,
  onTriggerMemoryReminder?: (milestone: any) => void
): NotificationItem[] {
  const notifications: NotificationItem[] = [];
  const today = new Date();

  if (loved?.milestones) {
    // 1. Check for active memory reminder (On This Day)
    const activeMemory = loved.milestones.find((m: any) => {
      if (!m.date) return false;
      const mDate = new Date(m.date);
      return (
        mDate.getMonth() === today.getMonth() &&
        mDate.getDate() === today.getDate() &&
        today.getFullYear() > mDate.getFullYear()
      );
    });

    if (activeMemory) {
      const yearsAgo = today.getFullYear() - new Date(activeMemory.date).getFullYear();
      notifications.push({
        id: "memory-today",
        type: "memory",
        title: "On This Day Memory! ⏳",
        description: `Relive "${activeMemory.title}" from ${yearsAgo} ${yearsAgo === 1 ? "year" : "years"} ago today.`,
        actionLabel: "Relive",
        onClick: () => {
          if (onTriggerMemoryReminder) {
            onTriggerMemoryReminder(activeMemory);
          }
        },
      });
    }

    // 2. Check for upcoming milestone anniversaries (in the next 7 days)
    loved.milestones.forEach((m: any) => {
      if (!m.date) return;
      const mDate = new Date(m.date);

      const nextAnni = new Date(today.getFullYear(), mDate.getMonth(), mDate.getDate());
      if (nextAnni < today) {
        nextAnni.setFullYear(today.getFullYear() + 1);
      }

      const diffTime = nextAnni.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0 && diffDays <= 7) {
        notifications.push({
          id: `upcoming-${m.id}`,
          type: "anniversary",
          title: "Upcoming Anniversary 📅",
          description: `"${m.title}" is in ${diffDays} ${diffDays === 1 ? "day" : "days"} (${mDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}).`,
          actionLabel: "View Timeline",
          onClick: () => {
            if (onTabChange) onTabChange("/timeline");
          },
        });
      }
    });
  }

  // 3. Streak notifications
  if (loved?.streakInfo?.currentStreak > 0) {
    notifications.push({
      id: "streak-active",
      type: "streak",
      title: "Love Streak Active! 🔥",
      description: `You are on a ${loved.streakInfo.currentStreak}-day journal streak. Keep it going!`,
      actionLabel: "Open Journal",
      onClick: () => {
        if (onTabChange) onTabChange("/number-loved");
      },
    });
  }

  // 4. Notes notifications
  if (loved?.notes?.length > 0) {
    notifications.push({
      id: "notes-alert",
      type: "notes",
      title: "Memory Notes Capsule 💌",
      description: `You have ${loved.notes.length} romantic notes stored in your memory lane.`,
      actionLabel: "Read Notes",
      onClick: () => {
        if (onTabChange) onTabChange("/timeline");
      },
    });
  }

  // 5. Quiz Reminder
  notifications.push({
    id: "quiz-challenge",
    type: "quiz",
    title: "Partner Quiz Challenge 🧩",
    description: "Take today's quiz to test your compatibility and learn more about each other.",
    actionLabel: "Play Quiz",
    onClick: () => {
      if (onTabChange) onTabChange("/quiz");
    },
  });

  return notifications;
}

interface NotificationDropdownProps {
  loved: any;
  onTabChange?: (href: string) => void;
  onTriggerMemoryReminder?: (milestone: any) => void;
  onClose?: () => void;
}

export default function NotificationDropdown({
  loved,
  onTabChange,
  onTriggerMemoryReminder,
  onClose,
}: NotificationDropdownProps) {
  const notifications = getNotifications(loved, onTabChange, onTriggerMemoryReminder);

  return (
    <div className="flex flex-col gap-3.5 select-none text-zinc-800 dark:text-zinc-100 max-h-80 overflow-y-auto scrollbar-hide">
      <div className="flex items-center justify-between border-b border-zinc-200/50 dark:border-zinc-850/50 pb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Notifications</span>
        <span className="text-[10px] bg-rose-500/10 text-rose-500 font-bold px-2 py-0.5 rounded-full">
          {notifications.length} Active
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {notifications.length === 0 ? (
          <div className="py-8 flex flex-col items-center gap-2 text-center">
            <span className="text-3xl">✨</span>
            <p className="text-xs text-zinc-400 font-medium">All caught up! Keep sharing the love 💖</p>
          </div>
        ) : (
          notifications.map((n) => {
            let itemIcon = <Sparkles className="w-4 h-4 text-purple-500" />;
            if (n.type === "memory") itemIcon = <BookHeart className="w-4 h-4 text-rose-500" />;
            if (n.type === "anniversary") itemIcon = <Calendar className="w-4 h-4 text-blue-500" />;
            if (n.type === "streak") itemIcon = <Flame className="w-4 h-4 text-orange-500 animate-pulse" />;
            if (n.type === "notes") itemIcon = <MessageCircle className="w-4 h-4 text-amber-500" />;

            return (
              <div
                key={n.id}
                onClick={() => {
                  if (n.onClick) n.onClick();
                  if (onClose) onClose();
                }}
                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-zinc-100/50 dark:hover:bg-zinc-850/35 border border-transparent hover:border-zinc-200/30 dark:hover:border-zinc-800/20 cursor-pointer transition-all text-left"
              >
                <div className="mt-0.5 shrink-0">{itemIcon}</div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold leading-tight truncate">{n.title}</h5>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 leading-normal">{n.description}</p>
                  {n.actionLabel && (
                    <span className="text-[9px] font-bold text-rose-500 dark:text-rose-400 uppercase tracking-widest mt-1.5 inline-block hover:underline">
                      {n.actionLabel} &rarr;
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
