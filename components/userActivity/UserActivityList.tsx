'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import FilterBar from '../FilterBar'
import PollCard from '../Poll/PollCard'
import { LoadingPolls } from '../Poll/PollList'
import { Toaster } from '../Toaster'
import NoUserActivityView from './NoUserActivityView'
import { useToast } from '@/hooks/useToast'
import { useUserActivities } from '@/hooks/useUserActivity'
import { IPollFilters, UserActionDto } from '@/types/poll'
import { transformActionToPoll } from '@/utils/helpers'

interface UserActivityListProps {
  filters: IPollFilters
  setFiltersOpen: (open: boolean) => void
}

export default function UserActivityList({
  filters,
  setFiltersOpen,
}: UserActivityListProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const { worldId } = useParams()
  const userWorldId = Array.isArray(worldId) ? worldId[0] : (worldId as string)

  const {
    data: userActivitiesData,
    isLoading,
    error,
  } = useUserActivities({
    worldID: userWorldId,
    isActive: filters.livePolls,
    isInactive: filters.finishedPolls,
    isCreated: filters.pollsCreated,
    isParticipated: filters.pollsVoted,
    search: searchTerm || undefined,
  })

  const userActions = userActivitiesData?.userActions || []

  const showErrorToast = () => {
    toast({
      description: 'Error loading user activities. Please try again!',
      duration: 5 * 60 * 1000,
    })
  }

  useEffect(() => {
    if (error) showErrorToast()
  }, [error])

  return (
    <section aria-label="Poll list" className="mb-6">
      <FilterBar
        setFiltersOpen={setFiltersOpen}
        onSearch={handleSearch}
        initialSearchTerm={searchTerm}
      />
      {renderContent()}
      <Toaster />
    </section>
  )

  function renderContent() {
    if (isLoading || error) {
      return <LoadingPolls />
    }

    if (!userActions || userActions.length === 0) {
      return <NoUserActivityView />
    }

    return (
      <div className="space-y-4">
        {userActions.map((userAction: UserActionDto) => (
          <PollCard
            key={userAction.pollId}
            poll={transformActionToPoll(userAction)}
          />
        ))}
      </div>
    )
  }
}
