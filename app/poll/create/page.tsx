import PollForm from "@/components/Poll/PollForm";
import Header from "@/components/Header";

export default function CreatePollPage() {
  return (
    <main className="flex-1 bg-white rounded-t-3xl p-5">
      <Header title="Create a Poll" />
      <PollForm />
    </main>
  );
}
