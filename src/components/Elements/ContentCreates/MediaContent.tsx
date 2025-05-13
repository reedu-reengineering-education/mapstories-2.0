'use client'
// next js component which has an input where you can upload an image
import { useCallback, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Input, InputLabel } from '@/src/components/Elements/Input'
import { MediaType } from '@prisma/client'
import 'react-tabs/style/react-tabs.css'
import ReactPlayer from 'react-player'
import { Spinner } from '@/src/components/Elements/Spinner'
import SizedImage from '@/src/components/Elements/SizedImage'
interface MediaContentEditProps extends React.HTMLAttributes<HTMLFormElement> {
  captchaEnabled: boolean
  setFile: any
  setCaptchaValidated: any
}

export function MediaContent({ setFile }: MediaContentEditProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [fileUrl, setFileUrl] = useState(String)
  const [fileType, setFileType] = useState<MediaType>()
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
          <Input
            className="bg-slate-50"
            label="Quelle"
            onChange={e => handleFileSource(e)}
            value={fileSource}
          />
        </div>
      </div>
    </div>
  )
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
