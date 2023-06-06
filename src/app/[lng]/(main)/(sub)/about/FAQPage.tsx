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
export default function FAQPage() {
  const lng = useBoundStore(state => state.language)

  const { t } = useTranslation(lng, 'faq')

  return (
    <div className="flex flex-col gap-8 p-10">
      <div className="flex flex-col gap-8">
        <Accordion>
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton>{t('faq1_title')}</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <p>{t('faq1_texta')}</p>
              <p>{t('faq1_textb')}</p>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton>{t('faq2_title')}</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <p>
                <p>{t('faq2_texta')}</p>
                <br></br>
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
              </p>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton>{t('faq3_title')}</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <p>{t('faq3_text')}</p>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton>{t('faq4_title')}</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <p>{t('faq4_text')}</p>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton>{t('faq5_title')}</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <p>
                {t('faq5_text')}{' '}
                <a
                  href="https://padlet.com/VamosMuenster/kkkuk01uwpqsfo8p"
                  target="_blank"
                >
                  https://padlet.com/VamosMuenster/kkkuk01uwpqsfo8p
                </a>
              </p>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton>{t('faq6_title')}</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <p>{t('faq6_text')}</p>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton>{t('faq7_title')}</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <p>{t('faq7_text')}</p>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton>{t('faq8_title')}</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <p>{t('faq8_text')}</p>
            </AccordionItemPanel>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
