import ogs from 'open-graph-scraper'
import { OpenGraphScraperOptions } from 'open-graph-scraper/lib/types'

export default async function parseOG(props: OpenGraphScraperOptions) {
  const { error, result } = await ogs(props)
  if (error) {
    throw new Error('Error parsing OG data')
  }

  return result
}
