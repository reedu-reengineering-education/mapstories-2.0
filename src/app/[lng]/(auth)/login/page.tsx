import Link from 'next/link'

import { Button } from '@/src/components/Elements/Button'
import { UserAuthForm } from '@/src/components/Auth/UserAuthForm'
import { ChevronLeftIcon, GlobeAltIcon } from '@heroicons/react/24/outline'

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link className="absolute left-4 top-4" href="/">
        <Button
          startIcon={<ChevronLeftIcon className="w-4" />}
          variant={'inverse'}
        >
          Zurück
        </Button>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <GlobeAltIcon className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-bold">Willkommen zurück</h1>
          <p className="text-sm text-slate-600">
            Enter your email to sign in to your account
          </p>
        </div>
        <UserAuthForm />
        <p className="px-8 text-center text-sm text-slate-600">
          <Link className="hover:text-brand underline" href="/register">
            Don&apos;t have an account? Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
