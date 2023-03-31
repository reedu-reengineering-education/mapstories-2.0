// next js component which has an input where you can upload an image
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from '@/src/app/i18n/client'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { toast } from '@/src/lib/toast'
import { Button } from '@/src/components/Elements/Button'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { InputLabel } from '@/src/components/Elements/Input'
import { useBoundStore } from '@/src/lib/store/store'
import { slideEmbedContentSchema } from '@/src/lib/validations/slidecontent'
import useStep from '@/src/lib/api/step/useStep'
import { retrievePresignedUrl } from '@/src/helper/retrievePresignedUrl'
import { Spinner } from '../../Elements/Spinner'
interface MediaContentEditProps extends React.HTMLAttributes<HTMLFormElement> {
  storyStepId: string
  stepItem?: any
  setContentType?: any
}

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
}

const focusedStyle = {
  borderColor: '#2196f3',
}

const acceptStyle = {
  borderColor: '#00e676',
}

const rejectStyle = {
  borderColor: '#ff1744',
}

type FormData = z.infer<typeof slideEmbedContentSchema>

export function MediaContentEdit({
  storyStepId,
  stepItem,
  className,
  setContentType,
  ...props
}: MediaContentEditProps) {
  let lng = useBoundStore(state => state.language)

  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }
  const { t } = useTranslation(lng, 'editModal')
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [imageUrl, setImageUrl] = useState(String)
  const [file, setFile] = useState<File>(null)
  const { addContent, updateContent } = useStep(storyStepId)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    setFile(acceptedFiles[0])
    setImageUrl(URL.createObjectURL(acceptedFiles[0]))
  }, [])

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({ accept: { 'image/*': [] }, onDrop })

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject],
  )

  useEffect(() => {
    const getImageWrapper = async () => {
      if (stepItem) {
        await getImage(stepItem.content)
      }
    }
    getImageWrapper()
  }, [])

  async function onSubmit() {
    try {
      setIsSaving(true)
      if (stepItem) {
        // first delete old picture, then upload new picture
        await deleteImage(stepItem.content)
        await uploadImage(file)

        await updateContent(stepItem.id, { content: file.name, type: 'IMAGE' })
        toast({
          message: 'Your content has been updated',
          type: 'success',
        })
      } else {
        await uploadImage(file)
        await addContent({ content: file.name, type: 'IMAGE' })
        toast({
          message: 'Your content has been added',
          type: 'success',
        })
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        message: error.message,
        type: 'error',
      })
    } finally {
      setIsSaving(false)
    }
  }

  async function uploadImage(file: File) {
    const preSignedUrl = await retrievePresignedUrl('PUT', file.name)

    const response2 = await fetch(preSignedUrl, { method: 'PUT', body: file })

    return response2
  }

  async function getImage(fileName: string) {
    setIsLoading(true)
    const preSignedUrl = await retrievePresignedUrl('GET', fileName)

    const response = await fetch(preSignedUrl, { method: 'GET' })
    const blob = await response.blob()
    const src = URL.createObjectURL(blob)
    setImageUrl(src)
    setIsLoading(false)
  }

  async function deleteImage(fileName: string) {
    const preSignedUrl = await retrievePresignedUrl('DELETE', fileName)

    const response = await fetch(preSignedUrl, { method: 'DELETE' })

    return response
  }

  return (
    <div>
      <div>
        <InputLabel>{t('uploadImage')}</InputLabel>
        <p className="my-2 text-sm font-bold">Unterstützte Formate: </p>
        <span>
          <code>.jpg</code>
          <code>.png</code>
          <code>.mp4</code>
          <code>.mp3</code>
          <code>.jpg</code>
          <br></br>
        </span>
        <div {...getRootProps({ style })}>
          <input {...getInputProps()} />
          {t('dropFiles')}
        </div>
        {isLoading && (
          // show simple spinner while loading center this spinner in the div
          <div className="flex justify-center">
            <Spinner className="flex" />
          </div>
        )}
        {imageUrl && (
          <div className="m-2 flex justify-center">
            <Image alt={imageUrl} height={200} src={imageUrl} width={200} />
          </div>
        )}
        <Button className="mt-10" onClick={() => onSubmit()}>
          {t('save')}
        </Button>
      </div>
    </div>
  )
}
