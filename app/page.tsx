'use client'

import CategoryCard from '@/components/Category/CategoryCard'
import { UserIcon } from '@/components/icon-components'
import RecentPolls from '@/components/Poll/RecentPolls'
import { FilterParams } from '@/types/poll'
import { sendHapticFeedbackCommand } from '@/utils/animation'
import Link from 'next/link'

const categories = [
  {
    id: FilterParams.All,
    title: 'Explore All',
    icon: '/categories/explore-all.svg',
  },
  {
    id: FilterParams.Trending,
    title: 'Trending Polls',
    icon: '/categories/trending-polls.svg',
  },
  {
    id: FilterParams.Recent,
    title: 'Most Recent',
    icon: '/categories/most-recent.svg',
  },
  {
    id: FilterParams.Voted,
    title: 'My Votes',
    icon: '/categories/my-votes.svg',
  },
]

export default function MainView() {
  return (
    <main className="flex-1 bg-white rounded-t-3xl p-5">
      <div className="flex justify-end mb-4">
        <Link
          className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300/90 active:scale-95 active:bg-gray-300/90 active:shadow-inner transition-none active:transition-transform active:duration-100"
          href="/profile"
          onClick={() => sendHapticFeedbackCommand()}
        >
          <UserIcon />
        </Link>
      </div>

      <h1 className="text-gray-900 text-lg font-medium leading-tight mb-6">
        Discover polls to vote on or create your own!
      </h1>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {categories.map(category => (
          <CategoryCard
            key={category.id}
            title={category.title}
            icon={category.icon}
            href={`/polls?filter=${category.id}`}
          />
        ))}
      </div>

      <RecentPolls />
    </main>
  )
}
