export async function retrievePresignedUrl(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  storyStepId: string,
  fileName: string,
) {
  const url = `/api/mediaupload/step/${storyStepId}/${fileName}`
  const response = await fetch(url, {
    method,
    headers: {},
  })
  const preSignedUrl = await response.json()
  return preSignedUrl
}
