// gets the image table as parameter and queriey the s3 service for the picture and returns the url

import { Image } from '@prisma/client'
import { retrievePresignedUrl } from './retrievePresignedUrl'

export async function getS3Image(image: Image) {
  const url = await retrievePresignedUrl('GET', image.id + '.' + image.name)
  const response = await fetch(url, { method: 'GET' })
  const blob = await response.blob()
  const src = URL.createObjectURL(blob)
  return src
}
