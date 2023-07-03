'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { userAuthSchema } from '@/src/lib/validations/auth'
import { toast } from '@/src/lib/toast'
import { cx } from 'class-variance-authority'
import { Button } from '../Elements/Button'
import { Input } from '../Elements/Input'
import { useBoundStore } from '@/src/lib/store/store'
import { useTranslation } from '@/src/app/i18n/client'
import { useRouter } from 'next/navigation'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof userAuthSchema>

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  })
  const lng = useBoundStore(state => state.language)
  const { t } = useTranslation(lng, 'login')

  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const searchParams = useSearchParams()

  const router = useRouter()

  async function onSubmit(data: FormData) {
    setIsLoading(true)

    const signInResult = await signIn('email', {
      email: data.email.toLowerCase(),
      redirect: false,
      callbackUrl: searchParams?.get('from') ?? '/storylab',
    })

    setIsLoading(false)

    if (!signInResult?.ok) {
      return toast({
        title: t('something_wrong'),
        message: t('signin_fail'),
        type: 'error',
      })
    }

    router.push('checkmail')
    return toast({
      title: t('check_mail'),
      message: t('send_login_link'),
      type: 'success',
    })
  }

  return (
    <div className={cx(className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect="off"
          className="w-full"
          disabled={isLoading}
          errors={errors.email}
          id="email"
          placeholder="name@example.com"
          type="email"
          {...register('email')}
        />
        <Button className="w-full" isLoading={isLoading} type="submit">
          {t('sign_in_with_email')}
        </Button>
      </form>
      {/* Below this block we could add further login methods */}
      {/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-300"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-slate-600">Or continue with</span>
        </div>
      </div> */}
    </div>
  )
}
