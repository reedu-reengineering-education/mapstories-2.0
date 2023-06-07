import { useTranslation } from '@/src/app/i18n/client'
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from 'react-accessible-accordion'
import 'react-accessible-accordion/dist/fancy-example.css'
import { useBoundStore } from '@/src/lib/store/store'
export default function FAQTab() {
  const lng = useBoundStore(state => state.language)
  //@ts-ignore
  const { t } = useTranslation(lng, 'faq')

  return (
    <div className="flex flex-col gap-8 p-10">
      <div className="flex flex-col gap-8">
        <Accordion>
          <AccordionItem>
            <AccordionItemHeading>
              {/* @ts-ignore */}
              <AccordionItemButton>{t('faq1_title')}</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              {/* @ts-ignore */}
              <p>{t('faq1_texta')}</p>
              {/* @ts-ignore */}
              <p>{t('faq1_textb')}</p>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionItemHeading>
              {/* @ts-ignore */}
              <AccordionItemButton>{t('faq2_title')}</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <div>
                {/* @ts-ignore */}
                <p>{t('faq2_texta')}</p>
                <br></br>
                {/* @ts-ignore */}

                <p>{t('faq2_textb')}</p>

                <ul className="list-inside list-disc">
                  {/* @ts-ignore */}
                  <li>{t('faq2_lista')}</li>
                  {/* @ts-ignore */}
                  <li>{t('faq2_listb')}</li>
                  {/* @ts-ignore */}
                  <li>{t('faq2_listc')}</li>
                  {/* @ts-ignore */}
                  <li>{t('faq2_listd')}</li>
                  {/* @ts-ignore */}
                  <li>{t('faq2_liste')}</li>
                  {/* @ts-ignore */}
                  <li>{t('faq2_listf')}</li>
                  {/* @ts-ignore */}
                  <li>{t('faq2_listg')}</li>
                </ul>
              </div>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionItemHeading>
              {/* @ts-ignore */}
              <AccordionItemButton>{t('faq3_title')}</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              {/* @ts-ignore */}
              <p>{t('faq3_text')}</p>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionItemHeading>
              {/* @ts-ignore */}
              <AccordionItemButton>{t('faq4_title')}</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              {/* @ts-ignore */}
              <p>{t('faq4_text')}</p>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionItemHeading>
              {/* @ts-ignore */}
              <AccordionItemButton>{t('faq5_title')}</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              {/* @ts-ignore */}
              <div>
                {/* @ts-ignore */}
                {t('faq5_text')}{' '}
                <a
                  href="https://padlet.com/VamosMuenster/kkkuk01uwpqsfo8p"
                  target="_blank"
                >
                  https://padlet.com/VamosMuenster/kkkuk01uwpqsfo8p
                </a>
              </div>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionItemHeading>
              {/* @ts-ignore */}
              <AccordionItemButton>{t('faq6_title')}</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              {/* @ts-ignore */}
              <p>{t('faq6_text')}</p>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionItemHeading>
              {/* @ts-ignore */}
              <AccordionItemButton>{t('faq7_title')}</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              {/* @ts-ignore */}
              <p>{t('faq7_text')}</p>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionItemHeading>
              {/* @ts-ignore */}
              <AccordionItemButton>{t('faq8_title')}</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              {/* @ts-ignore */}
              <p>{t('faq8_text')}</p>
            </AccordionItemPanel>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
