'use client'

import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/context/AuthContext'
import UserIcon from '../icon-components/UserIcon'

interface UserData {
  pollsCreated: number
  pollsParticipated: number
  worldID: string
  worldProfilePic?: string
  name?: string
}

interface ProfileInfoProps {
  worldId?: string
}

export default function ProfileInfo({ worldId }: ProfileInfoProps) {
  const { worldID: authWorldId } = useAuth()
  const effectiveWorldId = worldId || authWorldId

  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user', 'profile', effectiveWorldId],
    queryFn: async () => {
      const res = await fetch(`/user/getUserData?worldID=${effectiveWorldId}`)
      if (!res.ok) throw new Error('Failed to fetch user data')
      return (await res.json()) as UserData
    },
    enabled: !!effectiveWorldId,
  })

  return (
    <div className="flex flex-col items-center mb-8">
      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-3">
        <UserIcon size={32} />
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading profile...</p>
      ) : error ? (
        <p className="text-red-500 text-sm">
          {(error as Error).message || 'An error occurred'}
        </p>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 font-sora">
            {userData?.name ? `@${userData?.name}` : 'Anon'}
          </h2>

          <div className="relative flex w-full justify-around border-y border-gray-200 py-4">
            <div className="text-center flex-1">
              <p className="text-gray-900 text-sm">Created</p>
              <p className="text-2xl font-semibold text-primary font-sora">
                {userData?.pollsCreated || 0}
              </p>
            </div>

            <div className="absolute top-4 bottom-4 left-1/2 w-px bg-gray-200" />

            <div className="text-center flex-1">
              <p className="text-gray-900 text-sm">Participated</p>
              <p className="text-2xl font-semibold text-primary font-sora">
                {userData?.pollsParticipated || 0}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
