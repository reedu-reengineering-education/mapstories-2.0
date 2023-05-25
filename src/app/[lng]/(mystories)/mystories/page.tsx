import { Metadata } from 'next/types'

export const metadata: Metadata = {
  title: 'Mystories',
  openGraph: {
    title: 'Mystories',
  },
}
interface MystoriesPageProps {}

export default async function MystoriesPage({}: MystoriesPageProps) {
  return <div></div>
}
