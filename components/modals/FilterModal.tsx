import { useRef, useState, useEffect } from "react";
import CustomCheckbox from "../ui/CustomCheckbox";

type Filters = {
  livePolls: boolean;
  finishedPolls: boolean;
  pollsVoted: boolean;
  pollsCreated: boolean;
};

interface FilterModalProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
}

export default function FilterModal({
  filters,
  setFilters,
  filtersOpen,
  setFiltersOpen,
}: FilterModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [modalOffset, setModalOffset] = useState(0);
  const [startY, setStartY] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleStart = (y: number) => {
    setStartY(y);
    setIsDragging(true);
  };

  const handleMove = (y: number) => {
    if (!isDragging || startY === null) return;
    const diff = y - startY;
    if (diff > 0) setModalOffset(diff);
  };

  const handleEnd = () => {
    setIsDragging(false);
    setStartY(null);
    if (modalOffset > 150) setFiltersOpen(false);
    else setModalOffset(0);
  };

  // Handle touch/mouse unified
  const handleTouchStart = (e: React.TouchEvent) =>
    handleStart(e.touches[0].clientY);
  const handleTouchMove = (e: React.TouchEvent) =>
    handleMove(e.touches[0].clientY);
  const handleTouchEnd = () => handleEnd();

  const handleMouseDown = (e: React.MouseEvent) => handleStart(e.clientY);
  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientY);
  const handleMouseUp = () => handleEnd();

  useEffect(() => {
    if (filtersOpen) setModalOffset(0);
  }, [filtersOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setFiltersOpen(false);
      }
    };

    if (filtersOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filtersOpen]);

  useEffect(() => {
    if (filtersOpen) {
      document.documentElement.classList.add("overflow-hidden");
    } else {
      document.documentElement.classList.remove("overflow-hidden");
    }

    return () => {
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, [filtersOpen]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Poll filter options"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-t-3xl w-full max-w-md animate-slide-up pb-4"
        style={{
          animationDuration: "300ms",
          animationFillMode: "forwards",
          transform: `translateY(${modalOffset}px)`,
          transition: isDragging ? "none" : "transform 0.3s ease-out",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Grab bar */}
        <div
          className="pt-6 pb-2 flex justify-center cursor-grab active:cursor-grabbing"
          onTouchStart={(e) => {
            e.stopPropagation();
            handleTouchStart(e);
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            handleMouseDown(e);
          }}
        >
          <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Modal content */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-center mb-8">
            Select filters
          </h2>

          <div className="space-y-4">
            <CustomCheckbox
              id="live"
              label="Live Polls"
              checked={filters.livePolls}
              onChange={(checked) =>
                setFilters({ ...filters, livePolls: checked })
              }
            />
            <CustomCheckbox
              id="finished"
              label="Finished Polls"
              checked={filters.finishedPolls}
              onChange={(checked) =>
                setFilters({ ...filters, finishedPolls: checked })
              }
            />
            <CustomCheckbox
              id="voted"
              label="Polls Voted"
              checked={filters.pollsVoted}
              onChange={(checked) =>
                setFilters({ ...filters, pollsVoted: checked })
              }
            />
            <CustomCheckbox
              id="created"
              label="Polls Created"
              checked={filters.pollsCreated}
              onChange={(checked) =>
                setFilters({ ...filters, pollsCreated: checked })
              }
            />
          </div>

          <button
            className="w-full bg-gray-900 text-white rounded-md py-4 mt-8 text-lg font-sora"
            onClick={() => setFiltersOpen(false)}
          >
            Apply Filters
          </button>

          <button
            className="w-full text-center text-gray-500 mt-4 py-2 font-medium font-sora"
            onClick={() =>
              setFilters({
                livePolls: true,
                finishedPolls: false,
                pollsVoted: false,
                pollsCreated: false,
              })
            }
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
