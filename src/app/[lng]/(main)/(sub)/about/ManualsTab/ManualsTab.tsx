import { useBoundStore } from '@/src/lib/store/store'
import { useTranslation } from '@/src/app/i18n/client'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/src/components/Elements/Card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/src/components/Elements/Collapsible'
import { ChevronsUpDown } from 'lucide-react'

export default function ManualsTab() {
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, 'manualsTab')

  return (
    <Card>
      <CardHeader>
        {/* @ts-ignore */}
        <CardTitle>{t('title')}</CardTitle>
        {/* @ts-ignore */}
        <CardDescription>{t('startText')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <Collapsible>
            <CollapsibleTrigger className="flex w-full justify-start rounded-md bg-slate-100 p-2 font-extrabold">
              {t('manuals1_title')}{' '}
              <ChevronsUpDown className="ml-auto" size={24}></ChevronsUpDown>
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-slate-50 p-2">
              <p>{t('manuals1_texta')}</p>
              <p>{t('manuals1_textb')}</p>
              <ol className="list-inside list-decimal p-2">
                <li
                  dangerouslySetInnerHTML={{ __html: t('manuals1_lista') }}
                ></li>
                <li
                  dangerouslySetInnerHTML={{ __html: t('manuals1_listb') }}
                ></li>
                <li
                  dangerouslySetInnerHTML={{ __html: t('manuals1_listc') }}
                ></li>
                <li
                  dangerouslySetInnerHTML={{ __html: t('manuals1_listd') }}
                ></li>
                <li
                  dangerouslySetInnerHTML={{ __html: t('manuals1_liste') }}
                ></li>
                <li
                  dangerouslySetInnerHTML={{ __html: t('manuals1_listf') }}
                ></li>
                <li
                  dangerouslySetInnerHTML={{ __html: t('manuals1_listg') }}
                ></li>
                <li
                  dangerouslySetInnerHTML={{ __html: t('manuals1_listh') }}
                ></li>
                <li
                  dangerouslySetInnerHTML={{ __html: t('manuals1_listi') }}
                ></li>
                <li
                  dangerouslySetInnerHTML={{ __html: t('manuals1_listj') }}
                ></li>
              </ol>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
      <CardFooter>
        <div></div>
      </CardFooter>
    </Card>
  )
}
