import React from 'react'
import { useTranslation } from '@/src/app/i18n/client'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { useBoundStore } from '@/src/lib/store/store'
import { CaretSortIcon, TextIcon, UploadIcon } from '@radix-ui/react-icons'

type Props = {
  setContentType: any
}

export default function SelectContentType({ setContentType }: Props) {
  let lng = useBoundStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }
  const { t } = useTranslation(lng, 'communityStep')
  return (
    <div className="mx-2 px-2">
      <p className="pb-2">{t('selectElement')}</p>

      <div className="flex flex-wrap justify-center py-4">
        <div
          className="re-basic-box-no-shadow re-hover-element m-3 w-40 cursor-pointer px-4 py-2"
          onClick={() => setContentType('text')}
        >
          <div className="flex justify-center">
            <TextIcon className="h-14 w-14"></TextIcon>
          </div>
          <h3 className="text-center">{t('text')}</h3>
        </div>

        <div
          className="re-basic-box-no-shadow re-hover-element m-3 w-40 cursor-pointer px-4 py-2"
          onClick={() => setContentType('media')}
        >
          <div className="flex justify-center">
            <UploadIcon className="h-14 w-14"></UploadIcon>
          </div>
          <h3 className="text-center">{t('upload')}</h3>
        </div>

        <div
          className="re-basic-box-no-shadow re-hover-element m-3 w-40 cursor-pointer px-4 py-2"
          onClick={() => setContentType('embed')}
        >
          <div className="flex justify-center">
            <CaretSortIcon className="h-14 w-14 rotate-90"></CaretSortIcon>
          </div>
          <h3 className="text-center">{t('embed')}</h3>
        </div>
      </div>
    </div>
  )
}
