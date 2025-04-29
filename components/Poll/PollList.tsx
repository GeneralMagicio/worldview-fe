"use client";

import { useGetPolls } from "@/hooks/usePoll";
import { FilterParams, IPoll, IPollFilters } from "@/types/poll";
import { useEffect, useState } from "react";
import FilterBar from "../FilterBar";
import { Button } from "../ui/Button";
import BlurredCard from "../Verify/BlurredCard";
import NoPollsView from "./NoPollsView";
import PollCard from "./PollCard";

const POLLS_PER_PAGE = 10;

interface PollListProps {
  filters: IPollFilters;
  filterParam: FilterParams;
}

export default function PollList({ 
  filters, 
  filterParam,
}: PollListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [displayedPolls, setDisplayedPolls] = useState<IPoll[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState<
    "creationDate" | "endDate" | "participantCount"
  >();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Reset to first page and clear displayed polls when filters or search change
  useEffect(() => {
    setCurrentPage(1);
    setDisplayedPolls([]);
  }, [filters, searchTerm]);

  const checkIsActive = () => {
    if (filters.livePolls && filters.finishedPolls) return undefined;
    if (filters.livePolls && !filters.finishedPolls) return true;
    if (!filters.livePolls && filters.finishedPolls) return false;
    if (!filters.livePolls && !filters.finishedPolls) return undefined;
    return undefined;
  };

  useEffect(() => {
    if (filterParam === FilterParams.Recent) {
      setSortBy("creationDate");
      setSortOrder("desc");
    }

    if (filterParam === FilterParams.Trending) {
      setSortBy("participantCount");
      setSortOrder("desc");
    }
  }, [filterParam]);

  const {
    data: pollsData,
    isLoading,
    error,
    refetch,
  } = useGetPolls({
    limit: POLLS_PER_PAGE,
    sortBy,
    sortOrder,
    isActive: checkIsActive(),
    userVoted: filters.pollsVoted,
    userCreated: filters.pollsCreated,
    search: searchTerm || undefined,
  });

  // Extract polls and metadata
  const polls = pollsData?.polls || [];
  const totalItems = pollsData?.total || 0;

  // Update displayed polls when data changes
  useEffect(() => {
    if (polls && polls.length > 0) {
      setDisplayedPolls((prev) => [...prev, ...polls]);
    }
  }, [polls, currentPage]);

  // Calculate total pages when data changes
  useEffect(() => {
    if (totalItems > 0) {
      setTotalPages(Math.ceil(totalItems / POLLS_PER_PAGE));
    } else {
      setTotalPages(1);
    }
  }, [totalItems]);

  // Handle Load More functionality
  const handleLoadMore = async () => {
    if (currentPage < totalPages) {
      setIsLoadingMore(true);
      setCurrentPage((prev) => prev + 1);
      setIsLoadingMore(false);
    }
  };

  // Handle retry when error occurs
  const handleRetry = () => {
    refetch();
  };

  return (
    <section aria-label="Poll list" className="mb-6">
        <FilterBar 
          setFiltersOpen={setFiltersOpen} 
          onSearch={handleSearch}
          initialSearchTerm={searchTerm}
        />
      {renderContent()}
      {renderPagination()}
    </section>
  );

  function renderContent() {
    if (isLoading && currentPage === 1) {
      return <LoadingPolls />;
    }

    if (error) {
      return (
        <div className="rounded-lg bg-red-50 p-4 border border-red-200">
          <p className="text-center text-red-600">Error loading polls</p>
          <Button
            onClick={handleRetry}
            className="mt-4 w-full"
            variant="outline"
          >
            Retry
          </Button>
        </div>
      );
    }

    if (!displayedPolls || displayedPolls.length === 0) {
      return searchTerm ? (
        <div className="flex flex-col items-center justify-center py-8">
          <h3 className="text-lg font-medium mb-2">No polls found</h3>
          <p className="text-gray-500 text-center">
            No polls matching "{searchTerm}" were found. Try a different search term.
          </p>
        </div>
      ) : (
        <NoPollsView />
      );
    }

    return (
      <div className="space-y-4">
        {displayedPolls.map((poll: IPoll) => (
          <PollCard key={poll.pollId} poll={poll} />
        ))}

        {isLoadingMore && (
          <div className="pt-4">
            <BlurredCard />
          </div>
        )}
      </div>
    );
  }

  function renderPagination() {
    if (
      (isLoading && currentPage === 1) ||
      error ||
      !displayedPolls ||
      displayedPolls.length === 0 ||
      totalPages <= 1
    ) {
      return null;
    }

    return currentPage < totalPages ? (
      <div className="mt-6">
        <Button
          variant="outline"
          onClick={handleLoadMore}
          disabled={isLoadingMore || currentPage >= totalPages}
          className="w-full py-3"
        >
          {isLoadingMore ? "Loading..." : "Load More Polls"}
        </Button>
        <div className="text-center text-sm text-gray-500 mt-2">
          Showing {displayedPolls.length} of {totalItems} polls
        </div>
      </div>
    ) : (
      <div className="text-center text-sm text-gray-500 mt-6">
        All polls loaded ({totalItems} polls)
      </div>
    );
  }
}

const LoadingPolls = () => {
  return (
    <div className="space-y-4" aria-label="Loading polls">
      {Array.from({ length: 3 }).map((_, index) => (
        <BlurredCard key={index} />
      ))}
    </div>
  );
};
