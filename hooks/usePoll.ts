import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface UsePollParams {
  page?: number;
  limit?: number;
  isActive?: boolean;
  userVoted?: boolean;
  userCreated?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const usePoll = () => {
  const queryClient = useQueryClient();

  const getPolls = (filters: UsePollParams = {}) => {
    return useQuery({
      queryKey: ["polls", filters],
      queryFn: async () => {
        const params = new URLSearchParams({
          page: String(filters.page || 1),
          limit: String(filters.limit || 10),
          sortBy: filters.sortBy || "endDate",
          sortOrder: filters.sortOrder || "asc",
        });

        if (filters.isActive !== undefined)
          params.append("isActive", String(filters.isActive));
        if (filters.userVoted !== undefined)
          params.append("userVoted", String(filters.userVoted));
        if (filters.userCreated !== undefined)
          params.append("userCreated", String(filters.userCreated));

        const res = await fetch(`/poll?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch polls");

        const data = await res.json();
        return data.polls;
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
    mutationFn: async (data: any) => {
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
    mutationFn: async ({ id, body }: { id: number; body: any }) => {
      const res = await fetch(`/poll/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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
