import BottomModal from "../ui/BottomModal";
import { Button } from "../ui/Button";

type DraftPollModalProps = {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
};

export default function DraftPollModal({
  modalOpen,
  setModalOpen,
}: DraftPollModalProps) {
  return (
    <BottomModal modalOpen={modalOpen} setModalOpen={setModalOpen}>
      <h2 className="text-2xl font-semibold text-center text-gray-900 mb-8 text-sora">
        Unsaved changes
      </h2>
      <p className="text-center text-gray-700 mb-8 text-sora">
        Do you want to save your poll as a draft? You can return and finish it
        up later.
      </p>
      <div className="flex flex-col gap-4 justify-center">
        <Button className="text-sm font-semibold font-sora">
          Save as Draft
        </Button>
        <Button
          variant="ghost"
          className="text-sm font-semibold font-sora text-gray-500"
        >
          Delete
        </Button>
      </div>
    </BottomModal>
  );
}
