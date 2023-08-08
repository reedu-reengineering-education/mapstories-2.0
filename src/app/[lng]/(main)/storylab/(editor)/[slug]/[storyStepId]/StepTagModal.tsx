'use client'

import { useState } from 'react'
import { Modal } from '@/src/components/Modal'

import React from 'react'
// import { useUIStore } from '@/src/lib/store/ui'
import { Button } from '@/src/components/Elements/Button'
import { Input } from '@/src/components/Elements/Input'
import { PlusIcon } from '@heroicons/react/24/outline'
import { TagBadge } from '@/src/components/Studio/Mapstories/TagBadge'
import useStep from '@/src/lib/api/step/useStep'
import { toast } from '@/src/lib/toast'
type Props = {
  trigger: React.ReactElement
  storyStepId: string
  tags?: Array<string>
}

export default function StepTagModal({ trigger, storyStepId, tags }: Props) {
  const [inputValue, setInputValue] = useState('')
  const [tagsTmp, setTagsTmp] = useState<string[]>(tags || [])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const { updateStep } = useStep(storyStepId)

  const onSave = async () => {
    setLoading(true)
    setOpen(false)
    // add the tag list to the slide
    try {
      const newSlide = await updateStep({
        tags: tagsTmp,
      })
      toast({
        message: 'Tags updated',
        type: 'success',
      })
    } catch (e) {
      console.log(e)
      toast({
        message: 'Something went wrong',
        type: 'error',
      })
    }

    setLoading(false)
  }

  return (
    <>
      <Modal
        onOpenChange={setOpen}
        open={open}
        title={'Set tag'}
        trigger={trigger}
      >
        <Modal.Content className="flex flex-col gap-2">
          <div className="flex flex-row justify-center gap-2">
            <Input
              label="Tag"
              onChange={e => setInputValue(e.target.value)}
              placeholder="Tag"
              value={inputValue}
            />
            <Button
              onClick={() => setTagsTmp([...tagsTmp, inputValue])}
              variant={'inverse'}
            >
              <PlusIcon className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex flex-row flex-wrap gap-2">
            {tagsTmp?.map((tag, index) => (
              <TagBadge key={index} tagName={tag} />
            ))}
          </div>
        </Modal.Content>

        <Modal.Footer>
          <div className="flex flex-row-reverse">
            <Button
              disabled={loading}
              isLoading={loading}
              onClick={() => onSave()}
            >
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
}
