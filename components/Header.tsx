"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, PlusIcon, MoreVertical } from "./icon-components";

interface IHeaderProps {
  backUrl?: string;
  title?: string;
  isCreatePoll?: boolean;
}

export default function Header({
  backUrl = "/",
  title = "All Polls",
  isCreatePoll = false,
}: IHeaderProps) {
  const router = useRouter();

  const goBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(backUrl);
    }
  };

  return (
    <div className="flex items-center justify-between mt-2 mb-8">
      <button
        className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"
        onClick={goBack}
      >
        <ArrowLeft />
      </button>
      <h1 className="text-xl font-medium text-gray-900">{title}</h1>
      {isCreatePoll ? (
        <button
          className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"
          onClick={() => {
            console.log("More");
          }}
        >
          <MoreVertical />
        </button>
      ) : (
        <Link
          className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"
          href="/poll/create"
        >
          <PlusIcon color="#3C424B" />
        </Link>
      )}
    </div>
  );
}
