import Link from "next/link";
import { ArrowLeft, PlusIcon } from "./icon-components";

export default function Header() {
  return (
    <div className="flex items-center justify-between mt-2 mb-8">
      <Link
        className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center"
        href="/"
      >
        <ArrowLeft />
      </Link>
      <h1 className="text-2xl font-bold text-[#191c20]">All Polls</h1>
      <Link
        className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center"
        href="/create-poll"
      >
        <PlusIcon color="#3C424B" />
      </Link>
    </div>
  );
}
