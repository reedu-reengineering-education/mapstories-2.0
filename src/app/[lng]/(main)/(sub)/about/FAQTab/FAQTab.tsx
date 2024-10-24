import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'
import {
  CardContent,
  CardFooter,
  CardHeader,
} from '@/src/components/Elements/Card'
import { Card } from '@/src/components/Card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/src/components/Elements/Collapsible'
import { ChevronsUpDown } from 'lucide-react'

export default function FAQTab() {
  const lng = useBoundStore(state => state.language)
  //@ts-ignore
  const { t } = useTranslation(lng, 'faq')

  return (
    <Card>
      <CardHeader> </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <Collapsible>
            <CollapsibleTrigger className="flex w-full justify-start rounded-md bg-slate-100 p-2 font-extrabold">
              {t('faq1_title')}{' '}
              <ChevronsUpDown className="ml-auto" size={24}></ChevronsUpDown>
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-slate-50 p-2">
              <p>{t('faq1_texta')}</p>
              <p>{t('faq1_textb')}</p>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible>
            <CollapsibleTrigger className="flex w-full justify-start rounded-md bg-slate-100 p-2 font-extrabold">
              {t('faq2_title')}{' '}
              <ChevronsUpDown className="ml-auto" size={24}></ChevronsUpDown>
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-slate-50 p-2">
              <p>{t('faq2_texta')}</p>
              <p>{t('faq2_textb')}</p>
              <ul className="list-inside list-disc">
                <li>{t('faq2_lista')}</li>
                <li>{t('faq2_listb')}</li>
                <li>{t('faq2_listc')}</li>
                <li>{t('faq2_listd')}</li>
                <li>{t('faq2_liste')}</li>
                <li>{t('faq2_listf')}</li>
                <li>{t('faq2_listg')}</li>
              </ul>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible>
            <CollapsibleTrigger className="flex w-full justify-start rounded-md bg-slate-100 p-2 font-extrabold">
              {t('faq3_title')}{' '}
              <ChevronsUpDown className="ml-auto" size={24}></ChevronsUpDown>
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-slate-50 p-2">
              <p>{t('faq3_text')}</p>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible>
            <CollapsibleTrigger className="flex w-full justify-start rounded-md bg-slate-100 p-2 font-extrabold">
              {t('faq4_title')}{' '}
              <ChevronsUpDown className="ml-auto" size={24}></ChevronsUpDown>
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-slate-50 p-2">
              <p>{t('faq4_text')}</p>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible>
            <CollapsibleTrigger className="flex w-full justify-start rounded-md bg-slate-100 p-2 font-extrabold">
              {t('faq5_title')}{' '}
              <ChevronsUpDown className="ml-auto" size={24}></ChevronsUpDown>
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-slate-50 p-2">
              {t('faq5_text')}{' '}
              <a
                className="text-blue-500"
                href="https://www.taskcards.de/#/board/1b41a521-922e-471c-949b-b0d132c903c7/view?token=2cea14db-2cd2-4664-9852-400ea9d0aa0d"
                target="_blank"
              >
                https://www.taskcards.de/#/board/1b41a521-922e-471c-949b-b0d132c903c7/view?token=2cea14db-2cd2-4664-9852-400ea9d0aa0d
              </a>{' '}
            </CollapsibleContent>
          </Collapsible>
          <Collapsible>
            <CollapsibleTrigger className="flex w-full justify-start rounded-md bg-slate-100 p-2 font-extrabold">
              {t('faq6_title')}{' '}
              <ChevronsUpDown className="ml-auto" size={24}></ChevronsUpDown>
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-slate-50 p-2">
              <p>{t('faq6_text')}</p>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible>
            <CollapsibleTrigger className="flex w-full justify-start rounded-md bg-slate-100 p-2 font-extrabold">
              {t('faq7_title')}{' '}
              <ChevronsUpDown className="ml-auto" size={24}></ChevronsUpDown>
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-slate-50 p-2">
              <p>{t('faq7_text')}</p>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible>
            <CollapsibleTrigger className="flex w-full justify-start rounded-md bg-slate-100 p-2 font-extrabold">
              {t('faq8_title')}{' '}
              <ChevronsUpDown className="ml-auto" size={24}></ChevronsUpDown>
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-slate-50 p-2">
              <p>{t('faq8_text')}</p>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible>
            <CollapsibleTrigger className="flex w-full justify-start rounded-md bg-slate-100 p-2 font-extrabold">
              {t('faq9_title')}{' '}
              <ChevronsUpDown className="ml-auto" size={24}></ChevronsUpDown>
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-slate-50 p-2">
              {t('faq9_text')}{' '}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  )
}

