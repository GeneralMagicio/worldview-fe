import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";

const MAX_RETRIES = 2;

interface IUser {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface UserActivity {
  id: string;
  userId: string;
  activityType: string;
  timestamp: string;
}

interface SetVoteParams {
  pollId: string;
  weightDistribution: Record<string, number>;
}

interface IGetUserVotesResponse {
  options: string[];
  votingPower: number;
  weightDistribution: Record<string, number>;
}

export const getUserData = (): UseQueryResult<IUser> => {
  return useQuery({
    queryKey: ["user", "data"],
    queryFn: async () => {
      const res = await fetch("/user/getUserData");
      if (!res.ok) throw new Error("Failed to fetch user data");

      return res.json();
    },
  });
};

export const getUserActivities = ({
  filter,
  search,
}: {
  filter: "active" | "inactive" | "created" | "participated";
  search: string;
}): UseQueryResult<{
  activities: UserActivity[];
  total: number;
}> => {
  return useQuery({
    queryKey: ["user", "activities", filter, search],
    queryFn: async () => {
      const urlParams = new URLSearchParams({
        filter,
        search,
      });

      const res = await fetch(
        `/user/getUserActivities?${urlParams.toString()}`
      );
      if (!res.ok) throw new Error("Failed to fetch user activities");
      return res.json();
    },
  });
};

export const getUserVotes = (
  pollId: number
): UseQueryResult<IGetUserVotesResponse> => {
  return useQuery({
    queryKey: ["user", "votes", pollId],
    queryFn: async () => {
      const urlParams = new URLSearchParams({
        pollId: String(pollId),
      });

      const res = await fetch(`/user/getUserVotes?${urlParams.toString()}`);

      if (!res.ok) throw new Error("Failed to fetch user votes");

      return res.json();
    },
    staleTime: 0,
    retry: (failureCount) => {
      if (failureCount >= MAX_RETRIES) return false;

      return true;
    },
  });
};

export const setVote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: SetVoteParams) => {
      const res = await fetch("/user/setVote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!res.ok) throw new Error("Failed to set vote");
      return res.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["poll", variables.pollId],
      });
      queryClient.invalidateQueries({
        queryKey: ["poll", variables.pollId],
      });
    },
  });
};

export const editVote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: SetVoteParams) => {
      const res = await fetch("/user/editVote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!res.ok) throw new Error("Failed to edit vote");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "votes"] });
    },
  });
};
