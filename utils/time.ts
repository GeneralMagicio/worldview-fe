import { MONTHS } from "@/lib/constants";

export const getRelativeTimeString = (
  targetDate: string | Date
): { timeLeft: string; isEnded: boolean } => {
  const now = new Date();
  const date = new Date(targetDate);
  const diff = date.getTime() - now.getTime(); // in ms
  const absDiff = Math.abs(diff);

  const minutes = Math.floor(absDiff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  let result = "";

  if (diff > 0) {
    result = `${days}d ${hours % 24}h`;
  } else if (years >= 1) {
    result = `${years}y`;
  } else if (months >= 1) {
    result = `${months}mo`;
  } else if (days >= 1) {
    result = `${days}d ${hours % 24}h`;
  } else if (hours >= 1) {
    result = `${hours}h ${minutes % 60}m`;
  } else {
    result = `${minutes}m`;
  }

  return { timeLeft: result, isEnded: diff < 0 };
};

export const formatDate = (date: Date | null): string => {
  if (!date) return "";
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

export const parseTime = (timeString: string): { hours: number; minutes: number } => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return { hours, minutes };
};
