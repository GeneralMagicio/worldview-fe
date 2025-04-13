"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import {
  ShareIcon,
  SlidingIcon,
  StatisticBarsIcon,
  InfoIcon,
  MinusRoundIcon,
  PlusRoundIcon,
  UserIcon,
} from "@/components/icon-components";
import QVInfoModal from "@/components/modals/QVInfoModal";
import VotingSuccessModal from "@/components/modals/VotingSuccessModal";
import { handleShare } from "@/utils/share";

export default function Home() {
  const [votes, setVotes] = useState([
    { option: "Polygon", percentage: 60, count: 7746, isDragging: false },
    { option: "Optimism", percentage: 30, count: 5478, isDragging: false },
    { option: "Avalanche", percentage: 10, count: 3162, isDragging: false },
    { option: "BNB Smart Chain", percentage: 0, count: 0, isDragging: false },
  ]);

  const tags = ["technology", "blockchain", "web3"];
  const [showQVInfoModal, setShowQVInfoModal] = useState(false);
  const [showVotingSuccessModal, setShowVotingSuccessModal] = useState(false);

  const sliderRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleDragStart = (index: number) => {
    const newVotes = [...votes];
    newVotes[index].isDragging = true;
    setVotes(newVotes);
  };

  const handleDragEnd = () => {
    const newVotes = votes.map((vote) => ({ ...vote, isDragging: false }));
    setVotes(newVotes);
  };

  const handleDrag = (
    e: React.MouseEvent | React.TouchEvent,
    index: number
  ) => {
    if (!votes[index].isDragging) return;

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
    const handleMouseUp = () => handleDragEnd();
    const handleMouseMove = (e: MouseEvent) => {
      const draggingIndex = votes.findIndex((vote) => vote.isDragging);
      if (draggingIndex !== -1) {
        handleDrag(e as unknown as React.MouseEvent, draggingIndex);
      }
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

  const decreaseVote = (index: number) => {
    if (votes[index].percentage <= 0) return;

    const newVotes = [...votes];
    newVotes[index].percentage = Math.max(0, newVotes[index].percentage - 1);

    newVotes[index].count = Math.sqrt(newVotes[index].percentage);

    setVotes(newVotes);
  };

  const increaseVote = (index: number) => {
    if (votes[index].percentage >= 100) return;

    const newVotes = [...votes];
    newVotes[index].percentage = Math.min(100, newVotes[index].percentage + 1);

    newVotes[index].count = Math.sqrt(newVotes[index].percentage);

    setVotes(newVotes);
  };

  const voteButtonDisabled =
    votes.every((vote) => vote.percentage === 0) ||
    votes.reduce((acc, vote) => acc + vote.percentage, 0) > 100;

  const disableRestOfOptions =
    votes.reduce((acc, vote) => acc + vote.percentage, 0) > 100 &&
    votes.some((vote) => vote.percentage === 0);

  return (
    <div className="bg-white rounded-3xl border border-secondary overflow-hidden mb-4 p-4 shadow-[0px_0px_16px_0px_#00000029]">
      {/* Poll Voting Card Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
            <UserIcon />
          </div>
          <span className="text-sm text-gray-900">@mitch.1306</span>
        </div>
        <div className="flex items-center gap-1">
          <div
            className={`w-2 h-2 rounded-full ${
              false ? "bg-red-500" : "bg-success-900"
            }`}
          />
          <span className="text-sm text-gray-900">12h 20m left</span>
        </div>
      </div>

      {/* Poll Tittle + Description */}
      <div className="pb-2">
        <h2 className=" text-gray-900 text-xl font-medium leading-tight mb-2">
          Which crypto tokens are based on Ethereum blockchain network?
        </h2>
        <p className="text-gray-900 text-sm mb-1 line-clamp-2">
          TL;DR: Ethereum Layer-2 blockchains are solutions designed to enhance
          the scalability o...
        </p>
        <button className="text-gray-700 font-medium text-xs mb-4">
          Read more
        </button>

        {/* Tags */}
        <div className="flex gap-2 mb-6">
          {tags.map((tag) => (
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
          {votes.map((vote, index) => (
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
                    disabled={votes[index].percentage === 0}
                  >
                    <MinusRoundIcon
                      color={
                        votes[index].percentage === 0 ? "#9BA3AE" : "#191C20"
                      }
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
                    disabled={votes[index].percentage === 100}
                  >
                    <PlusRoundIcon
                      color={
                        votes[index].percentage === 100 ? "#9BA3AE" : "#191C20"
                      }
                    />
                  </button>
                </div>
              </div>
              <div className="text-right text-gray-500 text-sm w-full">
                {vote.count.toLocaleString()}{" "}
                {vote.count === 1 ? "Vote" : "Votes"}
              </div>
            </div>
          ))}
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
