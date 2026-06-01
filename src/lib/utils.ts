import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export function getTimeAgo(dateString: string): string {
  const createdDate = new Date(dateString);
  const currentDate = new Date();

  const diffInMs =
    currentDate.getTime() - createdDate.getTime();

  const minutes = Math.floor(diffInMs / (1000 * 60));
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  // years
  if (years >= 1) {
    return years === 1
      ? "1 year ago"
      : `${years} years ago`;
  }

  // months
  if (months >= 1) {
    return months === 1
      ? "1 month ago"
      : `${months} months ago`;
  }

  // days
  if (days >= 1) {
    return days === 1
      ? "1 day ago"
      : `${days} days ago`;
  }

  // hours
  if (hours >= 1) {
    return hours === 1
      ? "1 hour ago"
      : `${hours} hours ago`;
  }

  // minutes
  if (minutes >= 1) {
    return minutes === 1
      ? "1 minute ago"
      : `${minutes} minutes ago`;
  }

  return "just now";
}


export function parseDate(iso: string) {
  if (!iso) {
    return {
      fullLabel: "—",
    };
  }

  const d = new Date(`${iso}T00:00:00`);

  return {
    fullLabel: d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };
}

export function formatTime(time: string) {
  if (!time) return "—";

  const [hours, minutes] = time.split(":").map(Number);

  const period = hours < 12 ? "AM" : "PM";
  const formattedHours = hours % 12 || 12;

  return `${formattedHours}:${String(minutes).padStart(2, "0")} ${period}`;
}