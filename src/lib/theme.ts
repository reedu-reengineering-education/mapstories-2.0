import { Site } from '@prisma/client'
import { getBfdwTopic } from './bfdwTopics'

export const STANDARD_THEME = {
  name: 'Standard',
  shadow_color: 'rgba(56,56.58, 0.9)',
  border: '3px solid #38383a',
  box_shadow: '4px 4px 0px var(--shadow-color)',
  border_radius: '10px',
  text_color: '#38383a',
  button_color: '#38383a',
  background_color: 'white',
}

// Must stay in sync with the "BFDW" entry in prisma/seed/data/themes.json.
export const BFDW_THEME = {
  name: 'BFDW',
  shadow_color: 'rgba(255, 123, 21, 0.35)',
  border: '3px solid #ff7b15',
  box_shadow: '4px 4px 0px var(--shadow-color)',
  border_radius: '10px',
  text_color: '#000000',
  button_color: '#ff7b15',
  background_color: '#ffffff',
}

export function getBaseThemeForSite(site: Site) {
  return site === Site.BFDW ? BFDW_THEME : STANDARD_THEME
}

// default color of story routes on the map, on every site the standard
// MapStories color (the BFDW orange is too close to the color of roads)
export const ROUTE_COLOR = STANDARD_THEME.button_color

// route color of a story: the color of its topic area (Themenbereich) if it
// has one, otherwise ROUTE_COLOR
export function getRouteColor(topic?: string | null) {
  return getBfdwTopic(topic)?.color ?? ROUTE_COLOR
}

// accent color for map elements (story markers / route) of a site
export function getSiteAccent(site: Site) {
  return getBaseThemeForSite(site).button_color
}
