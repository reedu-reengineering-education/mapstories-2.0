'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { userAuthSchema } from '@/lib/validations/auth'
import { toast } from '@/lib/toast'
import { cx } from 'class-variance-authority'
import { Button } from '../Elements/Button'

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
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const searchParams = useSearchParams()

  async function onSubmit(data: FormData) {
    setIsLoading(true)

    const signInResult = await signIn('email', {
      email: data.email.toLowerCase(),
      redirect: false,
      callbackUrl: searchParams.get('from') || '/studio',
    })

    setIsLoading(false)

    if (!signInResult?.ok) {
      return toast({
        title: 'Something went wrong.',
        message: 'Your sign in request failed. Please try again.',
        type: 'error',
      })
    }

    return toast({
      title: 'Check your email',
      message: 'We sent you a login link. Be sure to check your spam too.',
      type: 'success',
    })
  }

  return (
    <div className={cx('grid gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <label className="sr-only" htmlFor="email">
              Email
            </label>
            <input
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className="my-0 mb-2 block h-9 w-full rounded-md border border-slate-300 py-2 px-3 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:ring-offset-1"
              disabled={isLoading}
              id="email"
              placeholder="name@example.com"
              type="email"
              {...register('email')}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <Button isLoading={isLoading} type="submit">
            Sign In with Email
          </Button>
        </div>
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
