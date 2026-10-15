'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline'

import { Card } from '@/src/components/Card'
import { Button } from '@/src/components/Elements/Button'
import { Modal } from '@/src/components/Modal'
import { useTranslation } from '@/src/app/i18n/client'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { useBoundStore } from '@/src/lib/store/store'
import { getLanguageInfo } from '@/src/lib/languageFlags'
import {
  reviewTranslation,
  ReviewTranslationAction,
} from '@/src/lib/api/story/reviewTranslation'
import { toast } from '@/src/lib/toast'

type TranslationRequest = {
  id: string
  slug: string
  language: string
  submittedAt: string
  translator: string
}

type Props = {
  requests: TranslationRequest[]
  // languages already present in the story group; only one per language
  existingLanguages: string[]
}

export default function TranslationRequestList({
  requests,
  existingLanguages,
}: Props) {
  const router = useRouter()
  let lng = useBoundStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }
  // @ts-ignore useTranslation type overloads are complex
  const { t } = useTranslation(lng, 'translationRequests')
  const [loadingId, setLoadingId] = useState<string>()
  const [rejectRequest, setRejectRequest] = useState<TranslationRequest>()

  async function onReview(
    request: TranslationRequest,
    action: ReviewTranslationAction,
  ) {
    setLoadingId(request.id)
    try {
      await reviewTranslation(request.id, action)
      toast({
        title: getLanguageInfo(request.language).label,
        message: t(action === 'approve' ? 'approved' : 'rejected'),
        type: 'success',
      })
      setRejectRequest(undefined)
      router.refresh()
    } catch {
      toast({
        title: t('reviewError'),
        message: t('reviewError'),
        type: 'error',
      })
    } finally {
      setLoadingId(undefined)
    }
  }

  if (requests.length === 0) {
    return <p className="text-slate-600">{t('noRequests')}</p>
  }

  return (
    <div className="flex flex-col gap-2">
      {requests.map(request => {
        const info = getLanguageInfo(request.language)
        const languageTaken = existingLanguages.includes(request.language)
        return (
          <Card key={request.id}>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <span aria-label={info.label} className="text-xl" role="img">
                  {info.flag}
                </span>
                {info.label}
              </Card.Title>
              <Card.Description>
                {t('submittedBy', {
                  translator: request.translator,
                  date: new Date(request.submittedAt).toLocaleDateString(lng),
                })}
              </Card.Description>
            </Card.Header>
            <Card.Footer>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/mystories/all/story/${request.slug}/start`}
                  target="_blank"
                >
                  <Button
                    startIcon={<EyeIcon className="w-5" />}
                    variant={'inverse'}
                  >
                    {t('preview')}
                  </Button>
                </Link>
                <Button
                  disabled={languageTaken || !!loadingId}
                  isLoading={loadingId === request.id}
                  onClick={() => onReview(request, 'approve')}
                  startIcon={<CheckIcon className="w-5" />}
                >
                  {t('approve')}
                </Button>
                <Button
                  disabled={!!loadingId}
                  onClick={() => setRejectRequest(request)}
                  startIcon={<XMarkIcon className="w-5" />}
                  variant={'danger'}
                >
                  {t('reject')}
                </Button>
                {languageTaken && (
                  <span className="text-xs text-slate-500">
                    {t('languageExists')}
                  </span>
                )}
              </div>
            </Card.Footer>
          </Card>
        )
      })}

      <Modal
        onOpenChange={open => !open && setRejectRequest(undefined)}
        open={!!rejectRequest}
        title={t('rejectTitle')}
      >
        <div className="px-6 pb-6">
          <p className="mb-6 text-base text-slate-600">
            {t('rejectDescription')}
          </p>
          <div className="flex justify-end gap-3">
            <Button
              disabled={!!loadingId}
              onClick={() => setRejectRequest(undefined)}
              variant={'inverse'}
            >
              {t('cancel')}
            </Button>
            <Button
              disabled={!!loadingId}
              isLoading={!!loadingId}
              onClick={() => rejectRequest && onReview(rejectRequest, 'reject')}
              variant={'danger'}
            >
              {t('reject')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
