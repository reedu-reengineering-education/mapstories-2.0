'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCallback } from 'react'

interface UseViewerNavigationProps {
  slug: string[]
  totalSteps: number
}

export function useViewerNavigation({ slug, totalSteps }: UseViewerNavigationProps) {
  const router = useRouter()
  const path = usePathname()

  const getBasePath = useCallback(() => {
    return path?.split('/').splice(2, 3).join('/') ?? 'gallery/all/story/'
  }, [path])

  const prevStep = useCallback(() => {
    const basePath = getBasePath()
    const currentStep = parseInt(slug[1])

    if (currentStep > 0) {
      router.push(`${basePath}/${slug[0]}/${currentStep - 1}`)
    }
  }, [slug, router, getBasePath])

  const nextStep = useCallback(() => {
    const basePath = getBasePath()
    const currentStep = parseInt(slug[1])

    if (currentStep + 1 < totalSteps) {
      router.push(`${basePath}/${slug[0]}/${currentStep + 1}`)
    }
  }, [slug, router, getBasePath, totalSteps])

  const canGoPrev = parseInt(slug[1]) > 0
  const canGoNext = parseInt(slug[1]) + 1 < totalSteps

  return {
    prevStep,
    nextStep,
    canGoPrev,
    canGoNext,
  }
}
