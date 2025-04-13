import PollVoteCard from "@/components/poll/PollVoteCard";
import Header from "@/components/Header";

export default function PollPage() {

  return (
    <main>
      <div className="flex-1 bg-white rounded-t-3xl p-5">
        <Header />
        <PollVoteCard />
      </div>
    </main>
  );
}
