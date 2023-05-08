import Link from 'next/link'

function Custom404() {
  return (
    <div>
      <div>
        <h1>404 - Seite nicht gefunden/Site not found</h1>
        <p>
          Die von Ihnen gesuchte Seite existiert nicht oder wurde verschoben.
        </p>
        <p>The page you were looking for does not exist or was moved</p>

        <Link href="/">Zurück zur vorherigen Seite/Back to previous page</Link>
      </div>
    </div>
  )
}

export default Custom404
