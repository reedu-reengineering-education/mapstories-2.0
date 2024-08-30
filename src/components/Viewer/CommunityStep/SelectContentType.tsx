import React, { useEffect } from 'react'
import { CaretSortIcon, TextIcon, UploadIcon } from '@radix-ui/react-icons'

type Props = {
  setContentType: any
}

export default function SelectContentType({ setContentType }: Props) {
  useEffect(() => {
    console.log('SelectContentType')
  }, [])

  return (
    <div className="mx-2 px-2">
      <p className="pb-2">Element auswählen</p>

      <div className="flex flex-wrap justify-center py-4">
        <div
          className="re-basic-box-no-shadow re-hover-element m-3 w-40 cursor-pointer px-4 py-2"
          onClick={() => setContentType('text')}
        >
          <div className="flex justify-center">
            <TextIcon className="h-14 w-14"></TextIcon>
          </div>
          <h3 className="text-center">Text</h3>
        </div>

        <div
          className="re-basic-box-no-shadow re-hover-element m-3 w-40 cursor-pointer px-4 py-2"
          onClick={() => setContentType('media')}
        >
          <div className="flex justify-center">
            <UploadIcon className="h-14 w-14"></UploadIcon>
          </div>
          <h3 className="text-center">Upload</h3>
        </div>

        <div
          className="re-basic-box-no-shadow re-hover-element m-3 w-40 cursor-pointer px-4 py-2"
          onClick={() => setContentType('embed')}
        >
          <div className="flex justify-center">
            <CaretSortIcon className="h-14 w-14 rotate-90"></CaretSortIcon>
          </div>
          <h3 className="text-center">Embed</h3>
        </div>
      </div>
    </div>
  )
}
