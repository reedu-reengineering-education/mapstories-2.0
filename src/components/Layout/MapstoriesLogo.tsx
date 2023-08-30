import Image from 'next/image'

import logoText from '@/assets/logos/logo_text.png'
import logoNoText from '@/assets/logos/logo_no_text.png'
import logoClaim from '@/assets/logos/logo_text_claim.png'
import logoTextTransparent from '@/assets/logos/logo_text_transparent.png'
import logoZeitgeisty from '@/assets/logos/mapstories_finallogo-01.svg'
import { HTMLAttributes } from 'react'
import { cx } from 'class-variance-authority'

export function LogoWithTextAndBackground(
  props: HTMLAttributes<HTMLDivElement>,
) {
  return (
    <div
      {...props}
      className={cx('relative h-10 w-32 rounded bg-white p-2', props.className)}
    >
      <Image
        alt="Mapstories Logo"
        className="object-contain"
        fill
        src={logoText}
      />
    </div>
  )
}

export function LogoWithTextTransparent(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cx(
        'relative h-10 w-32 rounded bg-transparent p-2',
        props.className,
      )}
    >
      <Image
        alt="Mapstories Logo"
        className="object-contain"
        fill
        src={logoTextTransparent}
      />
    </div>
  )
}

export function LogoWithoutTextAndBackground(
  props: HTMLAttributes<HTMLDivElement>,
) {
  return (
    <div
      {...props}
      className={cx('relative h-10 w-10 rounded bg-white p-2', props.className)}
    >
      <Image
        alt="Mapstories Logo"
        className="object-contain"
        fill
        src={logoNoText}
      />
    </div>
  )
}

export function LogoWithClaimAndBackground(
  props: HTMLAttributes<HTMLDivElement>,
) {
  return (
    <div
      {...props}
      className={cx('relative h-10 w-32 rounded bg-white p-2', props.className)}
    >
      <Image
        alt="Mapstories Logo"
        className="object-contain"
        fill
        src={logoClaim}
      />
    </div>
  )
}

export function LogoZeitgeisty(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cx('relative h-10 w-32 rounded bg-white p-2', props.className)}
    >
      <Image
        alt="Mapstories Logo"
        className="object-contain"
        fill
        src={logoZeitgeisty}
      />
    </div>
  )
}
