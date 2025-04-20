"use client";

import PollVoteCard from "@/components/Poll/PollVoteCard";
import Header from "@/components/Header";
import { useParams } from "next/navigation";

export default function PollPage() {
  const { id } = useParams();

  return (
    <main className="flex-1 bg-white rounded-t-3xl p-5">
      <Header backUrl="/polls" />
      <PollVoteCard pollId={Number(id)} />
    </main>
  );
}
