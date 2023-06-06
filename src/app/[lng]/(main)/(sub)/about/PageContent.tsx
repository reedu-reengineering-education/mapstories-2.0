'use client'

import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'
import { Transition } from '@headlessui/react'
import { useEffect, useState } from 'react'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import Image from 'next/image'
import BMZLogo from '@/assets/images/partners/BMZ-Logo-4c.jpg'
import fachStelleWeltkirche from '@/assets/images/partners/Fachstelle Weltkirche - Logo.png'
import SUELogo from '@/assets/images/partners/SUE_Logo_CMYK_300dpi.jpg'
import FAQPage from './FAQPage'

export default function PageContent() {
  const [isShowing, setIsShowing] = useState(false)

  useEffect(() => {
    setIsShowing(true)
  }, [])

  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, 'about')

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
      <div>
        <div className="re-basic-box  p-15  bg-white">
          <Tabs>
            <TabList>
              <Tab>{t('tab1_title')}</Tab>
              <Tab>{t('tab2_title')}</Tab>
              <Tab>{t('tab3_title')}</Tab>
              <Tab>{t('tab4_title')}</Tab>
            </TabList>
            <TabPanel>
              <div className="flex flex-row items-start gap-10 p-10">
                <div>
                  <p>{t('tab1_text')}</p>
                </div>
                <div className="flex flex-col gap-10">
                  <div className="flex flex-col">
                    <Image
                      alt="BMZ Logo"
                      height={200}
                      src={BMZLogo}
                      width={400}
                    />
                    <div>
                      Bundesministerium für wirtschaftliche Zusammenarbeit{' '}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <Image
                      alt="Fachstelle Weltkirche Logo"
                      height={200}
                      src={fachStelleWeltkirche}
                      width={200}
                    />
                    <div>Fachstelle Weltkirche </div>
                  </div>
                  <div className="flex flex-col">
                    <Image
                      alt="SUE Logo"
                      height={200}
                      src={SUELogo}
                      width={200}
                    />
                    <div>
                      Stiftung Umwelt und Entwicklung Nordrhein-Westfalen{' '}
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              <FAQPage />
            </TabPanel>
            <TabPanel>
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-8">
                  <h2 className="text-2xl font-bold">{t('tab3_title')}</h2>
                  <p>{t('tab3_text')}</p>
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-8">
                  <h2 className="text-2xl font-bold">{t('tab4_title')}</h2>
                  <p>{t('tab4_text')}</p>
                </div>
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </Transition>
  )
}
