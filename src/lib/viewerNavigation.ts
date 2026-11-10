/**
 * Client-side navigation between steps of an already loaded story.
 *
 * The step is part of the dynamic `[...slug]` route, so `router.push` would
 * re-render the whole viewer page on the server and remount it (losing
 * transitions and refetching the story). All steps are already on the client,
 * so we only swap the URL via `history.pushState`, which Next (>= 14.1) syncs
 * with `usePathname` and back/forward navigation.
 */

// `/<lng>/<area>/<filter>/story/<slug>/<page>` -> ['<slug>', '<page>']
export function getViewerSlugFromPath(pathname?: string | null) {
  if (!pathname) {
    return undefined
  }
  const parts = pathname.split('/')
  const storyIdx = parts.indexOf('story')
  if (storyIdx < 0 || parts.length < storyIdx + 3) {
    return undefined
  }
  return parts.slice(storyIdx + 1, storyIdx + 3).map(decodeURIComponent)
}

export function navigateToStep(page: number | 'start') {
  if (typeof window === 'undefined') {
    return
  }
  const parts = window.location.pathname.split('/')
  const storyIdx = parts.indexOf('story')
  if (storyIdx < 0 || parts.length < storyIdx + 2) {
    return
  }
  const base = parts.slice(0, storyIdx + 2).join('/')
  const url = `${base}/${page}${window.location.search}`
  if (url !== `${window.location.pathname}${window.location.search}`) {
    window.history.pushState(null, '', url)
  }
}
