"use client";
import { usePolls } from "@/hooks/usePolls";
import PollCard from "./PollCard";
import BlurredCard from "../Verify/BlurredCard";

export default function RecentPolls() {
  const { data: polls, isLoading, error } = usePolls();

  return (
    <div className="mb-6">
      <h2 className="text-gray-900 text-lg font-bold mb-4">Recent Polls</h2>
      {isLoading ? (
        <LoadingPolls />
      ) : error ? (
        <p className="text-red-500">Error loading polls</p>
      ) : (
        <div className="space-y-4">
          {polls?.map((poll: any) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>
      )}
    </div>
  );
}

const LoadingPolls = () => {
  return (
    <div className="space-y-4">
      <BlurredCard />
      <BlurredCard />
      <BlurredCard />
    </div>
  );
};
