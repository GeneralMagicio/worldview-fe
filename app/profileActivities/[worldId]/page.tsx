"use client";

import Header from "@/components/Header";
import FilterModal, { DEFAULT_FILTERS } from "@/components/Modals/FilterModal";
import UserActivityList from "@/components/userActivity/UserActivityList";
import { IPollFilters } from "@/types/poll";
import { useState } from "react";

export default function ProfileActivitiesPage() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<IPollFilters>(DEFAULT_FILTERS);

  return (
    <main className="flex-1 bg-white rounded-t-3xl p-5">
      <Header title="My Activities" backUrl="/profile" />
      <FilterModal
        filters={filters}
        setFilters={setFilters}
        filtersOpen={filtersOpen}
        setFiltersOpen={setFiltersOpen}
      />
      <UserActivityList 
        filters={filters} 
        setFiltersOpen={setFiltersOpen}
      />
    </main>
  );
}
