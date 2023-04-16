import Link from 'next/link'

import { Button } from '@/src/components/Elements/Button'
import { UserAuthForm } from '@/src/components/Auth/UserAuthForm'
import { GlobeAltIcon } from '@heroicons/react/24/outline'

export default function RegisterPage() {
  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link className="absolute right-4 top-4" href="/login">
        <Button variant={'inverse'}>Login</Button>
      </Link>
      <div className="hidden h-full bg-slate-100 lg:block" />
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <GlobeAltIcon className="mx-auto h-6 w-6" />
            <h1 className="text-2xl font-bold">Create an account</h1>
            <p className="text-sm text-slate-600">
              Enter your email below to create your account
            </p>
          </div>
          <UserAuthForm />
          <p className="px-8 text-center text-sm text-slate-600">
            By clicking continue, you agree to our{' '}
            <Link className="hover:text-brand underline" href="/terms">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link className="hover:text-brand underline" href="/privacy">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
