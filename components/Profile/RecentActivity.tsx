import PollCard from "../Poll/PollCard";

const mockPolls = [
  {
    authorUserId: 1,
    creationDate: "2021-01-01",
    description: "This is a description of the poll",
    endDate: "2021-01-01",
    isAnonymous: false,
    options: ["Option 1", "Option 2"],
    participantCount: 10,
    pollId: 1,
    startDate: "2021-01-01",
    tags: ["Tag 1", "Tag 2"],
    title: "What is the best way to learn React?",
    voteResults: [
      {
        optionId: 1,
        voteCount: 10,
      },
      {
        optionId: 2,
        voteCount: 20,
      },
    ],
  },
  {
    authorUserId: 2,
    creationDate: "2021-01-01",
    description: "This is a description of the poll",
    endDate: "2021-01-01",
    isAnonymous: false,
    options: ["Option 1", "Option 2"],
    participantCount: 10,
    pollId: 2,
    startDate: "2021-01-01",
    tags: ["Tag 1", "Tag 2"],
    title: "What is the best way to learn React?",
    voteResults: [
      {
        optionId: 1,
        voteCount: 10,
      },
    ],
  },
];

export default function RecentActivity() {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-medium mb-4 text-primary">Recent Activity</h3>

      <div className="space-y-4">
        {mockPolls.map((poll) => (
          <PollCard key={poll.pollId} poll={poll} />
        ))}
      </div>

      <button className="w-full bg-primary text-white font-medium text-lg py-3 rounded-lg mt-4">
        View all Activities
      </button>
    </div>
  );
}
