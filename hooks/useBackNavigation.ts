import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FilterParams } from '@/types/poll'

export function useBackNavigation() {
  const pathname = usePathname()
  const [previousPath, setPreviousPath] = useState<string>('/')

  useEffect(() => {
    // Get the initial previous path from the referrer
    const referrer = document.referrer
    if (referrer) {
      try {
        const url = new URL(referrer)
        // Only store internal navigation paths
        if (url.origin === window.location.origin) {
          setPreviousPath(url.pathname + url.search)
        }
      } catch (e) {
        // Invalid URL, ignore
      }
    }

    // Store current path in sessionStorage for tracking
    const currentPath = pathname
    const storedPreviousPath = sessionStorage.getItem('worldview-previous-path')

    if (storedPreviousPath && storedPreviousPath !== currentPath) {
      setPreviousPath(storedPreviousPath)
    }

    // Update sessionStorage with current path for next navigation
    sessionStorage.setItem('worldview-previous-path', currentPath)
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
