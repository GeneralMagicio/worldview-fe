'use client'

import Header from '@/components/Header'
import ProfileInfo from '@/components/Profile/ProfileInfo'
import RecentActivity from '@/components/Profile/RecentActivity'
import { useParams } from 'next/navigation'

export default function UserProfilePage() {
  const { worldId } = useParams()
  const userWorldId = Array.isArray(worldId) ? worldId[0] : (worldId as string)

  return (
    <main className="flex-1 bg-white rounded-t-3xl p-5">
      <Header backUrl="/polls" title="User Profile" />
      <ProfileInfo worldId={userWorldId} />
      <RecentActivity worldId={userWorldId} />
    </main>
  )
}
