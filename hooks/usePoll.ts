import { IPoll } from "@/types/poll";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

export const usePoll = () => {
  const queryClient = useQueryClient();

  const getPolls = (filters: IUsePollParams = {}) => {
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

        const data = await res.json();
        console.log(data);
        return data;
      },
    });
  };

  const getPollDetails = (id: number) => {
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

  const createPoll = useMutation({
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
  });

  const deletePoll = useMutation({
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

  return {
    getPolls,
    getPollDetails,
    createPoll,
    deletePoll,
  };
};
