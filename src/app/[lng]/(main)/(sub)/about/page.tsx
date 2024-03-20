import type { Metadata } from 'next/types'
import AnimatedMap from './AnimatedMap'
import PageContent from './PageContent'

export const metadata: Metadata = {
  title: 'About',
  openGraph: {
    title: 'About',
  },
}

export default function Page() {
  return (
    <>
      <div className="relative h-[100vh] w-full ">
        <AnimatedMap />
      </div>
      <div className="z-20 mx-auto my-6 flex-1 -translate-y-[95vh] p-10 ">
        <PageContent />
      </div>
    </>
  )
}
