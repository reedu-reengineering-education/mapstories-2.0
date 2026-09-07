'use client'

import { useEffect, useState } from 'react'
import { cx } from 'class-variance-authority'
import { HTMLAttributes } from 'react'
import {
  LogoWithTextAndBackground,
  LogoWithTextTransparent,
} from './MapstoriesLogo'

import connectLogo from '@/assets/images/logo/bfdw-connect-logo.png'
import Image from 'next/image'
import { isBfdwHostname } from '@/src/lib/site'

// Drop the BFDW logo file at public/logos/bfdw-logo.png (and -transparent.png
// for the InverseNavbar variant) to enable the swap below.
function useIsBfdwSite() {
  const [isBfdw, setIsBfdw] = useState(false)

  useEffect(() => {
    setIsBfdw(isBfdwHostname(window.location.hostname))
  }, [])

  return isBfdw
}

export function SiteLogo(props: HTMLAttributes<HTMLDivElement>) {
  const isBfdw = useIsBfdwSite()

  if (isBfdw) {
    return (
      <div
        {...props}
        className={cx('relative h-10 w-32 rounded bg-white p-2', props.className)}
      >
        <Image
          alt="BFDW Logo"
          className="h-full w-full object-contain scale-[3] pointer-events-none"
          src={connectLogo}
        />
      </div>
    )
  }

  return <LogoWithTextAndBackground {...props} />
}

export function SiteLogoTransparent(props: HTMLAttributes<HTMLDivElement>) {
  const isBfdw = useIsBfdwSite()

  if (isBfdw) {
    return (
      <div
        {...props}
        className={cx('relative h-10 w-32 rounded bg-transparent p-2', props.className)}
      >
        <Image
          alt="BFDW Logo"
          className="h-full w-full object-contain scale-[3] pointer-events-none"
          src={connectLogo}
        />
      </div>
    )
  }

  return <LogoWithTextTransparent {...props} />
}
