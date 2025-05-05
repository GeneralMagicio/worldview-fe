"use client";

import Header from "@/components/Header";
import PollForm from "@/components/Poll/PollForm";
import { usePollForm } from "@/hooks/usePollForm";

export default function CreatePollPage() {
  return <CreatePollPageContent />;
}

function CreatePollPageContent() {
  const { handleBackNavigation } = usePollForm();

  return (
    <main className="flex-1 bg-white rounded-t-3xl p-5">
      <Header 
        title="Create a Poll" 
        isCreatePoll={true} 
        onBackClick={handleBackNavigation}
      />
      <PollForm />
    </main>
  );
}
