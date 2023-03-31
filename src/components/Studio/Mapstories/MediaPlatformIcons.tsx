import { MediaType } from '@prisma/client'

import EmbedIconFactory from '../../Icons/EmbedIconFactory'
import { Tooltip } from '../../Tooltip'

import { AnimatePresence, motion } from 'framer-motion'

type MediaIconListProps = {
  usedMediaType?: MediaType
}

const mediaNames = new Map<MediaType, string>([
  ['YOUTUBE', 'YouTube'],
  ['INSTAGRAM', 'Instagram'],
  ['TIKTOK', 'TikTok'],
  ['WIKIPEDIA', 'Wikipedia'],
  ['PADLET', 'Padlet'],
  ['TWITTER', 'Twitter'],
  ['FACEBOOK', 'Facebook'],
])

export default function MediaIconList({ usedMediaType }: MediaIconListProps) {
  return (
    <div className="flex -space-x-2">
      <AnimatePresence>
        {Object.keys(MediaType)
          .filter(t => !['TITLE', 'TEXT', 'IMAGE', 'VIDEO'].includes(t)) // Only the social media types
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
      </AnimatePresence>
    </div>
  )
}
