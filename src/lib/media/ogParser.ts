import ogs from 'open-graph-scraper'
import { OpenGraphScraperOptions } from 'open-graph-scraper/lib/types'

export default async function parseOG(props: OpenGraphScraperOptions) {
  try {
    const { error, result } = await ogs(props)

    if (error) {
      return undefined
    }

    return result
  } catch (e) {
    return undefined
  }
}
