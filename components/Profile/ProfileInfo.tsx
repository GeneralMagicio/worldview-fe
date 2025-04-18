import UserIcon from "../icon-components/UserIcon";

export default function ProfileInfo() {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-3">
        <UserIcon size={32} />
      </div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 font-sora">@ayaz.0396</h2>

      <div className="relative flex w-full justify-around border-y border-gray-200 py-4">
        <div className="text-center flex-1">
          <p className="text-gray-900 text-sm">Created</p>
          <p className="text-2xl font-semibold text-primary font-sora">90</p>
        </div>

        <div className="absolute top-4 bottom-4 left-1/2 w-px bg-gray-200" />

        <div className="text-center flex-1">
          <p className="text-gray-900 text-sm">Participated</p>
          <p className="text-2xl font-semibold text-primary font-sora">2.5k</p>
        </div>
      </div>
    </div>
  );
}
