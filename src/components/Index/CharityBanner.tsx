'use client'

import { Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { Button } from '../Elements/Button'

export function CharityBanner({}) {
  const [isShowing, setIsShowing] = useState(false)

  useEffect(() => {
    setIsShowing(true)
  }, [])

  return (
    <div>
      <Transition
        appear
        enter="transition duration-1000"
        enterFrom="opacity-0 -translate-y-80"
        enterTo="opacity-100 translate-y-0"
        leave="transition-opacity duration-1000"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        show={isShowing}
      >
        <div className="re-basic-box font-xs flex flex-col items-center justify-center gap-4 rounded-md bg-white p-4 text-center">
          <XMarkIcon
            className="absolute right-0 top-0 m-2 h-6 w-6 cursor-pointer text-gray-500 "
            onClick={() => setIsShowing(false)}
          />
          <p>
            <b>Ihre finanzielle Unterstützung ist entscheidend</b> um die
            Weiterentwicklung von Mapstories zu gewährleisten. Mit Ihren{' '}
            <a
              className="text-blue-500"
              href="https://secure.spendenbank.de/form/3267?langid=1"
            >
              Spenden
            </a>{' '}
            an Vamos e.V. (Verwendungszweck: Mapstories) können wir Mapstories
            verbessern, Schulungsangebote erweitern und neue Funktionen
            entwickeln, um noch mehr Menschen zu erreichen.{' '}
            <b>
              Jeder Beitrag, ob groß oder klein, ist wertvoll und hilft uns,
              unsere Ziele zu verwirklichen.
            </b>
          </p>
          <a
            className="flex w-4/12  justify-center  "
            href="https://secure.spendenbank.de/form/3267?langid=1"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Button>Jetzt spenden!</Button>
          </a>
        </div>
      </Transition>
    </div>
  )
}
