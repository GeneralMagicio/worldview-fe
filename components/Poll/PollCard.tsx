import { UserIcon } from "@/components/icon-components";
import { IPoll } from "@/types/poll";
import { getRelativeTimeString } from "@/utils/time";
import { useRouter } from "next/navigation";

export default function PollCard({ poll }: { poll: IPoll }) {
  const { timeLeft, isPassed } = getRelativeTimeString(
    new Date(poll.endDate),
    true
  );

  const router = useRouter();

  return (
    <div className="rounded-xl p-4 border border-secondary shadow-[0px_0px_16px_0px_#00000029]">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
            <UserIcon />
          </div>
          <span className="text-sm text-gray-900">
            @{poll.authorUserId ?? "user"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div
            className={`w-2 h-2 rounded-full ${
              isPassed ? "bg-red-500" : "bg-success-900"
            }`}
          />
          <span className="text-sm text-gray-900">{timeLeft}</span>
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

      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-1">
          <span className="font-medium text-gray-900">
            {poll.participantCount}
          </span>
          <span className="text-sm text-gray-600">voters participated</span>
        </div>
      </div>

      <button
        className="w-full py-2.5 bg-gray-200 text-gray-900 font-semibold rounded-lg"
        onClick={() => router.push(`/poll/${poll.pollId}`)}
      >
        Vote
      </button>
    </div>
  );
}
