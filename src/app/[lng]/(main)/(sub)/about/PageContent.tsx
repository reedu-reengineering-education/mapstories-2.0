'use client'

import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'
import { useEffect, useState } from 'react'
import 'react-tabs/style/react-tabs.css'
import FAQTab from './FAQTab/FAQTab'
import OfferTab from './OfferTab/OfferTab'
import OurStoryTab from './OurStoryTab/OurStoryTab'
import ManualsTab from './ManualsTab/ManualsTab'
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
        <TabsTrigger value="mapstories">{t('tab1_title')}</TabsTrigger>
        <TabsTrigger value="ourStory">{t('tab2_title')}</TabsTrigger>
        <TabsTrigger value="offer">{t('tab3_title')}</TabsTrigger>
        <TabsTrigger value="support">{t('tab4_title')}</TabsTrigger>
        <TabsTrigger value="faq">{t('tab5_title')}</TabsTrigger>
        <TabsTrigger value="manuals">{t('tab6_title')}</TabsTrigger>
      </TabsList>
      <TabsContent
        className={cx(
          'max-h-[45rem] overflow-scroll rounded-md bg-white',
          activeTab == 'mapstories' ? 'block' : 'hidden',
        )}
        forceMount
        value="mapstories"
      >
        <MapstoriesTab />
      </TabsContent>
      <TabsContent
        className={cx(
          'max-h-[40rem] overflow-scroll rounded-md bg-white',
          activeTab == 'ourStory' ? 'block' : 'hidden',
        )}
        forceMount
        value="ourStory"
      >
        <OurStoryTab />
      </TabsContent>
      <TabsContent
        className={cx(
          'max-h-[40rem] overflow-scroll rounded-md bg-white',
          activeTab == 'offer' ? 'block' : 'hidden',
        )}
        forceMount
        value="offer"
      >
        <OfferTab />
      </TabsContent>
      <TabsContent
        className={cx(
          'max-h-[40rem] overflow-scroll rounded-md bg-white',
          activeTab == 'support' ? 'block' : 'hidden',
        )}
        forceMount
        value="support"
      >
        <SupportTab />
      </TabsContent>
      <TabsContent
        className={cx(
          'max-h-[40rem] overflow-scroll rounded-md bg-white',
          activeTab == 'faq' ? 'block' : 'hidden',
        )}
        forceMount
        value="faq"
      >
        <FAQTab />
      </TabsContent>
      <TabsContent
        className={cx(
          'max-h-[40rem] overflow-scroll rounded-md bg-white',
          activeTab == 'manuals' ? 'block' : 'hidden',
        )}
        forceMount
        value="faq"
      >
        <ManualsTab />
      </TabsContent>
    </Tabs>
  )
}
