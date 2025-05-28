"use client";

import { CheckIcon, UserIcon } from "@/components/icon-components";
import { IPoll } from "@/types/poll";
import { sendHapticFeedbackCommand } from "@/utils/animation";
import { getRelativeTimeString } from "@/utils/time";
import { usePathname, useRouter } from "next/navigation";
import {
  AnonymousIconWrapper,
  PublicIconWrapper,
} from "../icon-components/IconWrapper";
import { motion } from "framer-motion";

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0.0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.3,
    },
  },
};

export default function PollCard({
  index,
  poll,
}: {
  index: number;
  poll: IPoll;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isPublicProfile =
    pathname.includes("/user/") || pathname.includes("/userActivities/");

  const { timeLeft, isEnded } = getRelativeTimeString(
    poll.startDate ?? "",
    poll.endDate ?? ""
  );

  const navigateToPoll = () => {
    sendHapticFeedbackCommand();
    router.push(`/poll/${poll.pollId}`);
  };

  const navigateToPollResults = () => {
    sendHapticFeedbackCommand();
    router.push(`/poll/${poll.pollId}/results`);
  };

  const navigateToUserProfile = (e: React.MouseEvent) => {
    sendHapticFeedbackCommand();
    e.stopPropagation();
    if (poll.author.worldID) {
      router.push(`/user/${poll.author.worldID}`);
    }
  };

  return (
    <motion.div
      key={poll.pollId}
      variants={itemVariants}
      className="rounded-xl p-4 border border-secondary shadow-[0px_0px_16px_0px_#00000029]"
      initial="hidden"
      animate="visible"
      layout
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeInOut" },
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex justify-between items-center mb-3">
        <div
          className="flex items-center gap-2 cursor-pointer active:scale-95 transition-none active:transition-transform active:duration-100"
          onClick={navigateToUserProfile}
        >
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
            <UserIcon />
          </div>
          <span className="text-sm text-gray-900">
            {poll.author.name ? `@${poll.author.name}` : "Anon"}
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

      <div onClick={navigateToPollResults} className="cursor-pointer">
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

          <div>
            {poll.isAnonymous ? (
              <AnonymousIconWrapper />
            ) : (
              <PublicIconWrapper />
            )}
          </div>
        </div>
      </div>

      {poll.hasVoted && !isPublicProfile && (
        <div className="bg-success-300 text-success-900 px-2 py-1 rounded-full inline-flex w-fit items-center gap-1 text-xs">
          <span>You voted</span>
          <CheckIcon size={12} color="#18964F" />
        </div>
      )}

      {!poll.hasVoted && !isEnded && (
        <button
          className="w-full py-2.5 bg-gray-200 text-gray-900 font-medium rounded-lg mt-3 active:scale-95 active:shadow-inner transition-none active:transition-transform active:duration-100"
          onClick={(e) => {
            e.stopPropagation();
            navigateToPoll();
          }}
        >
          Vote
        </button>
      )}
    </motion.div>
  );
}
