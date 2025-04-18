import PollVoteCard from "@/components/Poll/PollVoteCard";
import Header from "@/components/Header";

export default function PollPage() {
  return (
    <main className="flex-1 bg-white rounded-t-3xl p-5">
      <Header backUrl="/polls" />
      <PollVoteCard />
    </main>
  );
}
