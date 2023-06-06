'use client'

import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'
import { Transition } from '@headlessui/react'
import { useEffect, useState } from 'react'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import FAQTab from './FAQTab/FAQTab'
import OfferTab from './OfferTab/OfferTab'
import StoryTab from './StoryTab/StoryTab'

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
          <Tabs className="" selectedTabClassName="font-extrabold text-3xl">
            <TabList className="bg-slate-50 px-10 pt-5">
              <Tab>{t('tab1_title')}</Tab>
              <Tab>{t('tab2_title')}</Tab>
              <Tab>{t('tab3_title')}</Tab>
              {/* <Tab>{t('tab4_title')}</Tab> */}
            </TabList>
            <TabPanel>
              <StoryTab />
            </TabPanel>
            <TabPanel>
              <FAQTab />
            </TabPanel>
            <TabPanel>
              <OfferTab />
            </TabPanel>
            {/* <TabPanel>
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-8">
                  <h2 className="text-2xl font-bold">{t('tab4_title')}</h2>
                  <p>{t('tab4_text')}</p>
                </div>
              </div>
            </TabPanel> */}
          </Tabs>
        </div>
      </div>
    </Transition>
  )
}
