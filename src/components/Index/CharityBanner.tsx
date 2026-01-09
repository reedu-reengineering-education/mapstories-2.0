'use client'

import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'
import { Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { Button } from '../Elements/Button'

export function CharityBanner() {
  const [isShowing, setIsShowing] = useState(false)

  const lng = useBoundStore(state => state.language)
  /* @ts-expect-error */
  const { t } = useTranslation(lng, 'charity')

  useEffect(() => {
    setIsShowing(true)
  }, [])

  return (
    <div>
      <Transition
        appear
        enter="transition duration-1000"
        enterFrom="opacity-0 -translate-x-80"
        enterTo="opacity-100 translate-x-0"
        leave="transition-opacity duration-1000"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        show={isShowing}
      >
        <div className="re-basic-box font-xs flex flex-col items-center justify-center gap-4 rounded-md bg-white p-4 text-center">
          <Button className='absolute right-2 top-2 m-2 h-6 w-6 text-black' onClick={() => setIsShowing(false)}
            variant={'inverse'}
        >
            <XMarkIcon className="w-6 h-6 " />
          </Button>

          <div>
            <span>
              <b>{t('text1_bold')}</b>
            </span>
            <span>{t('text2')}</span>
            <span>
              <a
                className="text-blue-500"
                href="https://secure.spendenbank.de/form/3267?langid=1"
              >
                {t('donations')}
              </a>
            </span>
            {t('text4')} <b>{t('text5_bold')} </b>
          </div>
          <a
            className="flex w-4/12 justify-center"
            href="https://secure.spendenbank.de/form/3267?langid=1"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Button>{t('donateNow')} </Button>
          </a>
        </div>
      </Transition>
    </div>
  )
}
