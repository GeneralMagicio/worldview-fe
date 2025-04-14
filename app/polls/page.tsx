"use client";

import { useState } from "react";
import FilterBar from "@/components/FilterBar";
import FilterModal from "@/components/Modals/FilterModal";
import Header from "@/components/Header";
import PollList from "@/components/Poll/PollList";

export default function PollsPage() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    livePolls: true,
    finishedPolls: true,
    pollsVoted: true,
    pollsCreated: true,
  });

  return (
    <main>
      <div className="flex-1 bg-white rounded-t-3xl p-5">
        <Header backUrl="/" />
        <FilterBar setFiltersOpen={setFiltersOpen} />
        {filtersOpen && (
          <FilterModal
            filters={filters}
            setFilters={setFilters}
            filtersOpen={filtersOpen}
            setFiltersOpen={setFiltersOpen}
          />
        )}
        <PollList />
      </div>
    </main>
  );
}
