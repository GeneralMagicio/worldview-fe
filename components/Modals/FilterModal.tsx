import CustomCheckbox from "../ui/CustomCheckbox";
import BottomModal from "../ui/BottomModal";
import { IPollFilters } from "@/types/poll";
import { useState } from "react";

interface FilterModalProps {
  filters: IPollFilters;
  setFilters: (filters: IPollFilters) => void;
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
}

export const DEFAULT_FILTERS: IPollFilters = {
  livePolls: false,
  finishedPolls: false,
  pollsVoted: false,
  pollsCreated: false,
};

export default function FilterModal({
  filters,
  setFilters,
  filtersOpen,
  setFiltersOpen,
}: FilterModalProps) {
  const [tempFilters, setTempFilters] = useState<IPollFilters>(filters);

  const applyFilters = () => {
    setFilters(tempFilters);
    setFiltersOpen(false);
  };

  const resetFilters = () => {
    setTempFilters(DEFAULT_FILTERS);
    setFilters(DEFAULT_FILTERS);
    setFiltersOpen(false);
  };

  return (
    <BottomModal modalOpen={filtersOpen} setModalOpen={setFiltersOpen}>
      <h2 className="text-xl font-medium text-center mb-8">Select filters</h2>

      <div className="space-y-4">
        <CustomCheckbox
          id="live"
          label="Live Polls"
          checked={tempFilters.livePolls}
          onChange={(checked) =>
            setTempFilters({ ...tempFilters, livePolls: checked })
          }
        />
        <CustomCheckbox
          id="finished"
          label="Finished Polls"
          checked={tempFilters.finishedPolls}
          onChange={(checked) =>
            setTempFilters({ ...tempFilters, finishedPolls: checked })
          }
        />
        <CustomCheckbox
          id="voted"
          label="Polls Voted"
          checked={tempFilters.pollsVoted}
          onChange={(checked) =>
            setTempFilters({ ...tempFilters, pollsVoted: checked })
          }
        />
        <CustomCheckbox
          id="created"
          label="Polls Created"
          checked={tempFilters.pollsCreated}
          onChange={(checked) =>
            setTempFilters({ ...tempFilters, pollsCreated: checked })
          }
        />
      </div>

      <button
        className="w-full bg-gray-900 text-white rounded-lg py-4 mt-8 text-sm font-medium font-sora disabled:bg-gray-200 disabled:text-gray-500"
        onClick={applyFilters}
        disabled={
          tempFilters.livePolls === filters.livePolls && 
          tempFilters.finishedPolls === filters.finishedPolls &&
          tempFilters.pollsVoted === filters.pollsVoted &&
          tempFilters.pollsCreated === filters.pollsCreated
        }
      >
        Apply Filters
      </button>

      <button
        className="w-full text-center text-gray-500 mt-4 py-2 text-sm font-semibold font-sora"
        onClick={resetFilters}
      >
        Reset
      </button>
    </BottomModal>
  );
}
