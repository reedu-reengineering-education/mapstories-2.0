'use client'
import { Button } from '../../Elements/Button'
import { useEffect, useState } from 'react'
import { Modal } from '../../Modal'
import useStory from '@/src/lib/api/story/useStory'

import { toast } from '@/src/lib/toast'
import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'
import { fallbackLng, languages } from '@/src/app/i18n/settings'

import { urlToMedia } from '@/src/helper/urlToMedia'
import { generateRandomName } from '@/src/helper/generateRandomName'
import useMedia from '@/src/lib/api/media/useMedia'
import { uploadFile } from '@/src/helper/uploadFile'
import ContentSwitcher from './ContentSwitcher'
import { MediaType } from '@prisma/client'

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
  let lng = useBoundStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }
  const { t } = useTranslation(lng, ['viewer', 'communityStep'])
  const [isOpen, setIsOpen] = useState(false)
  const [captchaValid, setCaptchaValidated] = useState(false)
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
        content: t('communityStep:defaultHeadline'),
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
    setStepSuggestion((prev: any) => ({
      ...prev,
      timestamp: date,
    }))
  }, [date])

  const handleConfirmStep = async () => {
    try {
      await createStoryStepSuggestion(stepSuggestion)
      setContentType('')
      toast({ message: t('viewer:communityStepAdded'), type: 'success' })
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
        const fileType = file.type.split('/')[0].toUpperCase() as MediaType

        newStepSuggestion.content.push({
          type: fileType,
          content: file?.name,
          position: stepSuggestion.content.length,
          suggestionId: null,
          mediaId: uploadedMedia.id,
        })
        setStepSuggestion(newStepSuggestion)
        setContentType('addSlide')
        toast({ message: t('viewer:mediaAdded'), type: 'success' })
      } catch (e) {
        console.log(e)
      }
    } else {
      toast({ message: t('viewer:mediaNotAdded'), type: 'error' })
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
        toast({ message: t('viewer:mediaAdded'), type: 'success' })
      }
    } catch (e) {
      toast({ message: t('viewer:mediaNotAdded'), type: 'error' })
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
    toast({ message: t('viewer:contentDeleted'), type: 'success' })
  }

  return (
    <Modal
      onClose={() => setContentType('')}
      onOpenChange={() => {
        setIsOpen(!isOpen)
      }}
      open={isOpen}
      title={t('communityStep:modalTitle')}
      trigger={
        <Button onClick={() => setContentType('intro')} variant={'inverse'}>
          {t('communityStep:addStep')}
        </Button>
      }
    >
      <Modal.Content>
        <div className="max-h-[35rem]">
          <ContentSwitcher
            captchaValid={captchaValid}
            contentType={contentType}
            date={date}
            handleAddEmbed={handleAddEmbed}
            handleAddLocation={handleAddLocation}
            handleAddMedia={handleAddMedia}
            handleAddText={handleAddText}
            handleConfirmStep={handleConfirmStep}
            handleDeleteContent={handleDeleteContent}
            setCaptchaValidated={setCaptchaValidated}
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
