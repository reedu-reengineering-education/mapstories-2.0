'use client'

import React, { useState } from 'react';
import PrivacyPolicy from './Privacy';
import { Tabs, TabsList, TabsTrigger } from '@/src/components/Elements/Tabs';
import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'
import { TabsContent } from '@radix-ui/react-tabs';
import { cx } from 'class-variance-authority';
import UserCookieConsentForm from '@/src/components/Studio/Settings/UserCookieConsentForm';

export default function PageContent() {
  const [activeTab, setActiveTab] = useState('policy')
    const lng = useBoundStore(state => state.language)
    const { t } = useTranslation(lng, 'about')
  
  return (
    <div className="max-w-7xl mx-auto mt-4">
      <Tabs 
        defaultValue="policy"
        onValueChange={e => setActiveTab(e)}
        orientation='vertical'
        >
        <TabsList className='bg-white'>
          <TabsTrigger value='policy'> Privacy Policy</TabsTrigger>
          <TabsTrigger value='settings'>Embed Settings</TabsTrigger>
        </TabsList>
      <TabsContent
        className={cx(
          'max-h-[40rem] mt-4 overflow-scroll rounded-md bg-white',
          activeTab == 'policy' ? 'block' : 'hidden',
        )}
        forceMount
        value="policy"
      >
        <PrivacyPolicy />
      </TabsContent>    
            <TabsContent
        className={cx(
          'max-h-[40rem] mt-4 overflow-scroll rounded-md bg-white',
          activeTab == 'settings' ? 'block' : 'hidden',
        )}
        forceMount
        value="settings"
      >
        <UserCookieConsentForm />
      </TabsContent> 
      </Tabs>   
    </div>
  );
}