// </AccordionItem>
// <AccordionItem>
//   <AccordionItemHeading>
//     {/* @ts-ignore */}
//     <AccordionItemButton>{t('faq2_title')}</AccordionItemButton>
//   </AccordionItemHeading>
//   <AccordionItemPanel>
//     <div>
//     </div>
//   </AccordionItemPanel>
// </AccordionItem>
// <AccordionItem>
//   <AccordionItemHeading>
//     {/* @ts-ignore */}
//     <AccordionItemButton></AccordionItemButton>
//   </AccordionItemHeading>
//   <AccordionItemPanel>
//     {/* @ts-ignore */}
//     <p>{t('faq3_text')}</p>
//   </AccordionItemPanel>
// </AccordionItem>
// <AccordionItem>
//   <AccordionItemHeading>
//     {/* @ts-ignore */}
//     <AccordionItemButton>{t('faq4_title')}</AccordionItemButton>
//   </AccordionItemHeading>
//   <AccordionItemPanel>
//     {/* @ts-ignore */}
//     <p>{t('faq4_text')}</p>
//   </AccordionItemPanel>
// </AccordionItem>
// <AccordionItem>
//   <AccordionItemHeading>
//     {/* @ts-ignore */}
//     <AccordionItemButton>{t('faq5_title')}</AccordionItemButton>
//   </AccordionItemHeading>
//   <AccordionItemPanel>
//     {/* @ts-ignore */}
//     <div>
//       {/* @ts-ignore */}
//       {t('faq5_text')}{' '}
//       <a
//         href="https://padlet.com/VamosMuenster/feedback-zur-plattform-mapstories-vxeo28o2lzldiwuy"
//         target="_blank"
//       >
//         https://padlet.com/VamosMuenster/feedback-zur-plattform-mapstories-vxeo28o2lzldiwuy
//       </a>
//     </div>
//   </AccordionItemPanel>
// </AccordionItem>
// <AccordionItem>
//   <AccordionItemHeading>
//     {/* @ts-ignore */}
//     <AccordionItemButton>{t('faq6_title')}</AccordionItemButton>
//   </AccordionItemHeading>
//   <AccordionItemPanel>
//     {/* @ts-ignore */}
//     <p>{t('faq6_text')}</p>
//   </AccordionItemPanel>
// </AccordionItem>
// <AccordionItem>
//   <AccordionItemHeading>
//     {/* @ts-ignore */}
//     <AccordionItemButton>{t('faq7_title')}</AccordionItemButton>
//   </AccordionItemHeading>
//   <AccordionItemPanel>
//     {/* @ts-ignore */}
//     <p>{t('faq7_text')}</p>
//   </AccordionItemPanel>
// </AccordionItem>
// <AccordionItem>
//   <AccordionItemHeading>
//     {/* @ts-ignore */}
//     <AccordionItemButton>{t('faq8_title')}</AccordionItemButton>
//   </AccordionItemHeading>
//   <AccordionItemPanel>
//     {/* @ts-ignore */}
//     <p>{t('faq8_text')}</p>
//   </AccordionItemPanel>
// </AccordionItem>
