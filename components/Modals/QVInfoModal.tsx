import Image from 'next/image'
import { sendHapticFeedbackCommand } from '@/utils/animation'
interface IModalProps {
  setShowModal: (showModal: boolean) => void
}

export default function QVInfoModal({ setShowModal }: IModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden">
        <div className="p-6">
          <div className="rounded-xl overflow-hidden mb-6">
            <Image
              src="/illustrations/cosmic-cubes-tokens.svg"
              alt="Quadratic Voting Illustration"
              width={299}
              height={200}
              className="w-full"
            />
          </div>

          <h2 className="text-gray-900 text-xl font-medium mb-4 text-center">
            WorldView uses Quadratic Voting
          </h2>

          <p className="text-gray-700 text-center mb-6">
            Quadratic Voting helps keep things fair by making sure no one person
            or group can control the outcome, even if they have a lot of voting
            power.
          </p>

          <p className="text-gray-700 text-center mb-8">
            The more votes you give to a single option, the more it costs. Each
            extra vote costs more than the last, so it's harder to dominate the
            results with just one strong opinion.
          </p>

          <button
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold font-sora"
            onClick={() => {
              sendHapticFeedbackCommand()
              setShowModal(false)
            }}
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  )
}
