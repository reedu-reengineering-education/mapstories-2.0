'use client'
// next js component which has an input where you can upload an image
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@/src/components/Elements/Button'
import { useDropzone } from 'react-dropzone'
import { Input, InputLabel } from '@/src/components/Elements/Input'
import { slideEmbedContentSchema } from '@/src/lib/validations/slidecontent'
import useMedia from '@/src/lib/api/media/useMedia'
import { Media, MediaType } from '@prisma/client'
import { retrievePresignedUrl } from '@/src/helper/retrievePresignedUrl'
import * as z from 'zod'
import 'react-tabs/style/react-tabs.css'
import ReactPlayer from 'react-player'
import { Spinner } from '@/src/components/Elements/Spinner'
import {
  LoadCanvasTemplate,
  loadCaptchaEnginge,
  validateCaptcha,
  //@ts-ignore
} from 'react-simple-captcha'
import { toast } from '@/src/lib/toast'
import SizedImage from '@/src/components/Elements/SizedImage'
interface MediaContentEditProps extends React.HTMLAttributes<HTMLFormElement> {
  stepSuggestion: any
  setStepSuggestion: any
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
  stepSuggestion,
  className,
  setContentType,
  setStepSuggestion,
  ...props
}: MediaContentEditProps) {
  const { addMedia } = useMedia()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [fileUrl, setFileUrl] = useState(String)
  const [file, setFile] = useState<File>()
  const [fileType, setFileType] = useState<MediaType>()
  const [fileSource, setFileSource] = useState<string>('')
  const [captcha, setCaptcha] = useState<string>('')

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
    loadCaptchaEnginge(6, 'gray')
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
    if (validateCaptcha(captcha) === true) {
      try {
        setIsSaving(true)
        // create image table
        if (!file) {
          throw new Error('no file selected')
        }
        const uploadedMedia = await addMedia({
          name: file.name,
          size: 's',
          source: fileSource,
        })
        // upload file to s3
        await uploadFile(file, uploadedMedia)
        const newStepSuggestion = stepSuggestion
        newStepSuggestion.content.push({
          type: fileType,
          content: file.name,
          position: stepSuggestion.content.length,
          suggestionId: null,
          mediaId: uploadedMedia.id,
        })
        setStepSuggestion(newStepSuggestion)

        console.log(newStepSuggestion)
      } catch (error: any) {
      } finally {
        setIsSaving(false)
        setContentType && setContentType('addSlide')
      }
    } else {
      toast({
        message: 'Captcha ist falsch',
        type: 'error',
      })
    }
  }

  function handleFileSource(e: any) {
    const target = e.target as HTMLInputElement
    setFileSource(target.value)
  }

  return (
    <div>
      <div>
        <InputLabel>Upload</InputLabel>
        <p className="my-2 text-sm font-bold">Unterstützte Formate </p>
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
        {/* @ts-ignore */}
        <div {...getRootProps({ style })}>
          <input {...getInputProps()} />
          Dateien hier ablegen
        </div>
      </div>
      <div>
        <div className="">
          {isLoading && (
            <div className="flex justify-center">
              <Spinner />
            </div>
          )}
          {fileUrl && fileType === 'IMAGE' && (
            <div className="m-2 flex justify-center">
              <SizedImage alt={fileUrl} size={'s'} src={fileUrl} />
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
          <InputLabel>Quelle </InputLabel>
          <Input
            className="bg-slate-50"
            label="Quelle"
            onChange={e => handleFileSource(e)}
            value={fileSource}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="p-2">
            <LoadCanvasTemplate />
          </div>
          <Input
            className="bg-slate-50"
            label="Captcha"
            onChange={e => setCaptcha(e.target.value)}
            placeholder="Captcha eingeben"
            value={captcha}
          ></Input>
        </div>
        <div className="flex flex-row justify-between pt-10">
          <Button
            onClick={() => setContentType('addSlide')}
            variant={'inverse'}
          >
            Zurück
          </Button>
          <Button
            disabled={isSaving}
            isLoading={isSaving}
            onClick={() => onSubmit()}
          >
            Hochladen
          </Button>
        </div>
      </div>
    </div>
  )
}
