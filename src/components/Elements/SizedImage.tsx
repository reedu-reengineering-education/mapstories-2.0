import { cx } from 'class-variance-authority'
import { Spinner } from './Spinner'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'

type ImageProps = {
  src: string
  size: string
  alt?: string
  source?: string
}

export default function SizedImage({ src, size, alt, source }: ImageProps) {
  let width, height
  switch (size) {
    case 's':
      width = 100
      height = 100
      break
    case 'm':
      width = 200
      height = 200
      break
    case 'l':
      width = 300
      height = 300
      break
    case 'xs':
      width = 50
      height = 50
      break
    default:
      width = 100
      height = 100
  }
  let lng = useBoundStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }

  const { t } = useTranslation(lng, 'embeds')
  if (src) {
    return (
      <div className="flex flex-col items-start">
        <img
          className={cx(
            'max-h-[20rem] object-scale-down',
            size == 'xs' ? 'h-10 w-10' : '',
          )}
          // className="max-h-[20rem] object-scale-down"
          src={src}
        ></img>
        {/* subtitle below the picture */}
        {source && (
          <div className="py-2 text-center text-sm text-slate-500">
            {/* @ts-ignore */}
            <span>{t('embeds:EmbedContentEdit.source') + ': ' + source}</span>
          </div>
        )}

        {/* <Image
          alt={alt ? alt : src}
          className="max-w-[100%]"
          layout="fill"
          src={src}
          // width={1000}
          // objectFit="contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw,  33vw"
        /> */}
      </div>
    )
  }
  return <Spinner></Spinner>
}
