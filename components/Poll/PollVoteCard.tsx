import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGetUserVotes, useSetVote, useEditVote } from "@/hooks/useUser";
import { useGetPollDetails, useDeletePoll } from "@/hooks/usePoll";
import { getRelativeTimeString } from "@/utils/time";
import { handleSharePoll } from "@/utils/share";
import {
  ShareIcon,
  SlidingIcon,
  StatisticBarsIcon,
  InfoIcon,
  MinusRoundIcon,
  PlusRoundIcon,
  UserIcon,
  CheckIcon,
  TrashIcon,
} from "@/components/icon-components";
import { Button } from "../ui/Button";
import QVInfoModal from "@/components/Modals/QVInfoModal";
import VotingSuccessModal from "@/components/Modals/VotingSuccessModal";
import ConfirmDeleteModal from "@/components/Modals/ConfirmDeleteModal";
import { useAuth } from "@/context/AuthContext";
import { formatFloat } from "@/utils/number";
type VoteState = {
  option: string;
  percentage: number;
  count: number;
  isDragging: boolean;
};

export default function PollVoteCard({ pollId }: { pollId: number }) {
  const router = useRouter();
  const { worldID } = useAuth();

  const { data: pollData, isLoading: pollLoading } = useGetPollDetails(pollId);
  const { mutate: editVote, isPending: editVotePending } = useEditVote();
  const { mutate: setVote, isPending: setVotePending } = useSetVote();
  const {
    mutate: deletePoll,
    isPending: deletePollPending,
    isSuccess: deletePollSuccess,
  } = useDeletePoll();
  const {
    data: userVotes,
    isFetched: userVotesFetched,
    isLoading: userVotesLoading,
  } = useGetUserVotes(pollId);

  const pollDetails = pollData?.poll;
  const isActive = pollData?.isActive;
  const pollOptions = pollDetails?.options;
  const isAuthor = worldID === pollDetails?.author?.worldID;

  const { timeLeft } = getRelativeTimeString(
    new Date(pollDetails?.endDate ?? "")
  );

  // Modals
  const [showQVInfoModal, setShowQVInfoModal] = useState(false);
  const [showVotingSuccessModal, setShowVotingSuccessModal] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

  const [votes, setVotes] = useState<VoteState[]>();
  const [isExpanded, setIsExpanded] = useState(false);

  // Refs
  const sliderRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [votesChanged, setVotesChanged] = useState(false);

  const handleDragStart = (index: number) => {
    if (!votes) return;

    const newVotes = [...votes];
    newVotes[index].isDragging = true;
    setVotes(newVotes);
  };

  const handleDragEnd = () => {
    const newVotes = votes?.map((vote) => ({ ...vote, isDragging: false }));
    setVotes(newVotes);
  };

  const handleDrag = (
    e: React.MouseEvent | React.TouchEvent,
    index: number
  ) => {
    if (!votes?.[index].isDragging) return;

    const container = containerRefs.current[index];
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;

    let percentage = Math.round(((clientX - rect.left) / rect.width) * 100);
    percentage = Math.max(0, Math.min(100, percentage));

    const newVotes = [...votes];
    newVotes[index].percentage = percentage;
    newVotes[index].count = Math.sqrt(percentage);

    setVotes(newVotes);
  };

  const handleVote = () => {
    let weightDistribution: Record<string, number> = {};

    if (votes) {
      weightDistribution = votes.reduce<Record<string, number>>((acc, vote) => {
        acc[vote.option] = vote.percentage || 0;
        return acc;
      }, {});
    } else {
      weightDistribution =
        pollOptions?.reduce<Record<string, number>>((acc, option) => {
          acc[option] = 0;
          return acc;
        }, {}) ?? {};
    }

    if (userVotes) {
      editVote({
        voteID: userVotes.voteID,
        weightDistribution,
      });
    } else {
      setVote({
        pollId,
        weightDistribution,
      });
    }

    setShowVotingSuccessModal(true);
  };

  const handleDeletePoll = () => {
    deletePoll({ id: pollId });
  };

  useEffect(() => {
    if (!deletePollPending) {
      setShowConfirmDeleteModal(false);
    }

    if (deletePollSuccess) {
      router.push("/polls");
    }
  }, [deletePollPending]);

  // Add event listeners for mouse/touch events outside the component
  useEffect(() => {
    if (!votes?.length) return;

    if (userVotes) {
      setVotesChanged(
        votes.some(
          (vote) =>
            vote.percentage !== userVotes.weightDistribution[vote.option]
        )
      );
    }

    const handleMouseUp = () => handleDragEnd();
    const handleMouseMove = (e: MouseEvent) => {
      const draggingIndex = votes?.findIndex((vote) => vote.isDragging);

      if (draggingIndex === -1) return;

      handleDrag(e as unknown as React.MouseEvent, draggingIndex);
    };

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchend", handleMouseUp);
    window.addEventListener(
      "touchmove",
      handleMouseMove as unknown as (e: TouchEvent) => void
    );

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
      window.removeEventListener(
        "touchmove",
        handleMouseMove as unknown as (e: TouchEvent) => void
      );
    };
  }, [votes]);

  useEffect(() => {
    if (!userVotes) {
      setVotes(
        pollDetails?.options.map((option) => ({
          option: option,
          percentage: 0,
          count: 0,
          isDragging: false,
        }))
      );
      return;
    }

    const mappedUserVotes = userVotes?.options.map((option) => ({
      option: option,
      percentage: userVotes?.weightDistribution[option] ?? 0,
      count: Math.sqrt(userVotes?.weightDistribution[option] ?? 0),
      isDragging: false,
    }));

    setVotes(mappedUserVotes);
  }, [userVotesFetched]);

  const decreaseVote = (index: number) => {
    const vote = votes?.[index];

    if (!vote) return;
    if (vote.percentage <= 0) return;

    const newVotes = votes?.map((vote, i) =>
      i === index
        ? { ...vote, percentage: Math.max(0, vote.percentage - 1) }
        : vote
    );

    if (newVotes) {
      newVotes[index].count = Math.sqrt(newVotes[index].percentage);
      setVotes(newVotes);
    }
  };

  const increaseVote = (index: number) => {
    const vote = votes?.[index];

    if (!vote) return;
    if (vote.percentage >= 100) return;

    const newVotes = votes?.map((vote, i) =>
      i === index
        ? { ...vote, percentage: Math.min(100, vote.percentage + 1) }
        : vote
    );

    if (newVotes) {
      newVotes[index].count = Math.sqrt(newVotes[index].percentage);
      setVotes(newVotes);
    }
  };

  const voteButtonDisabled =
    !votes ||
    votes?.length === 0 ||
    votes?.every((vote) => vote.percentage === 0) ||
    votes?.reduce((acc, vote) => acc + vote.percentage, 0) > 100;

  if (!pollId) return null;

  const isLoading = pollLoading || userVotesLoading;

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
                <div
                  className="flex items-center justify-between"
                  ref={(el) => {
                    containerRefs.current[index] = el;
                  }}
                >
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
                        cursor: "grab",
                      }}
                      onMouseDown={() => handleDragStart(index)}
                      onTouchStart={() => handleDragStart(index)}
                      ref={(el) => {
                        sliderRefs.current[index] = el;
                      }}
                    >
                      <div
                        className="absolute right-2 w-1 my-auto rounded-full"
                        style={{
                          cursor: "col-resize",
                          touchAction: "none",
                        }}
                      >
                        <SlidingIcon />
                      </div>
                      <span className="text-gray-900 whitespace-nowrap">
                        {vote.option}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => decreaseVote(index)}
                      disabled={vote.percentage === 0}
                    >
                      <MinusRoundIcon
                        color={vote.percentage === 0 ? "#9BA3AE" : "#191C20"}
                      />
                    </button>
                    <span
                      className={`w-10 text-center ${
                        vote.percentage > 0 ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {formatFloat(vote.percentage)}%
                    </span>
                    <button
                      onClick={() => increaseVote(index)}
                      disabled={vote.percentage === 100}
                    >
                      <PlusRoundIcon
                        color={vote.percentage === 100 ? "#9BA3AE" : "#191C20"}
                      />
                    </button>
                  </div>
                </div>

                <div className="text-right text-gray-500 text-sm w-full">
                  {formatFloat(vote.count)}{" "}
                  {vote.count === 1 ? "Vote" : "Votes"}
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
                {!userVotes?.voteID ? (
                  `${
                    pollDetails?.participantCount === 1 ? "voter" : "voters"
                  } participated`
                ) : (
                  <span className="flex items-center gap-2">votes</span>
                )}

                {userVotes?.voteID && (
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
              disabled={isLoading || editVotePending || setVotePending}
            >
              <InfoIcon />
            </button>
            <button
              className="rounded-full h-8 w-8 disabled:opacity-50"
              onClick={() => handleSharePoll(pollDetails?.title ?? "", pollId)}
              disabled={isLoading || editVotePending || setVotePending}
            >
              <ShareIcon />
            </button>
          </div>
        </div>

        {/* Vote button */}
        <button
          className="w-full bg-gray-900 text-white h-14 rounded-xl mb-3 font-semibold font-sora disabled:bg-gray-200 disabled:text-gray-400"
          onClick={handleVote}
          disabled={
            isLoading ||
            voteButtonDisabled ||
            editVotePending ||
            setVotePending ||
            !isActive ||
            !votesChanged
          }
        >
          {isLoading
            ? "Loading..."
            : editVotePending
            ? "Saving..."
            : setVotePending
            ? "Submitting..."
            : "Vote"}
        </button>

        {/* View Results */}
        <Link
          className="w-full flex items-center justify-center bg-gray-50 gap-2 py-3 text-gray-700 font-semibold rounded-xl font-sora mb-3"
          href={`/poll/${pollId}/results`}
        >
          <StatisticBarsIcon />
          View Poll Results
        </Link>

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
      {showVotingSuccessModal && (
        <VotingSuccessModal
          setShowModal={setShowVotingSuccessModal}
          pollTitle={pollDetails?.title ?? ""}
          pollId={pollId}
        />
      )}

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
