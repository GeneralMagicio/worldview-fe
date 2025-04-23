"use client";

import { useRouter } from "next/navigation";
import { getRelativeTimeString } from "@/utils/time";
import { IPoll } from "@/types/poll";
import { CheckIcon, UserIcon } from "@/components/icon-components";

export default function PollCard({ poll }: { poll: IPoll }) {
  const router = useRouter();

  const { timeLeft, isEnded } = getRelativeTimeString(new Date(poll.endDate));

  const navigateToPoll = () => {
    router.push(`/poll/${poll.pollId}`);
  };

  return (
    <div
      onClick={navigateToPoll}
      className="rounded-xl p-4 border border-secondary shadow-[0px_0px_16px_0px_#00000029] transition-all hover:shadow-md"
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
            <UserIcon />
          </div>
          <span className="text-sm text-gray-900">
            @{poll.author.name ?? "user"}{" "}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div
            className={`w-2 h-2 rounded-full ${
              isEnded ? "bg-gray-400" : "bg-success-900"
            }`}
          />

          {isEnded ? (
            <span className="text-xs text-gray-900">Voting Ended</span>
          ) : (
            <span className="text-sm text-gray-900">
              {timeLeft} <span className="text-xs">left</span>
            </span>
          )}
        </div>
      </div>

      <h3 className="text-gray-900 text-xl font-medium leading-tight mb-2">
        {poll.title}
      </h3>

      {poll.description && (
        <>
          <p className="text-gray-900 text-sm mb-1 line-clamp-2">
            {poll.description}
          </p>
          {poll.description.length > 100 && (
            <button className="text-gray-700 font-medium text-xs mb-4">
              Read more
            </button>
          )}
        </>
      )}

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-1">
          <span className="font-medium text-gray-900">
            {poll.participantCount}
          </span>
          <span className="text-sm text-gray-600">voters participated</span>
        </div>

        {poll.hasVoted && (
          <div className="bg-success-300 text-success-900 px-2 py-1 rounded-full flex items-center gap-1 text-xs">
            <span>You voted</span>
            <CheckIcon size={12} color="#18964F" />
          </div>
        )}
      </div>

      {!poll.hasVoted && (
        <button
          className="w-full py-2.5 bg-gray-200 text-gray-900 font-medium rounded-lg mt-3"
          onClick={(e) => {
            e.stopPropagation();
            navigateToPoll();
          }}
        >
          Vote
        </button>
      )}
    </div>
  );
}
