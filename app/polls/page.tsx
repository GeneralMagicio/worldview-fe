"use client";

import { useEffect, useState } from "react";
import FilterBar from "@/components/FilterBar";
import FilterModal from "@/components/Modals/FilterModal";
import Header from "@/components/Header";
import PollList from "@/components/Poll/PollList";
import { IPollFilters, FilterParams } from "@/types/poll";
import { DEFAULT_FILTERS } from "@/components/Modals/FilterModal";
import { useSearchParams } from "next/navigation";

export default function PollsPage() {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") as FilterParams;

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<IPollFilters>(DEFAULT_FILTERS);

  useEffect(() => {
    if (filter === FilterParams.Voted) {
      setFilters({
        ...DEFAULT_FILTERS,
        pollsVoted: true,
      });
    }
  }, [filter]);

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
      <PollList filters={filters} filterParam={filter} />
    </main>
  );
}
