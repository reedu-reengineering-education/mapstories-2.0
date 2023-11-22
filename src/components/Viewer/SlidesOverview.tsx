import React, { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { getSlideTitle } from '@/src/lib/getSlideTitle'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../Elements/Table'

type Props = {
  page: string
  slug: string
  story: any
}

export function SlidesOverview({ page, slug, story }: Props) {
  const router = useRouter()
  const path = usePathname()

  useEffect(() => {
    console.log(story)
  }, [])

  const goToStep = (position: number) => {
    const pathLocal =
      path?.split('/').splice(2, 3).join('/') ?? 'gallery/all/story/'

    router.push(`${pathLocal}/${slug}/${position}`)
  }

  return (
    <div>
      <div>
        <h1 className="text-2xl font-medium">{story.title}</h1>
        <p className="text-sm text-slate-400">
          {story.steps.length} slides in this story
        </p>
        <p>
          {' '}
          <b>Author:</b> {story.author}
        </p>
        <p>
          <b> Created at:</b> {story.createdAt.toLocaleString()}
        </p>
        <p>
          <b> Last updated at:</b> {story.updatedAt.toLocaleString()}
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Position</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Number of content items</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {story.steps.map((step: any, index: number) => {
            return (
              <TableRow
                className="cursor-pointer border-b bg-slate-50 hover:bg-slate-300"
                key={index}
                onClick={() => goToStep(step.position)}
              >
                <TableCell>{index}</TableCell>
                <TableCell className="w-100[px]">
                  {getSlideTitle(step.content)}
                </TableCell>
                <TableCell>{step.content.length}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export default SlidesOverview
