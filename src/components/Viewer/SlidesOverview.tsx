import React from 'react'
import { getSlideTitle } from '@/src/lib/getSlideTitle'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../Elements/Table'
import { useTranslation } from '@/src/app/i18n/client'
import { navigateToStep } from '@/src/lib/viewerNavigation'

type Props = {
  lng: string
  page: string
  slug: string
  story: any
}
export function SlidesOverview({ lng, page, slug, story }: Props) {

  //@ts-expect-error
  const { t } = useTranslation(lng, 'slidesOverview')

  const goToStep = (position: number) => {
    navigateToStep(position)
  }

  return (
    <div>
      <div>
        <h1 className="text-2xl font-medium">{story.title}</h1>
        <p>
          {' '}
          <b>{t('author')}</b> {story.author}
        </p>
        <p>
          <b> {t('createdAt')}</b> {story.createdAt.toLocaleString()}
        </p>
        <p>
          <b> {t('updatedAt')}</b> {story.updatedAt.toLocaleString()}
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('position')}</TableHead>
            <TableHead>{t('title')}</TableHead>
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
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export default SlidesOverview
