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
// BFDW subdomain (e.g. bfdw.mapstories.de) must be exposed publicly so it can
// be compared to window.location.hostname on the client.
const BFDW_DOMAIN = process.env.NEXT_PUBLIC_BFDW_DOMAIN

// Drop the BFDW logo file at public/logos/bfdw-logo.png (and -transparent.png
// for the InverseNavbar variant) to enable the swap below.
function useIsBfdwSite() {
  const [isBfdw, setIsBfdw] = useState(false)

  useEffect(() => {
    if (BFDW_DOMAIN && window.location.hostname === BFDW_DOMAIN) {
      setIsBfdw(true)
    }
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Image
          alt="BFDW Logo"
          className="h-full w-full object-contain scale-[3]"
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
          className="h-full w-full object-contain scale-[3]"
          src={connectLogo}
        />
      </div>
    )
  }

  return <LogoWithTextTransparent {...props} />
}
