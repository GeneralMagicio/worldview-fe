import { MONTHS } from "@/lib/constants";

export const getRelativeTimeString = (
  targetDate: string | Date
): { timeLeft: string; isEnded: boolean } => {
  const now = new Date();
  const date = new Date(targetDate);
  const diff = date.getTime() - now.getTime(); // in ms
  const isPast = diff < 0;
  const absDiff = Math.abs(diff);

  const minutes = Math.floor(absDiff / (1000 * 60));
  const hours = Math.floor(absDiff / (1000 * 60 * 60));
  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  // const years = Math.floor(months / 12);

  let timeLeft: string = "";

  if (!isPast) {
    if (days >= 60) {
      const remainingDays = days % 30;
      timeLeft =
        remainingDays > 0 ? `${months}m ${remainingDays}d` : `${months}m`;
    } else if (days >= 1) {
      const remainingHours = hours % 24;
      timeLeft =
        remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
    } else if (hours >= 1) {
      const remainingMinutes = minutes % 60;
      timeLeft =
        remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    } else {
      timeLeft = `${minutes}m`;
    }
  }

  return {
    timeLeft,
    isEnded: isPast,
  };
};

export const formatDate = (date: Date | null): string => {
  if (!date) return "";
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

export const formatShortDate = (date: Date | null): string => {
  if (!date) return "-";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const parseTime = (
  timeString: string
): { hours: number; minutes: number } => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return { hours, minutes };
};

export const combineDateTime = (date: Date, timeString: string) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
};
