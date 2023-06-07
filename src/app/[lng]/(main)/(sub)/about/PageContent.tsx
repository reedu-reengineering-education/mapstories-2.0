'use client'

import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'
import { Transition } from '@headlessui/react'
import { useEffect, useState } from 'react'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import FAQTab from './FAQTab/FAQTab'
import OfferTab from './OfferTab/OfferTab'
import MapstoriesTab from './MapstoriesTab/MapstoriesTab'
import OurStoryTab from './OurStoryTab/OurStoryTab'
import SupportTab from './SupportTab/SupportTab'

export default function PageContent() {
  const [isShowing, setIsShowing] = useState(false)

  useEffect(() => {
    setIsShowing(true)
  }, [])

  const lng = useBoundStore(state => state.language)
  /* @ts-ignore */
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
          <Tabs
            forceRenderTabPanel={true}
            selectedTabClassName="font-extrabold text-3xl bg-slate-50 rounded p-5"
          >
            <TabList className="rounded bg-zinc-300 px-10 pb-2 pt-5 ">
              {/* @ts-ignore */}
              <Tab>{t('tab1_title')}</Tab>
              {/* @ts-ignore */}
              <Tab>{t('tab2_title')}</Tab>
              {/* @ts-ignore */}
              <Tab>{t('tab3_title')}</Tab>
              {/* @ts-ignore */}
              <Tab>{t('tab4_title')}</Tab>
              {/* @ts-ignore */}
              <Tab>{t('tab5_title')}</Tab>
              {/* <Tab>{t('tab4_title')}</Tab> */}
            </TabList>
            <TabPanel>
              <MapstoriesTab />
            </TabPanel>
            <TabPanel>
              <OurStoryTab />
            </TabPanel>
            <TabPanel>
              <OfferTab />
            </TabPanel>
            <TabPanel>
              <SupportTab />
            </TabPanel>
            <TabPanel>
              <FAQTab />
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
