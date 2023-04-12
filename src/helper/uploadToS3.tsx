import { retrievePresignedUrl } from './retrievePresignedUrl'

export async function uploadToS3(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  fileName: string,
  file: File,
) {
  const preSignedUrl = await retrievePresignedUrl(method, fileName)
  const response = await fetch(preSignedUrl, { method: 'PUT', body: file })
  return response
}
