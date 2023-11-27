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

export default function PageContent() {
  const [isShowing, setIsShowing] = useState(false)

  useEffect(() => {
    setIsShowing(true)
  }, [])

  const lng = useBoundStore(state => state.language)
  /* @ts-ignore */
  const { t } = useTranslation(lng, 'about')

  return (
    <Tabs defaultValue="mapstories">
      <TabsList className="bg-white" data-orientation="horizontal">
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
      <TabsContent className="bg-white" value="mapstories">
        <MapstoriesTab />
      </TabsContent>
      <TabsContent className="bg-white" value="ourStory">
        <OurStoryTab />
      </TabsContent>
      <TabsContent className="bg-white" value="offer">
        <OfferTab />
      </TabsContent>
      <TabsContent className="bg-white" value="support">
        <SupportTab />
      </TabsContent>
      <TabsContent className="bg-white" value="faq">
        <FAQTab />
      </TabsContent>
    </Tabs>
  )
}
