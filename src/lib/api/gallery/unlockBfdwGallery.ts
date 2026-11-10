import axios from '@/src/lib/axios'
import { APIError } from '@/types'
import { AxiosResponse } from 'axios'

export const unlockBfdwGallery = (password: string) => {
  return axios.post<{ password: string }, AxiosResponse<{ success: true }, APIError>>(
    '/api/gallery/bfdw-unlock',
    { password },
  )
}
