import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FilterParams } from '@/types/poll'

export function useBackNavigation() {
  const pathname = usePathname()
  const [previousPath, setPreviousPath] = useState<string>('/')

  useEffect(() => {
    // Store the current path before it changes
    const handleRouteChange = () => {
      // Always store the previous path, including /poll/create
      setPreviousPath(pathname)
    }

    // Add event listener for route changes
    window.addEventListener('popstate', handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [pathname])

  const getBackUrl = () => {
    // Return the previous path if it's a user-related or polls page
    if (
      previousPath.startsWith('/user/') ||
      previousPath.startsWith('/userActivities/') ||
      previousPath.startsWith('/profileActivities/') ||
      previousPath.startsWith('/polls')
    ) {
      return previousPath
    }

    // Default to all polls page
    return `/polls?filter=${FilterParams.All}`
  }

  return {
    backUrl: getBackUrl(),
  }
}
