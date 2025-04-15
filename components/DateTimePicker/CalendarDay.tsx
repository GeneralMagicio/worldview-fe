import { CalendarDayProps } from "@/types/dateTimePicker";
import { cn } from "@/utils";

export const CalendarDay = ({
  dateObj,
  isCurrentMonth,
  isInSelectedRange,
  isRangeStart,
  isRangeEnd,
  isFirstInWeek,
  isLastInWeek,
  onClick,
}: CalendarDayProps) => {
  const { day, month, year } = dateObj;

  return (
    <div
      className={cn(
        "relative h-12 flex items-center justify-center",
        isInSelectedRange && "bg-gray-200",
        isInSelectedRange && isFirstInWeek && "rounded-l-full",
        isInSelectedRange && isLastInWeek && "rounded-r-full",
        isRangeStart && "rounded-l-full",
        isRangeEnd && "rounded-r-full"
      )}
    >
      <button
        className={cn(
          "flex items-center justify-center w-12 h-12 relative rounded-full transition-colors",
          (isRangeStart || isRangeEnd) && "bg-gray-900 text-white",
          !isCurrentMonth && "text-gray-300"
        )}
        onClick={() => onClick(day, month, year)}
        aria-label={`${day} ${new Intl.DateTimeFormat("en-US", {
          month: "long",
        }).format(new Date(year, month, 1))}, ${year}`}
        aria-selected={isRangeStart || isRangeEnd}
      >
        {day}
      </button>
    </div>
  );
};
