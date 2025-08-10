import Link from 'next/link';

export default async function NotFound() {
  return (
    <main className="container mx-auto text-center py-20 px-4">
      <h1 className="text-7xl font-extrabold mb-4">404</h1>
      <p className="text-2xl mb-2">Hoppla! Hier hat sich eine Story verlaufen.</p>
      <p className="text-lg text-gray-600 mb-6">Die Seite, die du suchst, ist gerade auf Weltreise gegangen.</p>
      <Link
        className="inline-block px-6 py-3 bg-zinc-700 text-white font-semibold rounded-xl shadow transition-all"
        href="/"
      >
        Zurück zur Startseite
      </Link>
    </main>

  )
}