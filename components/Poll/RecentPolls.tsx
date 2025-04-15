"use client";

import { usePoll } from "@/hooks/usePoll";
import PollCard from "./PollCard";
import BlurredCard from "../Verify/BlurredCard";
import NoPollsView from "./NoPollsView";
import Link from "next/link";
import { PlusIcon } from "../icon-components";
import { useState, useEffect } from "react";
import { IPoll } from "@/types/poll";

const POLLS_LIMIT = 4;

export default function RecentPolls() {
  const { getPolls } = usePoll();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: polls,
    isLoading,
    error,
    refetch,
  } = getPolls({
    limit: POLLS_LIMIT,
    sortBy: "creationDate",
    sortOrder: "desc",
  });

  // Auto-refresh polls every 5 minutes
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      handleRefresh();
    }, 5 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const getErrorMessage = () => {
    if (!error) return null;

    if ("message" in error) {
      return error.message;
    }

    return "Error loading polls. Please try again later.";
  };

  return (
    <section className="mb-6" aria-labelledby="recent-polls-heading">
      <div className="flex justify-between items-center mb-4">
        <h2
          id="recent-polls-heading"
          className="text-gray-900 text-xl font-medium"
        >
          Recent Polls
        </h2>

        {polls && polls.length > 0 && (
          <button
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing}
            className="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
            aria-label="Refresh polls"
          >
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        )}
      </div>

      {renderContent()}
    </section>
  );

  function renderContent() {
    if (isLoading) return <LoadingPolls />;

    if (error) {
      return (
        <div className="rounded-lg bg-red-50 p-4 border border-red-200">
          <p className="text-center text-red-600 font-medium">
            {getErrorMessage()}
          </p>
          <button
            onClick={handleRefresh}
            className="mt-3 w-full py-2 bg-white text-red-600 font-medium rounded-lg border border-red-300 hover:bg-red-50 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (!polls || polls.length === 0) return <NoPollsView />;

    return (
      <>
        <div className="space-y-4 mb-6" aria-label="Poll list">
          {polls.map((poll: IPoll) => (
            <PollCard key={poll.pollId} poll={poll} />
          ))}
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Link
            className="py-3 bg-gray-300 text-primary font-medium rounded-lg flex items-center justify-center"
            href="/polls"
          >
            Explore all
          </Link>

          <Link
            className="py-3 bg-primary text-white text-lg font-medium rounded-lg flex items-center justify-center gap-2"
            href="/polls/create"
          >
            <PlusIcon />
            Create a New Poll
          </Link>
        </div>
      </>
    );
  }
}

const LoadingPolls = () => {
  return (
    <div className="space-y-4" aria-label="Loading polls">
      {Array.from({ length: POLLS_LIMIT }).map((_, index) => (
        <BlurredCard key={index} />
      ))}
    </div>
  );
};
