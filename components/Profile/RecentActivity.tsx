"use client";

import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import PollCard from "../Poll/PollCard";
import { ActionType, UserActionDto } from "@/types/poll";

interface UserActivitiesResponseDto {
  userActions: UserActionDto[];
}

// Transform UserActionDto to match IPoll structure for PollCard
const transformActionToPoll = (action: UserActionDto) => {
  return {
    pollId: action.pollId,
    title: action.pollTitle,
    description: action.pollDescription,
    endDate: action.endDate,
    startDate: action.createdAt,
    creationDate: action.createdAt,
    participantCount: action.votersParticipated,
    hasVoted: action.type === ActionType.VOTED,
    authorUserId: 0, // Not available from the API
    author: {
      id: 0, // Not available from the API
      name: action.authorName,
      profilePicture: action.authorProfilePicture,
      pollsCreatedCount: 0, // Not available from the API
      pollsParticipatedCount: 0, // Not available from the API
      worldID: action.authorWorldId,
    },
    isAnonymous: false, // Not available from the API
    options: [], // Not available from the API
    tags: [], // Not available from the API
    voteResults: [], // Not available from the API
  };
};

export default function RecentActivity() {
  const { worldID } = useAuth();
  const [viewAll, setViewAll] = useState(false);
  
  const { data, isLoading, error } = useQuery<UserActivitiesResponseDto>({
    queryKey: ["userActivities", worldID],
    queryFn: async () => {
      const res = await fetch(`/user/getUserActivities?worldID=${worldID}`);
      if (!res.ok) throw new Error("Failed to fetch user activities");
      return res.json();
    },
    enabled: !!worldID,
  });

  const activities = data?.userActions || [];
  const displayActivities = viewAll ? activities : activities.slice(0, 2);

  if (isLoading) {
    return (
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-4 text-primary">Recent Activity</h3>
        <div className="flex justify-center py-4">
          <p className="text-gray-500">Loading activities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-4 text-primary">Recent Activity</h3>
        <div className="flex justify-center py-4">
          <p className="text-red-500">Failed to load activities</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <h3 className="text-lg font-medium mb-4 text-primary">Recent Activity</h3>
      {activities.length === 0 ? (
        <NoActivitiesView />
      ) : (
        <div className="space-y-4">
          {displayActivities.map((action) => (
            <PollCard key={action.id} poll={transformActionToPoll(action)} />
          ))}
        </div>
      )}

      {activities.length > 0 && !viewAll && (
        <button 
          className="w-full bg-primary text-white font-medium text-lg py-3 rounded-lg mt-4"
          onClick={() => setViewAll(true)}
        >
          View all Activities
        </button>
      )}
    </div>
  );
}

function NoActivitiesView() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg mt-16">
      <Image
        src="/illustrations/no-polls.svg"
        alt="No polls found illustration"
        width={221}
        height={150}
      />
      <p className="text-gray-900 font-medium mt-4">
        This user has no activities yet
      </p>
    </div>
  );
}
