import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FilterParams } from '@/types/poll'

export function useBackNavigation() {
  const pathname = usePathname()
  const [backUrl, setBackUrl] = useState<string>('/polls')

  useEffect(() => {
    // Check if user came from poll create page
    const cameFromCreate = sessionStorage.getItem('worldview-came-from-create')

    if (cameFromCreate === 'true') {
      // User came from poll create, redirect to all polls
      setBackUrl(`/polls?filter=${FilterParams.All}`)
      // Clear the flag after use
      sessionStorage.removeItem('worldview-came-from-create')
    } else {
      // Normal navigation, let browser handle back (return null to use browser's back)
      setBackUrl('/polls') // fallback for direct access
    }
  }, [pathname])

  return {
    backUrl,
  }
}
