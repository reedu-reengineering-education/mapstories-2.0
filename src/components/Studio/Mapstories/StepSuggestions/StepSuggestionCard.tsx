import { Card } from '@/src/components/Card'
import React from 'react'
import { Slide } from '@/src/components/Viewer/Slide'
import { useBoundStore } from '@/src/lib/store/store'
import { StoryStepSuggestion } from '@prisma/client'

type Props = {
  stepSuggestion: StoryStepSuggestion
}

export default function StepSuggestionCard({ stepSuggestion }: Props) {
  const lng = useBoundStore(state => state.language)

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          <Card.Description>
            <div className="flex max-h-[400px] flex-col overflow-scroll">
              {stepSuggestion.timestamp && (
                <div>Date: {stepSuggestion.timestamp.toLocaleString()}</div>
              )}

              <div>
                Position: {stepSuggestion.position} <br></br>
                Lat : {stepSuggestion.feature.geometry.coordinates[0]} <br></br>
                Lng : {stepSuggestion.feature.geometry.coordinates[1]}
              </div>

              {stepSuggestion.tags && stepSuggestion.tags.length > 0 && (
                <span>Tags: {stepSuggestion.tags.join(', ')}</span>
              )}
            </div>
          </Card.Description>
        </Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="max-h-[400px] overflow-scroll">
          <Slide step={stepSuggestion} />
        </div>
      </Card.Content>
    </Card>
  )
}
