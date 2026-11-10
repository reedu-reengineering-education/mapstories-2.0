'use client'

import Link from 'next/link'
import { Story } from '@prisma/client'
import {
  ArrowRightIcon,
  EyeIcon,
  LanguageIcon,
  PencilIcon,
} from '@heroicons/react/24/outline'

import { Card } from '@/src/components/Card'
import { Button } from '@/src/components/Elements/Button'
import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'
import { getLanguageInfo } from '@/src/lib/languageFlags'
import DeleteMapstoryButton from './DeleteMapstoryButton'

type Props = {
  translation: Pick<
    Story,
    'id' | 'slug' | 'name' | 'language' | 'ownerId' | 'translationStatus'
  > & {
    firstStepId: string | null
    translationOf: {
      name: string | null
      language: string
      author: string | null
      owner: { name: string | null } | null
    } | null
  }
  currentUserId: string
}

const statusStyles: Record<string, string> = {
  DRAFT: 'bg-slate-100 text-slate-700',
  PENDING: 'bg-blue-100 text-blue-800',
  REJECTED: 'bg-red-100 text-red-800',
  APPROVED: 'bg-green-100 text-green-800',
}

// A community translation in the translator's storylab overview.
export function TranslationCard({ translation, currentUserId }: Props) {
  const lng = useBoundStore(state => state.language)
  // @ts-ignore useTranslation type overloads are complex
  const { t } = useTranslation(lng, ['translationRequests', 'mapstoryCard'])
  const info = getLanguageInfo(translation.language)
  const original = translation.translationOf
  const sourceInfo = original ? getLanguageInfo(original.language) : null
  const originalAuthor = original?.owner?.name || original?.author
  const status = translation.translationStatus ?? 'APPROVED'
  // drafts belong to the translator; approved ones were handed to the author
  const isDraftOwner = translation.ownerId === currentUserId

  return (
    // amber accent sets these apart from the user's own stories
    <Card className="border-l-4 border-l-amber-400">
      <Card.Header>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
            <LanguageIcon className="h-3.5 w-3.5" />
            {t('translationRequests:communityTranslation')}
          </span>
          <span
            className={
              'rounded-full px-2 py-0.5 text-xs font-medium ' +
              (statusStyles[status] ?? '')
            }
          >
            {t(`translationRequests:status${status}`)}
          </span>
        </div>
        <Card.Title className="flex items-center gap-2">
          {sourceInfo && (
            <>
              <span
                aria-label={sourceInfo.label}
                className="text-xl"
                role="img"
              >
                {sourceInfo.flag}
              </span>
              <ArrowRightIcon className="h-4 w-4 text-slate-400" />
            </>
          )}
          <span aria-label={info.label} className="text-xl" role="img">
            {info.flag}
          </span>
          {translation.name}
        </Card.Title>
        {original?.name && (
          <Card.Description>
            {t('translationRequests:translationOf', { story: original.name })}
            {originalAuthor && (
              <>
                {' · '}
                {t('translationRequests:originalBy', {
                  author: originalAuthor,
                })}
              </>
            )}
          </Card.Description>
        )}
      </Card.Header>
      <Card.Footer>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Link href={`/mystories/all/story/${translation.slug}/start`}>
              <Button startIcon={<EyeIcon className="w-5" />}>
                {t('mapstoryCard:play')}
              </Button>
            </Link>
            <Link
              href={`/storylab/${translation.slug}/${translation.firstStepId ?? ''}`}
            >
              <Button
                startIcon={<PencilIcon className="w-5" />}
                variant={'inverse'}
              >
                {t('mapstoryCard:edit')}
              </Button>
            </Link>
          </div>
          {isDraftOwner && <DeleteMapstoryButton id={translation.id} />}
        </div>
      </Card.Footer>
    </Card>
  )
}
