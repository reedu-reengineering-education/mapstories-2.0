export async function retrievePresignedUrl(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  fileName: string,
) {
  const url = `/api/mediaupload/preSignedUrl/${fileName}`
  const response = await fetch(url, {
    method,
    headers: {},
  })
  const preSignedUrl = await response.json()
  return preSignedUrl
}
