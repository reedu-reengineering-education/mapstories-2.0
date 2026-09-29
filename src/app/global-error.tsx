'use client'

import { useEffect } from 'react'

// Fallback for errors thrown in the root layout itself ([lng]/layout.tsx),
// which [lng]/error.tsx cannot catch. Must render its own <html>/<body>.
export default function GlobalError({
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
    <html lang="de">
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          margin: 0,
          padding: '0 16px',
          textAlign: 'center',
          color: '#0f172a',
        }}
      >
        <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: '0 0 1rem' }}>
          Hoppla!
        </h1>
        <p style={{ fontSize: '1.5rem', margin: '0 0 1.5rem' }}>
          Beim Laden ist etwas schiefgelaufen.
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => reset()}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              border: 'none',
              background: '#3f3f46',
              color: 'white',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Erneut versuchen
          </button>
          <a
            href="/"
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              border: '1px solid #3f3f46',
              color: '#3f3f46',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Zur Startseite
          </a>
        </div>
      </body>
    </html>
  )
}
