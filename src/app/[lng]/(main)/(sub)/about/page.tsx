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
        <div className="absolute bottom-0 z-20 h-1/4 w-full bg-gradient-to-b " />
        <AnimatedMap />
      </div>
      <div className="z-20 mx-auto my-6 flex-1 -translate-y-[90vh] p-10 ">
        <PageContent />
      </div>
    </>
  )
}
