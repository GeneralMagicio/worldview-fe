'use client' // Required for Next.js

import { MiniKit } from '@worldcoin/minikit-js'
import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    MiniKit.install()

    if (!MiniKit.isInstalled()) {
      router.push('/error')
    }
  }, [])

  return <>{children}</>
}
