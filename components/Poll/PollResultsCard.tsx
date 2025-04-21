import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetPollDetails, useDeletePoll } from "@/hooks/usePoll";
import { useGetUserVotes } from "@/hooks/useUser";
import { handleShareResults } from "@/utils/share";
import { getRelativeTimeString } from "@/utils/time";
import { formatFloat } from "@/utils/number";
import {
  ShareIcon,
  InfoIcon,
  UserIcon,
  CheckIcon,
  TrashIcon,
} from "@/components/icon-components";
import { Button } from "../ui/Button";
import QVInfoModal from "@/components/Modals/QVInfoModal";
import ConfirmDeleteModal from "../Modals/ConfirmDeleteModal";
import { useAuth } from "@/context/AuthContext";

type VoteState = {
  option: string;
  percentage: number;
  count: number;
};

export default function PollVoteCard({ pollId }: { pollId: number }) {
  const router = useRouter();
  const { worldID } = useAuth();

  const { data: pollData, isLoading } = useGetPollDetails(pollId);
  const { data: userVotes } = useGetUserVotes(pollId);
  const {
    mutate: deletePoll,
    isPending: deletePollPending,
    isSuccess: deletePollSuccess,
  } = useDeletePoll();

  const pollDetails = pollData?.poll;
  const isActive = pollData?.isActive;
  const pollResults = pollData?.optionsTotalVotes;
  const pollOptions = pollDetails?.options;
  const totalVotes = pollData?.totalVotes;
  const didVote = userVotes?.voteID;
  const isAuthor = worldID === pollDetails?.author?.worldID;

  const { timeLeft } = getRelativeTimeString(
    new Date(pollDetails?.endDate ?? "")
  );

  const [votes, setVotes] = useState<VoteState[]>();
  const [isExpanded, setIsExpanded] = useState(false);

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [showQVInfoModal, setShowQVInfoModal] = useState(false);

  useEffect(() => {
    if (!pollResults) return;

    const mappedVotes = pollOptions?.map((option) => ({
      option: option,
      percentage: totalVotes ? (pollResults[option] / totalVotes) * 100 : 0,
      count: pollResults[option] ?? 0,
    }));

    setVotes(mappedVotes);
  }, [pollResults]);

  useEffect(() => {
    if (!deletePollPending) {
      setShowConfirmDeleteModal(false);
    }

    if (deletePollSuccess) {
      router.push("/polls");
    }
  }, [deletePollPending]);

  const handleVote = () => {
    if (!isActive) return;
    router.push(`/poll/${pollId}`);
  };

  const handleDeletePoll = () => {
    deletePoll({ id: pollId });
  };

  if (!pollId) return null;

  return (
    <div className="bg-white rounded-3xl border border-secondary overflow-hidden mb-4 p-4 shadow-[0px_0px_16px_0px_#00000029]">
      {/* Poll Voting Card Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
            {isLoading ? (
              <div className="w-5 h-5 rounded-full bg-gray-300 animate-pulse" />
            ) : (
              <UserIcon />
            )}
          </div>
          {isLoading ? (
            <div className="w-24 h-4 rounded-full bg-gray-200 animate-pulse"></div>
          ) : (
            <span className="text-sm text-gray-900">
              {pollDetails?.author?.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {isLoading ? (
            <div className="w-24 h-4 rounded-full bg-gray-200 animate-pulse"></div>
          ) : (
            <>
              <div
                className={`w-2 h-2 rounded-full ${
                  isActive ? "bg-success-900" : "bg-gray-400"
                }`}
              />
              {isActive ? (
                <span className="text-sm text-gray-900">
                  {timeLeft} <span className="text-xs">left</span>
                </span>
              ) : (
                <span className="text-xs text-gray-900">Voting Ended</span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Poll Title + Description */}
      <div className="pb-2">
        {isLoading ? (
          <div className="space-y-2 mb-4">
            <div className="h-6 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-md w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-md w-5/6 animate-pulse"></div>
          </div>
        ) : (
          <>
            <h2 className="text-gray-900 text-xl font-medium leading-tight mb-2">
              {pollDetails?.title}
            </h2>

            {pollDetails?.description && (
              <>
                <p
                  className={`text-gray-900 text-sm mb-1 ${
                    isExpanded ? "" : "line-clamp-2"
                  }`}
                >
                  {pollDetails?.description}
                </p>
                {pollDetails?.description.length > 100 && (
                  <button
                    className="text-gray-700 font-medium text-xs mb-4"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? "Read less" : "Read more"}
                  </button>
                )}
              </>
            )}
          </>
        )}

        {/* Tags */}
        {isLoading ? (
          <div className="flex gap-2 mb-6">
            <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        ) : (
          <div className="flex gap-2 mb-6">
            {pollDetails?.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-300 border border-gray-300 text-gray-900 rounded-full font-medium text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Poll Options */}
        <div className="space-y-6 mb-4">
          {isLoading ? (
            <OptionsLoadingSkeleton />
          ) : (
            votes &&
            votes.map((vote, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="relative w-full h-10 bg-white rounded-lg overflow-hidden">
                    <div
                      className="absolute left-0 top-0 bottom-0 flex items-center gap-3 py-2 rounded-lg bg-gray-200 px-2 w-auto"
                      style={{
                        width: `${vote.percentage}%`,
                        minWidth: vote.percentage > 0 ? "60px" : "0",
                        maxWidth: "100%",
                        borderRight:
                          vote.percentage > 0 ? "1px solid #d6d9dd" : "none",
                        position: "relative",
                      }}
                    >
                      <span className="text-gray-900 whitespace-nowrap">
                        {vote.option}
                      </span>
                    </div>
                  </div>
                  <div className="w-80 flex items-center justify-end gap-6">
                    <span className="text-gray-500 text-sm">
                      {formatFloat(vote.count)} votes
                    </span>
                    <span className="text-gray-900 text-sm">
                      {formatFloat(vote.percentage)}%
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Poll Footer */}
        <div className="border-t border-gray-200 py-4 flex justify-between items-center">
          <div className="flex items-center gap-x-2">
            {isLoading ? (
              <div className="h-4 w-32 bg-gray-200 rounded-md animate-pulse"></div>
            ) : (
              <div className="flex items-center gap-2 text-gray-700 text-sm">
                <span className="text-gray-900 font-medium">
                  {pollDetails?.participantCount}
                </span>
                {!didVote ? (
                  `${
                    pollDetails?.participantCount === 1 ? "voter" : "voters"
                  } participated`
                ) : (
                  <span className="flex items-center gap-2">votes</span>
                )}

                {didVote && (
                  <div className="bg-success-300 text-success-900 px-2 py-1 rounded-full flex items-center gap-1 text-xs">
                    <span>You voted</span>
                    <CheckIcon size={12} color="#18964F" />
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button
              className="rounded-full h-8 w-8 disabled:opacity-50"
              onClick={() => setShowQVInfoModal(true)}
              disabled={isLoading}
            >
              <InfoIcon />
            </button>
            <button
              className="rounded-full h-8 w-8 disabled:opacity-50"
              onClick={() =>
                handleShareResults(pollDetails?.title ?? "", pollId)
              }
              disabled={isLoading}
            >
              <ShareIcon />
            </button>
          </div>
        </div>

        {/* Vote button */}
        <button
          className="w-full bg-gray-900 text-white h-14 rounded-xl mb-3 font-semibold font-sora disabled:text-gray-400 disabled:bg-gray-200"
          onClick={handleVote}
          disabled={!isActive}
        >
          {isActive ? "Vote" : "Voting Ended"}
        </button>

        {isAuthor && (
          <Button
            variant="ghost"
            className="w-full flex items-center justify-center gap-3 text-error-800 text-sm font-semibold font-sora"
            onClick={() => setShowConfirmDeleteModal(true)}
          >
            <TrashIcon />
            Delete Poll
          </Button>
        )}
      </div>

      {showQVInfoModal && <QVInfoModal setShowModal={setShowQVInfoModal} />}

      {isAuthor && (
        <ConfirmDeleteModal
          modalOpen={showConfirmDeleteModal}
          setModalOpen={setShowConfirmDeleteModal}
          onDelete={handleDeletePoll}
          isLoading={deletePollPending}
        />
      )}
    </div>
  );
}

const OptionsLoadingSkeleton = () => {
  return (
    <>
      {[1, 2, 3].map((index) => (
        <div key={index} className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="relative w-full h-10 bg-gray-100 rounded-lg overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 h-full w-1/4 bg-gray-200 rounded-lg animate-pulse" />
            </div>
            <div className="flex items-center gap-3 ml-3">
              <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
              <div className="w-10 h-4 bg-gray-200 rounded-md animate-pulse" />
              <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
            </div>
          </div>
          <div className="flex justify-end">
            <div className="w-16 h-4 bg-gray-200 rounded-md animate-pulse" />
          </div>
        </div>
      ))}
    </>
  );
};
