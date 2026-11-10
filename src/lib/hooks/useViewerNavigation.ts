'use client'

import { useCallback } from 'react'
import { navigateToStep } from '@/src/lib/viewerNavigation'

interface UseViewerNavigationProps {
  slug: string[]
  totalSteps: number
}

export function useViewerNavigation({ slug, totalSteps }: UseViewerNavigationProps) {
  const currentStep = parseInt(slug[1])

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      navigateToStep(currentStep - 1)
    }
  }, [currentStep])

  const nextStep = useCallback(() => {
    if (currentStep + 1 < totalSteps) {
      navigateToStep(currentStep + 1)
    }
  }, [currentStep, totalSteps])

  const canGoPrev = currentStep > 0
  const canGoNext = currentStep + 1 < totalSteps

  return {
    prevStep,
    nextStep,
    canGoPrev,
    canGoNext,
  }
}
