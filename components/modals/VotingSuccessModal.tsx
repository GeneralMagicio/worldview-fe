import Image from "next/image";
import { ShareIcon } from "../icon-components";
import { handleShare } from "@/utils/share";

interface IModalProps {
  setShowModal: (showModal: boolean) => void;
  pollTitle: string;
  pollId: number;
}

export default function VotingSuccessModal({
  setShowModal,
  pollTitle,
  pollId,
}: IModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden">
        <div className="p-6">
          <div className="rounded-xl overflow-hidden mb-6">
            <Image
              src="/illustrations/voting-success.svg"
              alt="Voting Success Illustration"
              width={313}
              height={210}
              className="w-full"
            />
          </div>

          <h2 className="text-gray-900 text-2xl font-bold mb-4 text-center">
            Success!
          </h2>

          <p className="text-gray-500 text-center mb-6">
            Your vote is in. Spread the word!
          </p>

          <button
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold font-sora"
            onClick={() => setShowModal(false)}
          >
            Done
          </button>

          <button
            className="w-full flex items-center justify-center gap-2 text-gray-500 py-4 rounded-xl font-semibold font-sora"
            onClick={() => handleShare(pollTitle, pollId)}
          >
            <ShareIcon size={24} />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
