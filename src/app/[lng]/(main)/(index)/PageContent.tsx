'use client'

import { useTranslation } from '@/src/app/i18n/client'
import { Button } from '@/src/components/Elements/Button'
import { useBoundStore } from '@/src/lib/store/store'
import { Transition } from '@headlessui/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import MapstoryWithTextLogo from '@/assets/logos/logo_text.png'
export default function PageContent() {
  const [isShowing, setIsShowing] = useState(false)

  useEffect(() => {
    setIsShowing(true)
  }, [])

  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, 'main')

  return (
    <Transition
      appear
      enter="transition duration-1000"
      enterFrom="opacity-0 -translate-y-20"
      enterTo="opacity-100 translate-y-0"
      leave="transition-opacity duration-1000"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      show={isShowing}
    >
      <div blur-sm className="flex flex-col gap-8">
        <div className="re-basic-box  flex w-full flex-col items-center bg-white bg-opacity-90 p-5">
          <Image
            alt="Mapstories"
            height={300}
            src={MapstoryWithTextLogo}
            width={800}
          />

          <p className="p-5">{t('startText')}</p>
        </div>
        <div className=" flex items-center justify-center gap-4">
          <Link href="/login">
            <Button className="re-basic-box bg-opacity-90">
              {t('getStarted')}
            </Button>
          </Link>
          <Link href={'/about'}>
            <Button className="re-basic-box bg-opacity-90" variant={'inverse'}>
              {t('infos')}
            </Button>
          </Link>
        </div>
      </div>
    </Transition>
  )
}
