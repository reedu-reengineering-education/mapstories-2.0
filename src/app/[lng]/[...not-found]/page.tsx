'use client'
import Link from 'next/link'
import Image from 'next/image'
import Logo from '@/assets/logos/logo_no_text.png'
import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'
import { LangSwitcher } from '@/src/components/LangSwitcher'


export default function NotFound() {
  const lng = useBoundStore(state => state.language)
  // @ts-expect-error Type instantiation is excessively deep
const { t } = useTranslation(lng, 'error')
  return (
    
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 py-12 text-center">
       <div className="absolute top-4 right-4 z-50">
     <LangSwitcher/> 
  </div>
      <div className=" re-basic-box border rounded-2xl border-black px-8 py-10 max-w-xl w-full">
        <h1 className="text-2xl md:text-3xl font-mextralight text-orange-600 mb-4 bg-[#3B2F86] p-5 inline-block rounded">
          {t('not-found.title')}
        </h1>
        <p className="text-sm md:text-base text-[#1F1F60] font-semibold mb-2">
          {t('not-found.description')} <br />
          <a className="underline text-[#1F1F60]" href="mailto:kontakt@reedu.de">
            kontakt@reedu.de
          </a>.
        
  

        </p>
        <p className="text-sm text-[#1F1F60] mb-6">
          {[t('not-found.redirect')]}
        </p>
      
      
        <Link href="/">
  <button className=" re-basic-box rounded-lg border border-black px-10 py-2 text-base font-bold text-black bg-[#ffffff] hover:bg-hover shadow-md transition-all duration-150">
    {t('not-found.back-button')}
  </button>
</Link>

      </div>

      

      <div className="mt-12 w-full max-w-md">

        <div className="w-90 h-[100px] overflow-hidden mx-auto">
      <Image
        alt="Cropped Logo"
         height={300}
        layout="quality"
        objectFit="cover"
        src={Logo}
        width={1000}

      />
    </div>
        
      </div>
    </div>
  )
}