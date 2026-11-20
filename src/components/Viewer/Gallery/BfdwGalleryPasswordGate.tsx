'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/src/components/Elements/Input'
import { Button } from '@/src/components/Elements/Button'
import { useTranslation } from '@/src/app/i18n/client'
import { unlockBfdwGallery } from '@/src/lib/api/gallery/unlockBfdwGallery'

type Props = {
  lng: string
}

export function BfdwGalleryPasswordGate({ lng }: Props) {
  const { t } = useTranslation(lng, 'gallery')
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(false)

    try {
      await unlockBfdwGallery(password)
      router.refresh()
    } catch {
      setError(true)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-zinc-900 px-4">
      <form
        className="re-basic-box w-full max-w-sm bg-white p-6"
        onSubmit={handleSubmit}
      >
        <h3 className="pb-1">{t('gallery_password_title')}</h3>
        <p className="pb-4 text-sm">{t('gallery_password_description')}</p>
        <Input
          autoFocus
          onChange={e => setPassword(e.target.value)}
          placeholder={t('gallery_password_placeholder')}
          required
          type="password"
          value={password}
        />
        {error && (
          <p className="pb-2 text-sm text-red-600">
            {t('gallery_password_error')}
          </p>
        )}
        <Button disabled={isSubmitting} isLoading={isSubmitting} type="submit">
          {t('gallery_password_submit')}
        </Button>
      </form>
    </div>
  )
}
