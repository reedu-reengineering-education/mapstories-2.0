'use client'

import { useState } from 'react'
import { Modal } from '@/src/components/Modal'

import React from 'react'
// import { useUIStore } from '@/src/lib/store/ui'
import { Button } from '@/src/components/Elements/Button'
import { Input } from '@/src/components/Elements/Input'
import { PlusIcon } from '@heroicons/react/24/outline'
import { TagBadge } from '@/src/components/Studio/Mapstories/TagBadge'
type Props = {
  trigger: React.ReactElement
  storyStepId: string
  defaultDate?: Date
}

export default function StepTagModal({
  trigger,
  storyStepId,
  defaultDate,
}: Props) {
  const [inputValue, setInputValue] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

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
              onClick={() => setTags([...tags, inputValue])}
              variant={'inverse'}
            >
              <PlusIcon className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex flex-row flex-wrap gap-2">
            {tags.map((tag, index) => (
              <TagBadge key={index} tagName={tag} />
            ))}
          </div>
        </Modal.Content>

        <Modal.Footer>
          <div className="flex flex-row-reverse">
            <Button disabled={saving} isLoading={saving} type="submit">
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
}
