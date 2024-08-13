import useStory from '@/src/lib/api/story/useStory'
import React, { useEffect, useState } from 'react'
import { SlideContent } from '@prisma/client'
import DraggableList from '../../DraggableList'
import { SlideContentListEditItem } from '../../Studio/Mapstories/SlideContentListEditItem'
import { Button } from '../../Elements/Button'
import { PlusIcon } from '@radix-ui/react-icons'
import { toast } from '@/src/lib/toast'
import { CheckIcon } from '@heroicons/react/24/outline'
type Props = {
    storyId: string
    stepId: string
    setContentType: any
    setIsOpen: any
    stepSuggestion:any
    setStepSuggestion?: any
}

export default function ShowStepWithContents({ storyId, stepId, setContentType, setIsOpen, stepSuggestion, setStepSuggestion}: Props) {
    const { story } = useStory(storyId)
    const [content, setContent] = useState<SlideContent[]>();
    const { addStepSuggestion } = useStory(storyId);



    useEffect(() => {
        if (!stepSuggestion?.content) {
            return
        }
        // @ts-ignore
        setContent(stepSuggestion.content.sort((a, b) => a.position - b.position))
    } , [story])

    useEffect(() => {
        setContent(stepSuggestion?.content)
    } , [stepSuggestion])

    const handleConfirmClick = async () => {
        setContentType('')
        setIsOpen(false)
        setContent([])
        const newStep = await addStepSuggestion(stepSuggestion)
        // create step suggestion
        // add content to step suggestion
        toast({
            message: 'Step confirmed, waiting for approval',
            type: 'success',
          })
            }

    return (
        <div>
            { content && content.length > 0 && (
                <DraggableList
                    items={
                        content?.map((stepItem,index) => ({
                            id: index,
                            s: stepItem,
                            component: (
                                <SlideContentListEditItem
                                    stepItem={stepItem}
                                ></SlideContentListEditItem>
                            )
                        }))
                    }
                />
            )}
            <div className='flex flex-col gap-4'>
            <Button
                className="w-full"
                onClick={() => setContentType('addContent')}
                startIcon={<PlusIcon className="h-5"></PlusIcon>}
                variant={'inverse'}
              >
                Add Content
              </Button>
              <Button
                className="w-full"
                onClick={() => handleConfirmClick()}
                startIcon={<CheckIcon className="h-5"></CheckIcon>}
                variant={'primary'}
              >
                Confirm Step
              </Button>
              </div>
        </div>
    )
}