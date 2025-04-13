"use client";

import { usePolls } from "@/hooks/usePolls";
import PollCard from "./Poll/PollCard";
import CategoryCard from "./Category/CategoryCard";
import { UserIcon, PlusIcon } from "./icon-components";

export default function MainView() {
  const { data: polls, isLoading, error } = usePolls();

  console.log(polls);

  return (
    <div className="flex-1 bg-white rounded-t-3xl p-5">
      <div className="flex justify-end mb-4">
        <button className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
          <UserIcon />
        </button>
      </div>

      <h1 className="text-gray-900 text-xl font-bold mb-6">
        Discover polls to vote on or create your own!
      </h1>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <CategoryCard title="Explore All" icon="/categories/explore-all.svg" />
        <CategoryCard
          title="Trending Polls"
          icon="/categories/trending-polls.svg"
        />
        <CategoryCard title="Most Recent" icon="/categories/most-recent.svg" />
        <CategoryCard title="My Votes" icon="/categories/my-votes.svg" />
      </div>

      {/* Polls */}
      <div className="mb-6">
        <h2 className="text-gray-900 text-lg font-bold mb-4">Recent Polls</h2>
        <div className="space-y-4">
          {isLoading && <p>Loading polls...</p>}
          {error && <p className="text-red-500">Error loading polls</p>}
          {polls?.map((poll: any) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>
      </div>

      {/* Bottom Buttons */}
      <button className="w-full py-3 bg-gray-300 text-primary font-semibold rounded-lg mb-4 border border-gray-300">
        Explore all
      </button>
      <button className="w-full py-3 bg-primary text-white font-semibold rounded-lg flex items-center justify-center gap-2">
        <PlusIcon />
        Create a New Poll
      </button>
    </div>
  );
}
