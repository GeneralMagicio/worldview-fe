"use client";

import { useState } from "react";
import FilterBar from "@/components/FilterBar";
import FilterModal from "@/components/Modals/FilterModal";
import Header from "@/components/Header";
import PollList from "@/components/Poll/PollList";
import { IPollFilters } from "@/types/poll";
import { DEFAULT_FILTERS } from "@/components/Modals/FilterModal";

export default function PollsPage() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<IPollFilters>(DEFAULT_FILTERS);

  return (
    <main className="flex-1 bg-white rounded-t-3xl p-5">
      <Header backUrl="/" />
      <FilterBar setFiltersOpen={setFiltersOpen} />
      <FilterModal
        filters={filters}
        setFilters={setFilters}
        filtersOpen={filtersOpen}
        setFiltersOpen={setFiltersOpen}
      />
      <PollList filters={filters} />
    </main>
  );
}
