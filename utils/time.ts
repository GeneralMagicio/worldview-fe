export const getRelativeTimeString = (
  targetDate: string | Date,
  suffix: boolean = true
): { timeLeft: string; isPassed: boolean } => {
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

  if (suffix) {
    result += diff > 0 ? " left" : " ago";
  }

  return { timeLeft: result, isPassed: diff < 0 };
};
