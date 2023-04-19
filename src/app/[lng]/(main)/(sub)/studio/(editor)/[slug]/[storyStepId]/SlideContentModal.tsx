'use client'

import { useState } from 'react'
import { Modal } from '@/src/components/Modal'
import {
  ArrowLeftIcon,
  HeadingIcon,
  TextIcon,
  TwitterLogoIcon,
  VideoIcon,
} from '@radix-ui/react-icons'
import React from 'react'
import { CSSTransition } from 'react-transition-group'
import { TitleContentEdit } from '@/src/components/Studio/ContentTypes/TitleContentEdit'
import { EmbedContentEdit } from '@/src/components/Studio/ContentTypes/EmbedContentEdit'
import { useTranslation } from '@/src/app/i18n/client'
import { TextContentEdit } from '@/src/components/Studio/ContentTypes/TextContentEdit'
// import { useUIStore } from '@/src/lib/store/ui'
import { useBoundStore } from '@/src/lib/store/store'
import { MediaContentEdit } from '@/src/components/Studio/ContentTypes/MediaContentType'

type Props = {
  trigger: React.ReactElement
  storyStepId: string
}

export default function SlideContentModal({ trigger, storyStepId }: Props) {
  const [contentType, setContentType] = useState<string>('')
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, ['editModal', 'embeds'])
  return (
    <>
      <Modal onClose={() => setContentType('')} title={''} trigger={trigger}>
        <Modal.Content>
          <div className="relative">
            <CSSTransition
              appear
              classNames="slide-transition"
              in={contentType === ''}
              timeout={400}
              unmountOnExit
            >
              <div>
                <p className="pb-2">
                  Wähle aus was für ein Element du deiner Folie hinzufügen
                  möchtest:
                </p>

                <div className="flex flex-wrap justify-center py-4">
                  <div
                    className="re-basic-box-no-shadow re-hover-element m-3 w-36 cursor-pointer px-4 py-2"
                    onClick={() => setContentType('title')}
                  >
                    <div className="flex justify-center">
                      <HeadingIcon className="h-14 w-14"></HeadingIcon>
                    </div>
                    <h3 className="text-center">Heading</h3>
                  </div>

                  <div
                    className="re-basic-box-no-shadow re-hover-element m-3 w-36 cursor-pointer px-4 py-2"
                    onClick={() => setContentType('text')}
                  >
                    <div className="flex justify-center">
                      <TextIcon className="h-14 w-14"></TextIcon>
                    </div>
                    <h3 className="text-center">Text</h3>
                  </div>

                  <div
                    className="re-basic-box-no-shadow re-hover-element m-3 w-36 cursor-pointer px-4 py-2"
                    onClick={() => setContentType('media')}
                  >
                    <div className="flex justify-center">
                      <VideoIcon className="h-14 w-14"></VideoIcon>
                    </div>
                    <h3 className="text-center">Video/Bild</h3>
                  </div>

                  <div
                    className="re-basic-box-no-shadow re-hover-element m-3 w-36 cursor-pointer px-4 py-2"
                    onClick={() => setContentType('embed')}
                  >
                    <div className="flex justify-center">
                      <TwitterLogoIcon className="h-14 w-14"></TwitterLogoIcon>
                    </div>
                    <h3 className="text-center">{t('embeds:EmbedName')}</h3>
                  </div>
                </div>
              </div>
            </CSSTransition>

            {(contentType == 'title' ||
              contentType == 'embed' ||
              contentType == 'text' ||
              contentType == 'media') && (
              <>
                <CSSTransition
                  appear
                  classNames="slide-transition-reverse"
                  //@ts-ignore
                  in={contentType != ''}
                  timeout={400}
                  unmountOnExit
                >
                  <div className="top-0">
                    <div className="absolute -top-6 ">
                      <button
                        className="flex"
                        onClick={() => setContentType('')}
                      >
                        <ArrowLeftIcon className="mr-2 h-6 w-6"></ArrowLeftIcon>{' '}
                        Zurück
                      </button>
                    </div>

                    {contentType == 'title' && (
                      <TitleContentEdit
                        setContentType={setContentType}
                        storyStepId={storyStepId}
                      ></TitleContentEdit>
                    )}
                    {contentType == 'embed' && (
                      <EmbedContentEdit
                        storyStepId={storyStepId}
                      ></EmbedContentEdit>
                    )}
                    {contentType == 'text' && (
                      <TextContentEdit
                        setContentType={setContentType}
                        storyStepId={storyStepId}
                      ></TextContentEdit>
                    )}
                    {contentType == 'media' && (
                      <MediaContentEdit
                        setContentType={setContentType}
                        storyStepId={storyStepId}
                      ></MediaContentEdit>
                    )}
                  </div>
                </CSSTransition>
              </>
            )}
          </div>
        </Modal.Content>
        {/* <Modal.Footer>
      
        </Modal.Footer> */}
      </Modal>
    </>
  )
}
