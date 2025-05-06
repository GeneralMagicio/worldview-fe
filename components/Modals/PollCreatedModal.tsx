import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShareIcon } from "../icon-components";
import { handleSharePoll } from "@/utils/share";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { sendHapticFeedbackCommand } from "@/utils/animation";

interface IModalProps {
  open: boolean;
  pollTitle: string;
  pollId: number | undefined;
}

export default function PollCreatedModal({
  open,
  pollTitle,
  pollId,
}: IModalProps) {
  const router = useRouter();

  return (
    <Modal open={open} className="p-0 rounded-xl max-w-md">
      <div className="p-6">
        <div className="rounded-xl overflow-hidden my-6">
          <Image
            src="/illustrations/poll-created.svg"
            alt="Poll Created Illustration"
            width={143}
            height={144}
            className="mx-auto"
          />
        </div>

        <h2 className="text-gray-900 text-2xl font-bold mb-4 text-center">
          Poll Published!
        </h2>

        <p className="text-gray-500 text-center mb-8">
          Spread the word to gather votes.
        </p>

        <Button
          variant="primary"
          className="w-full flex items-center justify-center gap-2 font-medium active:scale-95 active:transition-transform active:duration-100"
          onClick={() => {
            sendHapticFeedbackCommand();
            handleSharePoll(pollTitle, pollId!);
          }}
        >
          <ShareIcon size={24} color="white" />
          Share this Poll
        </Button>

        <Button
          variant="outline"
          className="w-full text-gray-500 font-medium mt-4 py-3 active:scale-95 active:transition-transform active:duration-100"
          onClick={() => {
            router.push(`/poll/${pollId}`);
          }}
          onTouchStart={() => sendHapticFeedbackCommand()}
        >
          View Poll
        </Button>
      </div>
    </Modal>
  );
}
