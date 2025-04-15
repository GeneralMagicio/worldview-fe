import { usePoll } from "@/hooks/usePoll";
import BlurredCard from "../Verify/BlurredCard";
import PollCard from "./PollCard";

export default function PollList() {
  const { getPolls } = usePoll();

  const { data: polls, isLoading, error } = getPolls();

  return (
    <div className="mb-6">
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
