import { useBoundStore } from '@/src/lib/store/store'
import { useTranslation } from '@/src/app/i18n/client'
import Link from 'next/link'
import { Button } from '@/src/components/Elements/Button'
import { EnvelopeClosedIcon } from '@radix-ui/react-icons'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/src/components/Elements/Card'

export default function SupportTab() {
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, 'supportTab')

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('text1')}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          <b>{t('text2Title')}</b>
        </p>
        <p>{t('text2')}</p>
        <p>
          <b>{t('text3Title')}</b>
        </p>
        <p>{t('text3')}</p>
        <div>
          <a
            className="text-blue-500"
            href="https://secure.spendenbank.de/form/3267?langid=1"
          >
            {t('Here')}
          </a>
          <span>{t('donate')}</span>
        </div>
        <p>
          <b>{t('text4Title')}</b>
        </p>
        <p>{t('text4')}</p>
        <p>
          <b>{t('text5Title')} </b>
        </p>
        <p>
          <span>{t('text5')}</span>{' '}
          <a
            className="text-blue-500"
            href="https://github.com/reedu-reengineering-education/mapstories-2.0"
          >
            {t('here')}
          </a>
        </p>
      </CardContent>
      <CardFooter>
        <div>
          <Link href="mailto:mapstories@vamos-muenster.de">
            <Button startIcon={<EnvelopeClosedIcon className="w-5" />}>
              {t('buttonInquiry')}
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
