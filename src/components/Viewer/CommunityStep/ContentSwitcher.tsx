'use client'
import { Button } from '../../Elements/Button'
import { CSSTransition } from 'react-transition-group'
// @ts-ignore
import React, { useEffect, useState } from 'react'
import SelectContentType from '@/src/components/Viewer/CommunityStep/SelectContentType'

import InitialView from './ModalViews/InitialView'
import DateSelectionView from './ModalViews/DateSelectionView'
import LocationSelectionView from './ModalViews/LocationSelectionView'
import ConfirmationView from './ModalViews/ConfirmationView'
import { TextContent } from '../../Elements/ContentCreates/TextContent'
import ShowStepWithContents from './DraggableSlideViewer/ShowStepWithContents'
import { EmbedContent } from '../../Elements/ContentCreates/EmbedContent'
import { MediaContent } from '@/src/components/Elements/ContentCreates/MediaContent'
import {
  LoadCanvasTemplate,
  loadCaptchaEnginge,
  validateCaptcha,
  // @ts-ignore
} from 'react-simple-captcha'
import { toast } from '@/src/lib/toast'
import { Input } from '../../Elements/Input'

// ContentSwitcher component to handle transitions between different content types
export default function ContentSwitcher({
  contentType,
  storyId,
  captchaValid,
  date,
  setDate,
  setText,
  setSource,
  setUrl,
  setFile,
  setStepSuggestion,
  stepSuggestion,
  handleAddLocation,
  handleAddText,
  handleAddMedia,
  handleAddEmbed,
  handleConfirmStep,
  handleDeleteContent,
  setContentType,
  setCaptchaValidated,
}: any) {
  const [captcha, setCaptcha] = useState<string>('')

  useEffect(() => {
    if (contentType === 'media') {
      loadCaptchaEnginge(6, 'gray')
    }
  }, [contentType])

  const handleCaptchaAndContiniue = () => {
    if (validateCaptcha(captcha)) {
      handleAddMedia()
    } else {
      setCaptchaValidated(false)
      toast({ message: 'Captcha nicht korrekt', type: 'error' })
    }
  }

  return (
    <>
      <CSSTransition
        appear
        classNames="slide-transition"
        in={contentType === 'intro'}
        timeout={400}
        unmountOnExit
      >
        <div>
          <InitialView />
          <div className="flex flex-row justify-end gap-4">
            <Button variant={'inverse'}>Abbrechen</Button>
            <Button onClick={() => setContentType('addDate')}>Weiter</Button>
          </div>
        </div>
      </CSSTransition>

      <CSSTransition
        appear
        classNames="slide-transition"
        in={contentType === 'addDate'}
        timeout={400}
        unmountOnExit
      >
        <div className="flex flex-col gap-4">
          <DateSelectionView date={date} setDate={setDate} />
          <div className="flex justify-between">
            <Button onClick={() => setContentType('intro')} variant={'inverse'}>
              Zurück
            </Button>
            <Button disabled={false} onClick={() => setContentType('addSlide')}>
              Weiter
            </Button>
          </div>
        </div>
      </CSSTransition>

      <CSSTransition
        appear
        classNames="slide-transition"
        in={contentType === 'addSlide'}
        timeout={400}
        unmountOnExit
      >
        <div className="flex flex-col gap-4">
          <ShowStepWithContents
            handleDeleteContent={handleDeleteContent}
            setContentType={setContentType}
            setStepSuggestion={setStepSuggestion}
            stepSuggestion={stepSuggestion}
          />
          <div className="flex flex-row justify-between gap-4">
            <Button
              onClick={() => setContentType('addDate')}
              variant={'inverse'}
            >
              Zurück
            </Button>
            <Button onClick={() => setContentType('addLocation')}>
              Weiter
            </Button>
          </div>
        </div>
      </CSSTransition>

      <CSSTransition
        appear
        classNames="slide-transition"
        in={contentType === 'addContent'}
        timeout={400}
        unmountOnExit
      >
        <div>
          <SelectContentType setContentType={setContentType} />

          <div className="flex justify-start">
            <Button
              onClick={() => setContentType('addSlide')}
              variant={'inverse'}
            >
              Zurück
            </Button>
          </div>
        </div>
      </CSSTransition>

      <CSSTransition
        appear
        classNames="slide-transition"
        in={contentType === 'text'}
        timeout={400}
        unmountOnExit
      >
        <div>
          <TextContent setValue={setText} />
          <div className="flex justify-between">
            <Button
              onClick={() => setContentType('addSlide')}
              variant={'inverse'}
            >
              Zurück
            </Button>
            <Button disabled={false} onClick={() => handleAddText()}>
              Erstellen
            </Button>
          </div>
        </div>
      </CSSTransition>

      <CSSTransition
        appear
        classNames="slide-transition"
        in={contentType === 'media'}
        timeout={400}
        unmountOnExit
      >
        <div>
          <MediaContent
            captchaEnabled={true}
            setCaptchaValidated={setCaptchaValidated}
            setFile={setFile}
          />
          <div className="p-2">
            <LoadCanvasTemplate />
            <div className="flex flex-col gap-2">
              <Input
                className="bg-slate-50"
                label="Captcha"
                onChange={e => setCaptcha(e.target.value)}
                placeholder="Captcha eingeben"
                value={captcha}
              ></Input>
            </div>
          </div>
          <div className="flex justify-between">
            <Button
              onClick={() => setContentType('addSlide')}
              variant={'inverse'}
            >
              Zurück
            </Button>
            <Button
              disabled={captchaValid}
              onClick={() => handleCaptchaAndContiniue()}
            >
              Erstellen
            </Button>
          </div>
        </div>
      </CSSTransition>

      <CSSTransition
        appear
        classNames="slide-transition"
        in={contentType === 'embed'}
        timeout={400}
        unmountOnExit
      >
        <div>
          <EmbedContent setMediaUrl={setUrl} setSource={setSource} />
          <div className="flex justify-between">
            <Button
              onClick={() => setContentType('addSlide')}
              variant={'inverse'}
            >
              Zurück
            </Button>
            <Button disabled={false} onClick={() => handleAddEmbed()}>
              Erstellen
            </Button>
          </div>
        </div>
      </CSSTransition>

      <CSSTransition
        appear
        classNames="slide-transition"
        in={contentType === 'addLocation'}
        timeout={400}
        unmountOnExit
      >
        <LocationSelectionView
          handleAddLocation={handleAddLocation}
          onBack={() => setContentType('addSlide')}
          onNext={() => setContentType('confirmStep')}
          stepSuggestion={stepSuggestion}
        />
      </CSSTransition>

      <CSSTransition
        appear
        classNames="slide-transition"
        in={contentType === 'confirmStep'}
        timeout={400}
        unmountOnExit
      >
        <ConfirmationView
          onBack={() => setContentType('addLocation')}
          onConfirm={() => handleConfirmStep()}
          stepSuggestion={stepSuggestion}
        />
      </CSSTransition>
    </>
  )
}
