import axios from '@/src/lib/axios'
import { Image } from '@prisma/client'

export const getMedia = (
  stepId: string,
  mediaId: string,
) => {
  console.log(stepId, mediaId)
  return axios.get<Image>(
    `/api/mediaupload/${stepId}/${mediaId}`
  )
}

// http://localhost:3000/api/mapstory/step/clg2cl8po0003uda0yxd58ni3/content/media/clg2cl7k90000uda07gre3uq7