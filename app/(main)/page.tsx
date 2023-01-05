import { Button } from '@/components/Elements/Button'
import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <section className="container grid items-center justify-center gap-6 pt-6 pb-8 md:pt-10 md:pb-12 lg:pt-16 lg:pb-24">
        <div className="mx-auto flex flex-col items-start gap-4 lg:w-[52rem]">
          <h1 className="text-3xl font-bold sm:text-5xl md:text-6xl">
            Mapstories
          </h1>
          <p className="text-slate-700 sm:text-xl sm:leading-8">
            Globale Geschichten <span className="font-bold">interaktiv</span>{' '}
            erzählen
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button>Los gehts</Button>
          </Link>
          <Link href={'#'} rel="noreferrer" target="_blank">
            <Button variant={'inverse'}>Weitere Infos</Button>
          </Link>
          <Button variant={'danger'}>Danger Dan</Button>
        </div>
      </section>
    </div>
  )
}
