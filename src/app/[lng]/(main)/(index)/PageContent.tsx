'use client'

import { useTranslation } from '@/src/app/i18n/client'
import { Button } from '@/src/components/Elements/Button'
import { PageHeader } from '@/src/components/PageHeader'
import { useBoundStore } from '@/src/lib/store/store'
import { Transition } from '@headlessui/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

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
      <div className="flex flex-col gap-8">
        <div className="re-basic-box  p-15 flex w-full flex-col items-center bg-white">
          <PageHeader heading="Mapstories" />

          <p className="p-5">{t('startText')}</p>
        </div>
        <div className=" flex items-center justify-center gap-4">
          <Link href="/login">
            <Button>{t('getStarted')}</Button>
          </Link>
          <Link href={'/about'}>
            <Button variant={'inverse'}>{t('infos')}</Button>
          </Link>
        </div>
      </div>
    </Transition>
  )
}
