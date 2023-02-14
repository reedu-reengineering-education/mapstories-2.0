'use client'

import { useState } from 'react'
import { Modal } from '@/src/components/Modal'
import { ArrowLeftIcon, HeadingIcon, TextIcon, TwitterLogoIcon, VideoIcon } from '@radix-ui/react-icons';
import React from 'react'
import { CSSTransition } from 'react-transition-group';
import { TitleContentEdit } from '@/src/components/Studio/ContentTypes/TitleContentEdit'
import { useTranslation } from '@/src/app/i18n/client';

type Props = {
  trigger: React.ReactElement
  storyStepId: string,
  lng: string
}

export default function SlideContentModal({ trigger, storyStepId, lng }: Props) {

  const [contentType, setContentType] = useState<string>('')
  const { t } = useTranslation(lng, 'editModal')

  return (
    <>
      <Modal title={''} trigger={trigger}>

        <Modal.Content>
          <div className="relative">
            <CSSTransition
              appear
              classNames="slide-transition"
              in={contentType === ''}
              timeout={400}
              unmountOnExit>
              <div>
                <p className="pb-2">Wähle aus was für ein Element du deiner Folie hinzufügen möchtest:</p>

                <div className="flex flex-wrap justify-center py-4">
                  <div className='w-36 re-basic-box-no-shadow px-4 py-2 m-3 cursor-pointer re-hover-element' onClick={() => setContentType('title')}>
                    <div className="flex justify-center">
                      <HeadingIcon className='w-14 h-14'></HeadingIcon>
                    </div>
                    <h3 className="text-center">Heading</h3>
                  </div>

                  <div className='w-36 re-basic-box-no-shadow px-4 py-2 m-3 cursor-pointer re-hover-element' onClick={() => setContentType('text')}>
                    <div className="flex justify-center">
                      <TextIcon className='w-14 h-14'></TextIcon>
                    </div>
                    <h3 className="text-center">Text</h3>
                  </div>

                  <div className='w-36 re-basic-box-no-shadow px-4 py-2 m-3 cursor-pointer re-hover-element'>
                    <div className="flex justify-center">
                      <VideoIcon className='w-14 h-14'></VideoIcon>
                    </div>
                    <h3 className="text-center">Video/Bild</h3>
                  </div>

                  <div className='w-36 re-basic-box-no-shadow px-4 py-2 m-3 cursor-pointer re-hover-element'>
                    <div className="flex justify-center">
                      <TwitterLogoIcon className='w-14 h-14'></TwitterLogoIcon>
                    </div>
                    <h3 className="text-center">Embed</h3>
                  </div>
                </div>
              </div>
            </CSSTransition>

            {
              contentType == 'title' || contentType == 'embed' && (
                <>
                  <CSSTransition
                    appear
                    classNames="slide-transition-reverse"
                    //@ts-ignore
                    in={contentType != ''}
                    timeout={400}
                    unmountOnExit>
                    <div className="top-0">
                      <div className="absolute -top-6 ">
                        <button className="flex" onClick={() => setContentType('')}><ArrowLeftIcon className="h-6 w-6 mr-2"></ArrowLeftIcon> Zurück</button>
                      </div>
                      <TitleContentEdit lng={lng} storyStepId={storyStepId}></TitleContentEdit>
                    </div>
                  </CSSTransition>
                </>
              ) ||
              contentType == 'text' && (
                <>
                  <CSSTransition
                    appear
                    classNames="slide-transition-reverse"
                    in={contentType != ''} 
                    timeout={400}
                    unmountOnExit>
                    <div className="top-0">
                      <div className="absolute -top-6 ">
                        <button className="flex" onClick={() => setContentType('')}><ArrowLeftIcon className="h-6 w-6 mr-2"></ArrowLeftIcon> Zurück</button>
                      </div>
                      <TextContentEdit storyStepId={storyStepId}></TextContentEdit>
                    </div>
                  </CSSTransition>
                </>
              )
            }
          </div>
        </Modal.Content >
        {/* <Modal.Footer>
      
        </Modal.Footer> */}
      </Modal >
    </>
  )
}
