'use client';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/assets/logos/logo_no_text.png';
import { useTranslation } from '@/src/app/i18n/client';
import { useBoundStore } from '@/src/lib/store/store';
import { LangSwitcher } from '@/src/components/LangSwitcher';

export default function NotFound() {
  const lng = useBoundStore((state) => state.language);
  const { t } = useTranslation(lng as any, 'error');

  return (
    <div className="relative min-h-screen bg-white px-6 text-center overflow-hidden">
      <div className="absolute top-4 right-4 z-50">
        <LangSwitcher />
      </div>

      {/* Halb sichtbarer Globus – etwas tiefer & breiter */}
      <div
        className="
          pointer-events-none
          absolute bottom-[-5vh] left-1/2 -translate-x-1/2 translate-y-[60%]
          h-[115vh] w-[125vh] md:h-[120vh] md:w-[130vh] lg:h-[125vh] lg:w-[135vh]
        "
      >
        <Image alt="Globus" className="object-contain" fill priority src={Logo} />
      </div>

      {/* Inhalt etwas höher platzieren */}
      <div className="relative z-10 flex flex-col items-center pt-10 md:pt-12 lg:pt-14">
        <div className="re-basic-box border rounded-2xl border-black px-8 py-10 max-w-xl w-full bg-white">
          <h1 className="text-2xl md:text-3xl font-mextralight text-orange-600 mb-4 bg-[#3B2F86] p-5 inline-block rounded">
            {t('not-found.title')}
          </h1>
          <p className="text-sm md:text-base text-[#1F1F60] font-semibold mb-2">
            {t('not-found.description')} <br />
            <a className="underline text-[#1F1F60]" href="mailto:kontakt@reedu.de">
              kontakt@reedu.de
            </a>
            .
          </p>
          <p className="text-sm text-[#1F1F60] mb-6">
            {t('not-found.redirect')}
          </p>

          <Link href="/">
            <button className="re-basic-box rounded-lg border border-black px-10 py-2 text-base font-bold text-black bg-[#ffffff] hover:bg-hover shadow-md transition-all duration-150">
              {t('not-found.back-button')}
            </button>
          </Link>
        </div>
        {/* Abstand zwischen Globus & Kasten */}
        <div className="h-6 md:h-8 lg:h-10" />
      </div>
    </div>
  );
}
