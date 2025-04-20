"use client";

import { useState, useEffect } from "react";
import { getPolls } from "@/hooks/usePoll";
import BlurredCard from "../Verify/BlurredCard";
import PollCard from "./PollCard";
import { IPollFilters, IPoll } from "@/types/poll";
import { Button } from "../ui/Button";

const POLLS_PER_PAGE = 4;

interface PollListProps {
  filters: IPollFilters;
}

export default function PollList({ filters }: PollListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [displayedPolls, setDisplayedPolls] = useState<IPoll[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Reset to first page and clear displayed polls when filters change
  useEffect(() => {
    setCurrentPage(1);
    setDisplayedPolls([]);
  }, [filters]);

  const checkIsActive = () => {
    if (filters.livePolls && filters.finishedPolls) return undefined;
    if (filters.livePolls && !filters.finishedPolls) return true;
    if (!filters.livePolls && filters.finishedPolls) return false;
    if (!filters.livePolls && !filters.finishedPolls) return undefined;
    return undefined;
  };

  const {
    data: pollsData,
    isLoading,
    error,
    refetch,
  } = getPolls({
    limit: POLLS_PER_PAGE,
    sortBy: "creationDate",
    sortOrder: "desc",
    isActive: checkIsActive(),
    userVoted: filters.pollsVoted,
    userCreated: filters.pollsCreated,
  });

  // Extract polls and metadata
  const polls = pollsData?.polls || [];
  const totalItems = pollsData?.total || 0;

  // Update displayed polls when data changes
  useEffect(() => {
    console.log(polls, totalItems);
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
      // The useEffect will handle adding the new polls to displayedPolls
      setIsLoadingMore(false);
    }
  };

  // Handle retry when error occurs
  const handleRetry = () => {
    refetch();
  };

  return (
    <section aria-label="Poll list" className="mb-6">
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
      return (
        <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            No polls found
          </h3>
          <p className="text-gray-500">
            {filters.livePolls
              ? "There are no active polls at the moment."
              : filters.pollsVoted
              ? "You haven't voted in any polls yet."
              : filters.pollsCreated
              ? "You haven't created any polls yet."
              : "No polls match your current filters."}
          </p>
        </div>
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
