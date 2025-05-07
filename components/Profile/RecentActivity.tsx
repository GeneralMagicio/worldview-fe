"use client";

import { useAuth } from "@/context/AuthContext";
import { useUserActivities } from "@/hooks/useUserActivity";
import { UserActionDto } from "@/types/poll";
import { transformActionToPoll } from "@/utils/helpers";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PollCard from "../Poll/PollCard";
import { sendHapticFeedbackCommand } from "@/utils/animation";

interface UserActivitiesResponseDto {
  userActions: UserActionDto[];
}

interface RecentActivityProps {
  worldId?: string;
}

const POLLS_PER_PAGE = 5;

export default function RecentActivity({ worldId }: RecentActivityProps) {
  const { worldID: authWorldId } = useAuth();
  const effectiveWorldId = worldId || authWorldId;
  const router = useRouter();
  
  const { data, isLoading, error } = useUserActivities({
    worldID: effectiveWorldId || "",
  });

  const activities = data?.userActions || [];
  const displayActivities = activities.slice(0, POLLS_PER_PAGE);

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
        <NoActivitiesView isMyProfile={!worldId} />
      ) : (
        <div className="space-y-4">
          {displayActivities.map((action) => (
            <PollCard key={action.id} poll={transformActionToPoll(action)} />
          ))}
        </div>
      )}

      {activities.length > 0 && (
        <button 
          className="w-full bg-primary text-white font-medium text-lg py-3 rounded-lg mt-4 active:scale-95 active:transition-transform active:duration-100"
          onClick={() => router.push(`/${worldId ? "user" : "profile"}Activities/${effectiveWorldId}`)}
          onTouchStart={() => sendHapticFeedbackCommand()}
        >
          View all Activities
        </button>
      )}
    </div>
  );
}

function NoActivitiesView({ isMyProfile }: { isMyProfile: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg mt-16">
      <Image
        src="/illustrations/no-polls.svg"
        alt="No polls found illustration"
        width={221}
        height={150}
      />
      <p className="text-gray-900 font-medium mt-4 text-center">
        {isMyProfile ? "No activities yet. Start exploring and engage!" : "No voting activity from this user yet. Perhaps soon!"}
      </p>
    </div>
  );
}
