"use client";

import Link from "next/link";
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
  return (
    <div className="flex items-center justify-between mt-2 mb-8">
      <Link
        className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"
        href={backUrl}
      >
        <ArrowLeft />
      </Link>
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
