import { IPoll, IPollDetails } from "@/types/poll";
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";

interface IUsePollParams {
  page?: number;
  limit?: number;
  isActive?: boolean;
  userVoted?: boolean;
  userCreated?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface ICreatePollData {
  title: string;
  description: string;
  options: string[];
  startDate: string;
  endDate: string;
  tags: string[];
  isAnonymous?: boolean;
}

export const getPolls = (
  filters: IUsePollParams = {}
): UseQueryResult<{
  polls: IPoll[];
  total: number;
}> => {
  return useQuery({
    queryKey: ["polls", filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(filters.page || 1),
        limit: String(filters.limit || 10),
        sortBy: filters.sortBy || "endDate",
        sortOrder: filters.sortOrder || "asc",
        isActive: String(filters.isActive ?? undefined),
        userVoted: String(filters.userVoted ?? undefined),
        userCreated: String(filters.userCreated ?? undefined),
      });

      const res = await fetch(`/poll?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch polls");

      return res.json();
    },
  });
};

export const getPollDetails = (id: number): UseQueryResult<IPollDetails> => {
  return useQuery({
    queryKey: ["poll", id],
    queryFn: async () => {
      const res = await fetch(`/poll/${id}`);
      if (!res.ok) throw new Error("Failed to fetch poll details");
      return res.json();
    },
    enabled: !!id,
  });
};

export const createPoll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ICreatePollData): Promise<IPoll> => {
      const res = await fetch("/poll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create poll");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
    },
    retry: false,
  });
};

export const deletePoll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      const res = await fetch(`/poll/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to delete poll");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
    },
  });
};
