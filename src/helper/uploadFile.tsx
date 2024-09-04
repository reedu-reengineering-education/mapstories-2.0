import { Media } from '@prisma/client'
import { retrievePresignedUrl } from './retrievePresignedUrl'

const uploadFile = async (file: File, uploadedFile: Media) => {
  // retrieve presigned url from back end
  // name of the file on the minio client is the id of the image + the name of the file
  // so only users with access to the image id can access the image
  const preSignedUrl = await retrievePresignedUrl(
    'PUT',
    uploadedFile.id + '.' + uploadedFile.name,
  )
  // use presigned url to upload local media file to s3
  const response = await fetch(preSignedUrl, {
    method: 'PUT',
    body: file,
  })
}

export { uploadFile }
