'use client'
import { Button } from '../../Elements/Button'
import { useEffect, useState } from 'react'
import { Modal } from '../../Modal'
import useStory from '@/src/lib/api/story/useStory'
// @ts-ignore

import { toast } from '@/src/lib/toast'

import { urlToMedia } from '@/src/helper/urlToMedia'
import { generateRandomName } from '@/src/helper/generateRandomName'
import useMedia from '@/src/lib/api/media/useMedia'
import { uploadFile } from '@/src/helper/uploadFile'
import ContentSwitcher from './ContentSwitcher'

// Props type definition
type Props = {
  story: any
  slug: string
  size?: 'xs' | 's' | 'm'
}

// Main component
export default function AddCommunityStep({ story, slug, size }: Props) {
  const { createStoryStepSuggestion } = useStory(story.id)
  const { addMedia } = useMedia()
  const [isOpen, setIsOpen] = useState(false)
  const [stepSuggestion, setStepSuggestion] = useState<any>({
    position: parseInt(slug) + 1,
    feature: null, // Add the missing 'feature' property
    viewport: null, // Add the missing 'viewport' property
    timestamp: story.mode === 'TIMELINE' ? new Date() : null,
    tags: [], // Add the missing 'tags' property
    status: 'PENDING', // Add the missing 'status' property
    content: [
      {
        type: 'TITLE',
        content: 'Deine Überschrift',
        position: 0,
        suggestionId: null,
      },
    ],
  })
  const [contentType, setContentType] = useState<string>('')
  const [date, setDate] = useState<Date | null>(new Date())

  const [text, setText] = useState<string>('')
  const [source, setSource] = useState<string>('')
  const [url, setUrl] = useState<string>('')
  const [file, setFile] = useState<File>()

  useEffect(() => {
    console.log(story)
  }, [])

  const handleConfirmStep = async () => {
    try {
      await createStoryStepSuggestion(stepSuggestion)
      setContentType('')
      toast({ message: 'Community Step hinzugefügt', type: 'success' })
      setIsOpen(false)
    } catch (e) {
      console.log(e)
    }
  }

  const handleAddLocation = (feature: any) => {
    setStepSuggestion((prev: any) => ({ ...prev, feature }))
  }

  const handleAddText = () => {
    const newStepSuggestion = { ...stepSuggestion }
    newStepSuggestion.content.push({
      type: 'TEXT',
      content: text,
      position: stepSuggestion.content.length,
      suggestionId: null,
    })

    setStepSuggestion(newStepSuggestion)
    setContentType('addSlide')
  }

  const handleAddMedia = async () => {
    if (file) {
      try {
        const uploadedMedia = await addMedia({
          name: file?.name,
          size: 's',
          source: source,
        })
        await uploadFile(file, uploadedMedia)
        const newStepSuggestion = { ...stepSuggestion }
        newStepSuggestion.content.push({
          type: 'MEDIA',
          content: file?.name,
          position: stepSuggestion.content.length,
          suggestionId: null,
          mediaId: uploadedMedia.id,
        })

        setStepSuggestion(newStepSuggestion)
        toast({ message: 'Media hinzugefügt', type: 'success' })
      } catch (e) {
        console.log(e)
      }
    } else {
      toast({ message: 'Media konnte nicht hinzugefügt werden', type: 'error' })
    }
  }

  const handleAddEmbed = async () => {
    try {
      const media = urlToMedia(url)
      if (media && media.type === 'EXTERNALIMAGE') {
        const uploadedMedia = await addMedia({
          name: generateRandomName(),
          url: media.content,
          source: source,
          size: 's',
        })

        const newStepSuggestion = { ...stepSuggestion }
        newStepSuggestion.content.push({
          type: media?.type, // Add a null check for 'media.type'
          content: media.content,
          position: stepSuggestion.content.length,
          suggestionId: null,
          mediaId: uploadedMedia.id,
        })
      } else {
        const newStepSuggestion = { ...stepSuggestion }
        newStepSuggestion.content.push({
          type: media?.type, // Add a null check for 'media.type'
          content: url,
          position: stepSuggestion.content.length,
          suggestionId: null,
        })

        setStepSuggestion(newStepSuggestion)
        toast({ message: 'Media hinzugefügt', type: 'success' })
      }
    } catch (e) {
      toast({ message: 'Media konnte nicht hinzugefügt werden', type: 'error' })
      console.log(e)
    }

    setContentType('addSlide')
  }

  const handleDeleteContent = (position: number) => {
    const newStepSuggestion = { ...stepSuggestion }
    newStepSuggestion.content = newStepSuggestion.content.filter(
      (content: any) => content.position !== position,
    )
    setStepSuggestion(newStepSuggestion)
    toast({ message: 'Content gelöscht', type: 'success' })
  }

  return (
    <Modal
      onClose={() => setContentType('')}
      onOpenChange={() => {
        setIsOpen(!isOpen)
      }}
      open={isOpen}
      title="Community Step"
      trigger={
        <Button onClick={() => setContentType('intro')} variant={'inverse'}>
          Step hinzufügen
        </Button>
      }
    >
      <Modal.Content>
        <div className="max-h-[35rem]">
          <ContentSwitcher
            contentType={contentType}
            date={date}
            handleAddEmbed={handleAddEmbed}
            handleAddLocation={handleAddLocation}
            handleAddMedia={handleAddMedia}
            handleAddText={handleAddText}
            handleConfirmStep={handleConfirmStep}
            handleDeleteContent={handleDeleteContent}
            setContentType={setContentType}
            setDate={setDate}
            setFile={setFile}
            setSource={setSource}
            setStepSuggestion={setStepSuggestion}
            setText={setText}
            setUrl={setUrl}
            stepSuggestion={stepSuggestion}
            storyId={story.id}
          />
        </div>
      </Modal.Content>
    </Modal>
  )
}
