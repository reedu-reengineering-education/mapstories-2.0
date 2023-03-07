'use client'

import { useState } from 'react'
import { Modal } from '@/src/components/Modal'
import { LayersIcon } from '@radix-ui/react-icons'
import React from 'react'
import { CSSTransition } from 'react-transition-group'

type Props = {
  trigger: React.ReactElement
  storyStepId: string
}

export default function MarkerGeojsonModal({ trigger }: Props) {
  const [setContentType] = useState('')

  return (
    <>
      <Modal title={''} trigger={trigger}>
        <Modal.Content>
          <div className="relative">
            <CSSTransition
              appear
              classNames="slide-transition"
              in={true}
              timeout={400}
              unmountOnExit
            >
              <div>
                <p className="pb-2">
                  Wähle aus welche Elemente du der Karte hinzufügen möchtest:
                </p>

                <div className="flex flex-nowrap justify-center py-4">
                  <div
                    className="re-basic-box-no-shadow re-hover-element m-3 w-36 cursor-pointer px-4 py-2"
                    onClick={() => setContentType('geojson')}
                  >
                    <div className="flex justify-center">
                      <LayersIcon className="h-14 w-14"></LayersIcon>
                    </div>
                    <h3 className="text-center">GeoJSON</h3>
                  </div>
                </div>
              </div>
            </CSSTransition>
          </div>
        </Modal.Content>
        {/* <Modal.Footer>
      
        </Modal.Footer> */}
      </Modal>
    </>
  )
}
