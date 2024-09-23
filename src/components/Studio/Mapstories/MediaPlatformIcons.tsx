import { MediaType } from '@prisma/client'

import EmbedIconFactory from '../../Icons/EmbedIconFactory'
import { Tooltip } from '../../Tooltip'

import { motion } from 'framer-motion'

type MediaIconListProps = {
  usedMediaType?: MediaType
}

function moveElementToPosition<T>(
  obj: Record<string, T>,
  elementKey: string,
  position: number,
): Record<string, T> {
  const newObj: Record<string, T> = {}
  let index = 0

  // Füge das Element an der gewünschten Position hinzu
  if (position === 0) {
    newObj[elementKey] = obj[elementKey]
  }

  // Durchlaufe das ursprüngliche Objekt und füge die restlichen Elemente hinzu
  for (const key in obj) {
    if (key !== elementKey) {
      // Füge das Element an der gewünschten Position hinzu
      if (index === position) {
        newObj[elementKey] = obj[elementKey]
      }
      newObj[key] = obj[key]
      index++
    }
  }

  // Füge das Element am Ende hinzu, falls die Position größer als die Anzahl der Elemente im Objekt ist
  if (position >= index) {
    newObj[elementKey] = obj[elementKey]
  }

  return newObj
}

const mediaNames = new Map<MediaType, string>([
  ['EXTERNALIMAGE', 'Bild von URL'],
  ['YOUTUBE', 'YouTube'],
  ['INSTAGRAM', 'Instagram'],
  ['TIKTOK', 'TikTok'],
  ['WIKIPEDIA', 'Wikipedia'],
  ['PADLET', 'Padlet'],
  ['TWITTER', 'Twitter'],
  ['FACEBOOK', 'Facebook'],
  ['SPOTIFY', 'Spotify'],
  ['SOUNDCLOUD', 'Soundcloud'],
  ['VIMEO', 'Vimeo'],
  ['DAILYMOTION', 'Dailymotion'],
  ['LAMAPOLL', 'LamaPoll'],
])

export default function MediaIconList({ usedMediaType }: MediaIconListProps) {
  // redeclare as let variable if more postions need to moved
  const newObject = moveElementToPosition(MediaType, 'EXTERNALIMAGE', 1)
  return (
    <div className="flex -space-x-3">
      {Object.keys(newObject)
        .filter(
          t =>
            !['TITLE', 'TEXT', 'IMAGE', 'VIDEO', 'GOOGLESTREETVIEW'].includes(
              t,
            ),
        ) // Only the social media types
        .filter(t => {
          if (!usedMediaType) {
            return true
          }
          return t === usedMediaType
        })
        .map(icon => (
          <motion.div
            animate={{
              y: 0,
              x: 0,
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            initial={{
              y: 0,
              x: -100,
              opacity: 0,
            }}
            key={icon}
            layout
            transition={{
              layout: {
                duration: 0.3,
              },
            }}
          >
            <Tooltip
              content={mediaNames.get(icon as MediaType) as string}
              maxwidth={'350px'}
            >
              <div>
                <EmbedIconFactory type={icon as MediaType} />
              </div>
            </Tooltip>
          </motion.div>
        ))}
    </div>
  )
}
