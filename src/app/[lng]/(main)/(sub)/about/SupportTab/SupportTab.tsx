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
  //@ts-ignore
  const { t } = useTranslation(lng, 'supportTab')

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('text1')}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          {/* @ts-ignore */}
          <b>{t('text2Title')}</b>
        </p>
        <p>{t('text2')}</p>
        <p>
          {/* @ts-ignore */}

          <b>{t('text3Title')}</b>
        </p>
        <p>{t('text3')}</p>
        <p>
          {/* @ts-ignore */}

          <b>{t('text4Title')}</b>
        </p>
        <p>{t('text4')}</p>
        <p>
          {/* @ts-ignore */}

          <b>{t('text5Title')} </b>
        </p>
        <p>
          <span>
            {/* @ts-ignore */}
            {t('text5')}
          </span>{' '}
          <a
            className="text-blue-500"
            href="https://github.com/reedu-reengineering-education/mapstories-2.0"
          >
            {/* @ts-ignore */}
            {t('here')}
          </a>
        </p>
      </CardContent>
      <CardFooter>
        <div>
          <Link href="mailto:mapstories@vamos-muenster.de">
            <Button startIcon={<EnvelopeClosedIcon className="w-5" />}>
              {/* @ts-ignore */}
              {t('buttonInquiry')}
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
