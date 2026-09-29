'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto flex h-full flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="mb-4 text-5xl font-extrabold">Hoppla!</h1>
      <p className="mb-2 text-2xl">Beim Laden ist etwas schiefgelaufen.</p>
      <p className="mb-6 text-lg text-gray-600">
        Bitte versuche es erneut oder kehre zur Startseite zurück.
      </p>
      <div className="flex gap-4">
        <button
          className="inline-block rounded-xl bg-zinc-700 px-6 py-3 font-semibold text-white shadow transition-all"
          onClick={() => reset()}
        >
          Erneut versuchen
        </button>
        <Link
          className="inline-block rounded-xl border border-zinc-700 px-6 py-3 font-semibold text-zinc-700 shadow transition-all"
          href="/"
        >
          Zur Startseite
        </Link>
      </div>
    </div>
  )
}
