import { PageHeader } from '@/src/components/PageHeader'
import type { Metadata } from 'next/types'

export const metadata: Metadata = {
  title: 'About',
  openGraph: {
    title: 'About',
  },
}

export default function Page() {
  return (
    <div>
      <PageHeader heading="Über Mapstories"></PageHeader>

      <h3>Wer steckt hinter mapstories.de?</h3>

      <p className="py-4">
        Mapstories.de ist im Rahmen einer Zusammenarbeit zwischen Re:edu GmbH &
        Co.KG und Vamos e.V. entstanden. Der Ausgangspunkt des Projekts war die
        Durchführung eines ko-kreativen Labs zur globalen Bekleidungsindustrie.
        Dabei stellt Mapstories ein webbasiertes OpenSource-Tool dar, mit dem
        die Schüler*innen eigenständig einen Einstieg in die
        entwicklungspolitische Bildungsarbeit zum oben genannten Thema
        konzipierten. Die Mapstories sind durch die Möglichkeit der
        anschaulichen Herstellung systemischer Verknüpfungen vor allem im
        Kontext der Bildung für nachhaltige Entwicklung einsetzbar und
        ermöglichen einen umfassenden Blick auf globale Themen.
      </p>
      <iframe
        src="http://localhost:3000/gallery/story/clglzvqh00001t0pdc7tfgfp1"
        // style={{border:none, width:100%, height:100%}}
        title="Mapstories"
      ></iframe>
    </div>
  )
}
