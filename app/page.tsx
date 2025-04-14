import Link from "next/link";
import { UserIcon, PlusIcon } from "@/components/icon-components";
import CategoryCard from "@/components/category/CategoryCard";
import RecentPolls from "@/components/Poll/RecentPolls";

export default function MainView() {
  return (
    <main className="flex-1 bg-white rounded-t-3xl p-5">
      <div className="flex justify-end mb-4">
        <button className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
          <UserIcon />
        </button>
      </div>

      <h1 className="text-gray-900 text-xl font-medium leading-tight mb-6">
        Discover polls to vote on or create your own!
      </h1>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <CategoryCard title="Explore All" icon="/categories/explore-all.svg" />
        <CategoryCard
          title="Trending Polls"
          icon="/categories/trending-polls.svg"
        />
        <CategoryCard title="Most Recent" icon="/categories/most-recent.svg" />
        <CategoryCard title="My Votes" icon="/categories/my-votes.svg" />
      </div>

      {/* Polls */}
      <RecentPolls />

      {/* Bottom Buttons */}
      <Link
        className="w-full py-3 bg-gray-300 text-primary font-medium rounded-lg flex items-center justify-center mb-8 border border-gray-300"
        href="/polls"
      >
        Explore all
      </Link>
      <Link
        className="w-full py-3 bg-primary text-white text-lg font-medium rounded-lg flex items-center justify-center gap-2"
        href="/polls/create"
      >
        <PlusIcon />
        Create a New Poll
      </Link>
    </main>
  );
}
