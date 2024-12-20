// next js component which has an input where you can upload an image
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from '@/src/app/i18n/client'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { toast } from '@/src/lib/toast'
import { Button } from '@/src/components/Elements/Button'
import { useDropzone } from 'react-dropzone'
import { Input, InputLabel } from '@/src/components/Elements/Input'
import { useBoundStore } from '@/src/lib/store/store'
import { slideEmbedContentSchema } from '@/src/lib/validations/slidecontent'
import useStep from '@/src/lib/api/step/useStep'
import useMedia from '@/src/lib/api/media/useMedia'
import SizedImage from '../../Elements/SizedImage'
import { Media, MediaType } from '@prisma/client'
import { retrievePresignedUrl } from '@/src/helper/retrievePresignedUrl'
import { getS3Image } from '@/src/helper/getS3Image'
import * as z from 'zod'
import 'react-tabs/style/react-tabs.css'
import ReactPlayer from 'react-player'
import { Spinner } from '../../Elements/Spinner'

interface MediaContentEditProps extends React.HTMLAttributes<HTMLFormElement> {
  storyStepId: string
  stepItem?: any
  setContentType?: any
  setShowModal?: any
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
  setShowModal,
  ...props
}: MediaContentEditProps) {
  let lng = useBoundStore(state => state.language)

  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }
  const { t } = useTranslation(lng, 'editModal')

  const { updateMedia, getMedia, addMedia } = useMedia()
  const { addContent, updateContent } = useStep(storyStepId)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [fileUrl, setFileUrl] = useState(String)
  const [file, setFile] = useState<File>()
  const [fileType, setFileType] = useState<MediaType>()
  const [selectedValue, setSelectedValue] = useState<string>('s')
  const [externalImageUrl, setExternalImageUrl] = useState<string>('')
  const [tabIndex, setTabIndex] = useState<number>(0)
  const [fileSource, setFileSource] = useState<string>('')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0])
    setFileType(acceptedFiles[0].type.split('/')[0].toUpperCase() as MediaType)
    setFileUrl(URL.createObjectURL(acceptedFiles[0]))
  }, [])

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: { 'image/*': [], 'audio/*': [] },
      onDrop,
      // max 50mb
      maxSize: 50242880,
    })

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
    const getMediaWrapper = async () => {
      if (stepItem) {
        // get image table from db
        stepItem.type === 'EXTERNALIMAGE' ? setTabIndex(0) : setTabIndex(1)
        const media = (await getMedia(stepItem.mediaId)) as Media
        media.source ? setFileSource(media.source!) : setFileSource('')
        setFileType(stepItem.type)
        setSelectedValue(media.size!)
        if (stepItem.type === 'IMAGE' || stepItem.type === 'AUDIO') {
          setIsLoading(true)
          // get image file from s3
          const response = await getS3Image(media)
          setFileUrl(response)
          setIsLoading(false)
        }
        if (stepItem.type === 'EXTERNALIMAGE' && media.url) {
          media.source ? setFileSource(media.source!) : setFileSource('')
          setFileUrl(media.url)
        }
        //const response = await getS3Image(im//await getImage2(stepItem)
      }
    }
    getMediaWrapper()
  }, [])

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
  async function onSubmit() {
    try {
      setIsSaving(true)
      if (stepItem) {
        const media = await getMedia(stepItem.mediaId)
        await updateMedia(stepItem.mediaId, {
          size: selectedValue,
          source: fileSource,
        } as Media)

        toast({
          message: t('contentUpdated'),
          type: 'success',
        })
      } else {
        // create image table

        if (!file) {
          throw new Error('no file selected')
        }
        const uploadedMedia = await addMedia({
          name: file.name,
          size: selectedValue,
          source: fileSource,
        })
        // upload file to s3
        await uploadFile(file, uploadedMedia)
        await addContent({
          mediaId: uploadedMedia.id,
          content: file.name,
          type: fileType,
        })

        // create content table with image id as reference
        toast({
          message: t('contentCreated'),
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
    setContentType && setContentType('')
    if (setShowModal) {
      setShowModal(false)
    }
  }

  function handleExternalImageUrl(e: ChangeEvent<HTMLInputElement>) {
    setFileUrl(e.target.value)
  }

  function changeTabIndex(index: number) {
    setTabIndex(index)
    setFileUrl('')
    setFile(undefined)
  }

  function handleFileSource(e: any) {
    const target = e.target as HTMLInputElement
    setFileSource(target.value)
  }

  return (
    <div>
      <div>
        <InputLabel>{t('dataUpload')}</InputLabel>
        <p className="my-2 text-sm font-bold">{t('supportedFormats')} </p>
        <span>
          <code>.jpg</code>
          <code>.png</code>
          <code>.gif</code>
          <code>.bmp</code>
          <code>.svg</code>
          <code>.webp</code>
          <code>.mp3</code>
          <code>.flac</code>
          <code>.wma</code>
          <br></br>
        </span>
        {stepItem ? null : (
          /* @ts-ignore */
          <div {...getRootProps({ style })}>
            <input {...getInputProps()} />
            {t('dropFiles')}
          </div>
        )}
      </div>
      <div>
        <div className="">
          {isLoading && (
            <div className="flex justify-center">
              <Spinner />
            </div>
          )}
          {fileUrl &&
            (fileType === 'IMAGE' || fileType === 'EXTERNALIMAGE') && (
              <div className="m-2 flex justify-center">
                <SizedImage
                  alt={fileUrl ? fileUrl : externalImageUrl}
                  size={selectedValue}
                  src={fileUrl}
                />
              </div>
            )}
          {fileType === 'AUDIO' && (
            <div className="m-2 flex justify-center">
              {/* @ts-ignore */}
              <ReactPlayer
                controls={true}
                height="5rem"
                url={fileUrl}
                width="100%"
              />
            </div>
          )}
        </div>
        {/* input field to give a source */}
        <div className="flex items-center gap-2">
          <Input
            className="bg-slate-50"
            label={t('source')}
            onChange={e => handleFileSource(e)}
            value={fileSource}
          />
        </div>
        <div className="flex flex-row justify-end">
          <Button
            className="mt-10"
            disabled={isSaving}
            isLoading={isSaving}
            onClick={() => onSubmit()}
          >
            {stepItem ? t('update') : t('create')}
          </Button>
        </div>
      </div>
    </div>
  )
}
