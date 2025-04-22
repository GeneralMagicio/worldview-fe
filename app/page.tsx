import Link from "next/link";
import { UserIcon, PlusIcon } from "@/components/icon-components";
import CategoryCard from "@/components/Category/CategoryCard";
import RecentPolls from "@/components/Poll/RecentPolls";

export default function MainView() {
  return (
    <main className="flex-1 bg-white rounded-t-3xl p-5">
      <div className="flex justify-end mb-4">
        <Link
          className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center"
          href="/profile"
        >
          <UserIcon />
        </Link>
      </div>

      <h1 className="text-gray-900 text-lg font-medium leading-tight mb-6">
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

      <RecentPolls />
    </main>
  );
}
