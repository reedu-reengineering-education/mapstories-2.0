import Link from 'next/link'

function Custom404() {
  return (
    <div>
      <div>
        <h1>404 - Seite nicht gefunden</h1>
        <p>
          Die von Ihnen gesuchte Seite existiert nicht oder wurde verschoben.
        </p>

        <Link href="/">Zurück zur vorherigen Seite</Link>
      </div>
    </div>
  )
}

export default Custom404
