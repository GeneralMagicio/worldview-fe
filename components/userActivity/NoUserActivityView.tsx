import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NoUserActivityView() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center px-6 pt-16">
      <div className="mb-10 relative">
        <Image
          src="/illustrations/no-polls.svg"
          alt="No user activity"
          width={221}
          height={150}
        />
      </div>
      <h2 className="text-xl text-gray-900 font-medium mb-2 text-center">No corresponding activities to show for this user</h2>
    </div>
  );
}
