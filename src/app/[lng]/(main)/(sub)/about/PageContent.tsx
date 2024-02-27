'use client'

import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'
import { useEffect, useState } from 'react'
import 'react-tabs/style/react-tabs.css'
import FAQTab from './FAQTab/FAQTab'
import OfferTab from './OfferTab/OfferTab'
import OurStoryTab from './OurStoryTab/OurStoryTab'
import SupportTab from './SupportTab/SupportTab'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/src/components/Elements/Tabs'

import MapstoriesTab from './MapstoriesTab/MapstoriesTab'
import { cx } from 'class-variance-authority'

export default function PageContent() {
  const [isShowing, setIsShowing] = useState(false)
  const [activeTab, setActiveTab] = useState('mapstories')
  useEffect(() => {
    setIsShowing(true)
  }, [])

  const lng = useBoundStore(state => state.language)
  /* @ts-ignore */
  const { t } = useTranslation(lng, 'about')

  return (
    <Tabs
      defaultValue="mapstories"
      onValueChange={e => setActiveTab(e)}
      orientation="vertical"
    >
      <TabsList className="bg-white">
        {/* @ts-ignore */}
        <TabsTrigger value="mapstories">{t('tab1_title')}</TabsTrigger>
        {/* @ts-ignore */}
        <TabsTrigger value="ourStory">{t('tab2_title')}</TabsTrigger>
        {/* @ts-ignore */}
        <TabsTrigger value="offer">{t('tab3_title')}</TabsTrigger>
        {/* @ts-ignore */}
        <TabsTrigger value="support">{t('tab4_title')}</TabsTrigger>
        {/* @ts-ignore */}
        <TabsTrigger value="faq">{t('tab5_title')}</TabsTrigger>
      </TabsList>
      <TabsContent
        className={cx(
          'max-h-[30rem] overflow-scroll rounded-md bg-white lg:max-h-full lg:overflow-hidden',
          activeTab == 'mapstories' ? 'block' : 'hidden',
        )}
        forceMount
        value="mapstories"
      >
        <MapstoriesTab />
      </TabsContent>
      <TabsContent
        className={cx(
          'max-h-[30rem] overflow-scroll rounded-md bg-white lg:max-h-full lg:overflow-hidden',
          activeTab == 'ourStory' ? 'block' : 'hidden',
        )}
        forceMount
        value="ourStory"
      >
        <OurStoryTab />
      </TabsContent>
      <TabsContent
        className={cx(
          'max-h-[30rem] overflow-scroll rounded-md bg-white lg:max-h-full lg:overflow-hidden',
          activeTab == 'offer' ? 'block' : 'hidden',
        )}
        forceMount
        value="offer"
      >
        <OfferTab />
      </TabsContent>
      <TabsContent
        className={cx(
          'max-h-[30rem] overflow-scroll rounded-md bg-white lg:max-h-full lg:overflow-hidden',
          activeTab == 'support' ? 'block' : 'hidden',
        )}
        forceMount
        value="support"
      >
        <SupportTab />
      </TabsContent>
      <TabsContent
        className={cx(
          'max-h-[30rem] overflow-scroll rounded-md bg-white lg:max-h-full lg:overflow-hidden',
          activeTab == 'faq' ? 'block' : 'hidden',
        )}
        forceMount
        value="faq"
      >
        <FAQTab />
      </TabsContent>
    </Tabs>
  )
}
