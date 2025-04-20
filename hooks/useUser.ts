import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";

const RequestErrorMap = {
  401: "unauthorized",
  403: "forbidden",
  404: "not_found",
};

const MAX_RETRIES = 3;

type RequestError = keyof typeof RequestErrorMap;

interface IUser {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// Define additional interfaces based on your DTOs
interface UserData extends IUser {
  // Add any additional fields returned by getUserData
}

interface UserActivity {
  id: string;
  userId: string;
  activityType: string;
  timestamp: string;
}

interface UserVote {
  id: string;
  userId: string;
  pollId: string;
  optionId: string;
  createdAt: string;
  updatedAt: string;
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

export const useUser = () => {
  const queryClient = useQueryClient();

  const getUserData = (): UseQueryResult<UserData> => {
    return useQuery({
      queryKey: ["user", "data"],
      queryFn: async () => {
        const res = await fetch("/user/getUserData");
        if (!res.ok) throw new Error("Failed to fetch user data");

        return res.json();
      },
    });
  };

  const getUserActivities = ({
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

  const getUserVotes = (
    pollId: number
  ): UseQueryResult<IGetUserVotesResponse> => {
    return useQuery({
      queryKey: ["user", "votes", pollId],
      queryFn: async () => {
        const urlParams = new URLSearchParams({
          pollId: String(pollId),
        });

        const res = await fetch(`/user/getUserVotes?${urlParams.toString()}`);

        if (!res.ok) {
          if (RequestErrorMap[res.status as RequestError]) {
            throw new Error(RequestErrorMap[res.status as RequestError]);
          } else {
            throw new Error("Failed to fetch user votes");
          }
        }
        return res.json();
      },
      staleTime: 0,
      retry: (failureCount, error) => {
        if (Object.values(RequestErrorMap).includes(error.message)) {
          return false;
        }

        if (failureCount >= MAX_RETRIES) return false;

        return true;
      },
    });
  };

  const setVote = () => {
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
          queryKey: ["user", "votes", variables.pollId],
        });
        queryClient.invalidateQueries({
          queryKey: ["user", "votes", undefined, variables.pollId],
        });
      },
    });
  };

  const editVote = () => {
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

  return {
    getUserData,
    getUserActivities,
    getUserVotes,
    setVote,
    editVote,
  };
};
