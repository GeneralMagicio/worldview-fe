import { useQuery } from "@tanstack/react-query";

export const usePolls = () => {
  return useQuery({
    queryKey: ["polls"],
    queryFn: async () => {
      const res = await fetch("/poll");
      if (!res.ok) throw new Error("Failed to fetch polls");
      const data = await res.json();
      return data.polls;
    },
  });
};
