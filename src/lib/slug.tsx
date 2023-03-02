import slugify from 'slugify'
import { db } from './db'

/**
 * Generates a slug for a mapstory name. Throws error if no slug was found
 * @param name name to slugify
 * @returns Promise with new slug
 */
export async function generateSlug(name: string) {
  return new Promise<string>(async (resolve, reject) => {
    const slug = slugify(name, {
      lower: true,
      strict: true,
    })
    const unique = await uniqueSlug(slug)
    if (!unique) {
      return reject('Slug is not unique')
    }
    resolve(unique)
  })
}

/**
 * Get a unique slug for a mapstory
 * @param slug the slug to check
 * @param maxSuffix optional max suffix to check
 * @returns unique mapstory slug, undefined if no unique slug was found
 * @example
 * Simple example
 * ```ts
 * const slug = "my-mapstory"
 * const unique = await uniqueSlug(slug)
 * ```
 */
const uniqueSlug = async (slug: string, maxSuffix = 1000) => {
  for (let suffix = 0; suffix < maxSuffix; suffix++) {
    const slugToCheck = suffix === 0 ? slug : `${slug}-${suffix}`
    // Check if the current slug with the current suffix exists
    const existingSlug = await db.story.findUnique({
      where: { slug: slugToCheck },
    })
    if (!existingSlug) {
      return slugToCheck
    }
  }
}
