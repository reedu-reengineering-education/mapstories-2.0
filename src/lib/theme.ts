import { Site } from '@prisma/client'

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
