import { Card } from '@/src/components/Card'
import { Button } from '@/src/components/Elements/Button'
import React from 'react'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Slide } from '@/src/components/Viewer/Slide'
import { useBoundStore } from '@/src/lib/store/store'
import { useTranslation } from '@/src/app/i18n/client'
import { StoryStepSuggestion } from '@prisma/client'

type Props = {
  stepSuggestion: StoryStepSuggestion
  handleReject: (stepSuggestion: StoryStepSuggestion) => void
  handleAccept: (stepSuggestion: StoryStepSuggestion) => void
  loading: boolean
}

export default function StepSuggestionCard({
  stepSuggestion,
  handleReject,
  handleAccept,
  loading,
}: Props) {
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, 'stepSuggestions')

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          <Card.Description>
            <div className="flex flex-col">
              {stepSuggestion.timestamp && (
                <div>
                  {t('date')}: {stepSuggestion.timestamp.toLocaleString()}
                </div>
              )}

              <div>
                {t('position')}: {stepSuggestion.position}
              </div>

              {stepSuggestion.tags.length > 0 && (
                <span>Tags: {stepSuggestion.tags.join(', ')}</span>
              )}
            </div>
          </Card.Description>
        </Card.Title>
      </Card.Header>
      <Card.Content>
        <div>
          <Slide step={stepSuggestion} />
        </div>
      </Card.Content>
      <Card.Footer>
        <div className="flex items-center justify-between">
          <Button
            onClick={() => handleReject(stepSuggestion)}
            startIcon={<XMarkIcon className="w-5" />}
            variant={'danger'}
          >
            {t('reject')}
          </Button>
          <Button
            disabled={loading}
            onClick={() => handleAccept(stepSuggestion)}
            startIcon={
              loading ? (
                <svg
                  className="... mr-3 h-5 w-5 animate-spin"
                  viewBox="0 0 24 24"
                ></svg>
              ) : (
                <CheckIcon className="w-5" />
              )
            }
          >
            {loading ? t('loading') : t('accept')}
          </Button>
        </div>
      </Card.Footer>
    </Card>
  )
}
