import React, { useState, useRef, useEffect } from "react";
import { getRelativeTimeString } from "@/utils/time";
import {
  ShareIcon,
  SlidingIcon,
  StatisticBarsIcon,
  InfoIcon,
  MinusRoundIcon,
  PlusRoundIcon,
  UserIcon,
} from "@/components/icon-components";
import QVInfoModal from "@/components/Modals/QVInfoModal";
import VotingSuccessModal from "@/components/Modals/VotingSuccessModal";
import { handleShare } from "@/utils/share";
import { usePoll } from "@/hooks/usePoll";
import { useUser } from "@/hooks/useUser";

type VoteState = {
  option: string;
  percentage: number;
  count: number;
  isDragging: boolean;
};

export default function PollVoteCard({ pollId }: { pollId: number }) {
  const { getPollDetails } = usePoll();
  const { getUserVotes } = useUser();

  const { data: pollData } = getPollDetails(pollId);
  const {
    data: userVotes,
    isFetched: userVotesFetched,
    isLoading: userVotesLoading,
  } = getUserVotes(pollId);

  const pollDetails = pollData?.poll;
  const isActive = pollData?.isActive;
  // const pollResults = pollData?.optionsTotalVotes;

  const { timeLeft } = getRelativeTimeString(
    new Date(pollDetails?.endDate ?? "")
  );

  const [votes, setVotes] = useState<VoteState[]>();
  const [showQVInfoModal, setShowQVInfoModal] = useState(false);
  const [showVotingSuccessModal, setShowVotingSuccessModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const sliderRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  // Add event listeners for mouse/touch events outside the component
  useEffect(() => {
    if (!votes?.length) return;

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
      const defaultVotes = pollDetails?.options.map((option) => ({
        option: option,
        percentage: 0,
        count: 0,
        isDragging: false,
      }));

      setVotes(defaultVotes);
      return;
    }

    const mappedUserVotes = userVotes?.options.map((option) => ({
      option: option,
      percentage: userVotes?.weightDistribution[option] ?? 0,
      count: userVotes?.votingPower ?? 0,
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

    newVotes[index].count = Math.sqrt(newVotes?.[index].percentage ?? 0);

    setVotes(newVotes);
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

    newVotes[index].count = Math.sqrt(newVotes?.[index].percentage ?? 0);

    setVotes(newVotes);
  };

  const voteButtonDisabled =
    !votes ||
    votes?.length === 0 ||
    votes?.every((vote) => vote.percentage === 0) ||
    votes?.reduce((acc, vote) => acc + vote.percentage, 0) > 100;

  const disableRestOfOptions =
    !votes ||
    votes?.length === 0 ||
    (votes?.reduce((acc, vote) => acc + vote.percentage, 0) > 100 &&
      votes?.some((vote) => vote.percentage === 0));

  if (!pollId) return null;

  return (
    <div className="bg-white rounded-3xl border border-secondary overflow-hidden mb-4 p-4 shadow-[0px_0px_16px_0px_#00000029]">
      {/* Poll Voting Card Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
            <UserIcon />
          </div>
          <span className="text-sm text-gray-900">
            {pollDetails?.author?.name}
          </span>
        </div>
        <div className="flex items-center gap-1">
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
        </div>
      </div>

      {/* Poll Tittle + Description */}
      <div className="pb-2">
        <h2 className=" text-gray-900 text-xl font-medium leading-tight mb-2">
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

        {/* Tags */}
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

        {/* Poll Options */}
        <div className="space-y-6 mb-4">
          {userVotesLoading ? (
            <div className="flex items-center justify-center h-24">
              <UserLoadingSkeleton />
            </div>
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
                      {vote.percentage}%
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
                  {vote.count.toLocaleString()}{" "}
                  {vote.count === 1 ? "Vote" : "Votes"}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Poll Footer */}
        <div className="border-t border-gray-200 py-4 flex justify-between items-center">
          <div className="flex items-center gap-x-2">
            <span className="text-gray-900 font-medium">10</span>
            <span className="text-gray-700 text-sm">voters participated</span>
          </div>
          <div className="flex gap-3">
            <button
              className="rounded-full h-8 w-8"
              onClick={() => setShowQVInfoModal(true)}
            >
              <InfoIcon />
            </button>
            <button
              className="rounded-full h-8 w-8"
              onClick={() => handleShare("Test", 1)}
            >
              <ShareIcon />
            </button>
          </div>
        </div>

        {/* Vote button */}
        <button
          className="w-full bg-gray-900 text-white h-14 rounded-xl mb-3 font-semibold font-sora disabled:bg-gray-200 disabled:text-gray-400"
          onClick={() => setShowVotingSuccessModal(true)}
          disabled={voteButtonDisabled}
        >
          Vote
        </button>

        {/* View Results */}
        <button className="w-full flex items-center justify-center bg-gray-50 gap-2 py-3 text-gray-700 font-semibold rounded-xl font-sora">
          <StatisticBarsIcon />
          View Poll Results
        </button>
      </div>

      {showQVInfoModal && <QVInfoModal setShowModal={setShowQVInfoModal} />}
      {showVotingSuccessModal && (
        <VotingSuccessModal
          setShowModal={setShowVotingSuccessModal}
          pollTitle={"test"}
          pollId={1}
        />
      )}
    </div>
  );
}

const UserLoadingSkeleton = () => {
  return (
    <div className="flex items-center justify-center h-24">
      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
    </div>
  );
};
