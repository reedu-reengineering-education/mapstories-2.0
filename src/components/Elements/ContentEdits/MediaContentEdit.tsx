'use client'
// next js component which has an input where you can upload an image
import { useCallback, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Input, InputLabel } from '@/src/components/Elements/Input'
import useMedia from '@/src/lib/api/media/useMedia'
import { Media, MediaType } from '@prisma/client'
import { retrievePresignedUrl } from '@/src/helper/retrievePresignedUrl'
import 'react-tabs/style/react-tabs.css'
import ReactPlayer from 'react-player'
import { Spinner } from '@/src/components/Elements/Spinner'
//@ts-ignore

import SizedImage from '@/src/components/Elements/SizedImage'
interface MediaContentEditProps extends React.HTMLAttributes<HTMLFormElement> {
  setMedia: (media: Media) => void
}

export function MediaContent({
  setMedia,
}: MediaContentEditProps) {
  const { addMedia } = useMedia()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [fileUrl, setFileUrl] = useState(String)
  const [file, setFile] = useState<File>()
  const [fileType, setFileType] = useState<MediaType>()
  const [fileSource, setFileSource] = useState<string>('')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0])
    setFileType(acceptedFiles[0].type.split('/')[0].toUpperCase() as MediaType)
    setFileUrl(URL.createObjectURL(acceptedFiles[0]))
    handleFileUpload()
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
  async function handleFileUpload() {
    setIsLoading(true)

    try {
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
      setMedia(uploadedMedia)
    } catch (error: any) {}
    setIsLoading(false)
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
