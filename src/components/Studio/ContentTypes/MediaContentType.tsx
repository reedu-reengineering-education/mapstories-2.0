// next js component which has an input where you can upload an image
import { useCallback, useEffect, useMemo, useState } from 'react'
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
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { isValidLink } from '@/src/helper/isValidLink'
import { generateRandomName } from '@/src/helper/generateRandomName'
import ReactPlayer from 'react-player'
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

  const { updateMedia, getMedia, addMedia } = useMedia(storyStepId)
  const { addContent, updateContent } = useStep(storyStepId)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [fileUrl, setFileUrl] = useState(String)
  const [file, setFile] = useState<File>()
  const [fileType, setFileType] = useState<MediaType>()
  const [selectedValue, setSelectedValue] = useState<string>('s')
  const [externalImageUrl, setExternalImageUrl] = useState<string>('')
  const [tabIndex, setTabIndex] = useState<number>(0)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0])
    setFileType(acceptedFiles[0].type.split('/')[0].toUpperCase() as MediaType)
    setFileUrl(URL.createObjectURL(acceptedFiles[0]))
  }, [])

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: { 'image/*': [], 'video/*': [], 'audio/*': [] },
      onDrop,
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
        setFileType(stepItem.type)
        setSelectedValue(media.size!)
        if (
          stepItem.type === 'IMAGE' ||
          stepItem.type === 'AUDIO' ||
          stepItem.type === 'VIDEO'
        ) {
          setIsLoading(true)
          // get image file from s3
          const response = await getS3Image(media)
          setFileUrl(response)
          setIsLoading(false)
        }
        if (stepItem.type === 'EXTERNALIMAGE' && media.url) {
          setFileUrl(media.url)
        }
        //const response = await getS3Image(im//await getImage2(stepItem)
      }
    }
    getMediaWrapper()
  }, [])

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value)
  }

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
        // when image from url is selected
        if (!tabIndex) {
          if (!isValidLink(fileUrl)) {
            throw new Error('Ungültiger Link/Invalid URL')
          }
          await updateMedia(stepItem.mediaId, {
            size: selectedValue,
            url: fileUrl,
          } as Media)
        }
        // when image from file is selected
        if (tabIndex) {
          if (!file) {
            throw new Error('no file selected')
          }
          const media = await getMedia(stepItem.mediaId)
          await uploadFile(file, media)
          await updateMedia(stepItem.mediaId, { size: selectedValue } as Media)
        }
        toast({
          message: 'Your content has been updated',
          type: 'success',
        })
      } else {
        // create image table
        if (tabIndex) {
          if (!file) {
            throw new Error('no file selected')
          }
          const uploadedMedia = await addMedia({
            name: file.name,
            size: selectedValue,
          })
          // upload file to s3
          await uploadFile(file, uploadedMedia)
          await addContent({
            mediaId: uploadedMedia.id,
            content: file.name,
            type: fileType,
          })
        }
        if (!tabIndex) {
          if (!isValidLink(fileUrl)) {
            throw new Error('Ungültiger Link/Invalid URL')
          }
          const uploadedMedia = await addMedia({
            name: generateRandomName(),
            url: fileUrl,
            size: selectedValue,
          })
          await addContent({
            mediaId: uploadedMedia.id,
            content: uploadedMedia.name,
            type: 'EXTERNALIMAGE',
          })
        }

        // create content table with image id as reference
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
    setContentType && setContentType('')
  }

  function handleExternalImageUrl(e: any) {
    setFileUrl(e.target.value)
  }

  function changeTabIndex(index: number) {
    setTabIndex(index)
    setFileUrl('')
    setFile(undefined)
  }

  return (
    <div>
      <Tabs onSelect={index => changeTabIndex(index)} selectedIndex={tabIndex}>
        <TabList>
          <Tab>{t('externalImage')}</Tab>
          <Tab>{t('uploadFile')}</Tab>
        </TabList>
        <TabPanel>
          <div>
            <InputLabel>{t('externalImageUrl')}</InputLabel>
            <Input
              // disabled={file ? true : false}
              onChange={(e: any) => handleExternalImageUrl(e)}
              type="text"
              value={fileUrl}
            />
          </div>
        </TabPanel>
        <TabPanel>
          <InputLabel>{t('uploadFile')}</InputLabel>
          <p className="my-2 text-sm font-bold">Unterstützte Formate: </p>
          <span>
            <code>.jpg</code>
            <code>.png</code>
            <code>.mp4</code>
            <code>.mp3</code>
            <code>.jpg</code>
            <br></br>
          </span>
          {/* @ts-ignore */}
          <div {...getRootProps({ style })}>
            <input {...getInputProps()} />
            {t('dropFiles')}
          </div>
        </TabPanel>
      </Tabs>
      <div>
        {fileType === 'IMAGE' && (
          <div className="flex justify-between">
            <div className="p-2">
              <InputLabel>S</InputLabel>
              <Input
                checked={selectedValue === 's'}
                name="image_size"
                onChange={handleRadioChange}
                type="radio"
                value="s"
              />
            </div>
            <div className="p-2">
              <InputLabel>M</InputLabel>
              <Input
                checked={selectedValue === 'm'}
                name="image_size"
                onChange={handleRadioChange}
                type="radio"
                value="m"
              />
            </div>
            <div className="p-2">
              <InputLabel>L</InputLabel>
              <Input
                checked={selectedValue === 'l'}
                name="image_size"
                onChange={handleRadioChange}
                type="radio"
                value="l"
              />
            </div>
          </div>
        )}
        <div className="pt-2">
          {isLoading && (
            <div className="flex justify-center">
              <Spinner />
            </div>
          )}
          {fileUrl &&
            (fileType === 'IMAGE' ||
              fileType === 'EXTERNALIMAGE' ||
              tabIndex === 0) && (
              <div className="m-2 flex justify-center">
                <SizedImage
                  alt={fileUrl ? fileUrl : externalImageUrl}
                  size={selectedValue}
                  src={fileUrl}
                />
              </div>
            )}
          {fileType === 'VIDEO' && (
            <ReactPlayer
              controls={true}
              height="100%"
              url={fileUrl}
              width="100%"
            />
          )}
          {fileType === 'AUDIO' && (
            <ReactPlayer
              controls={true}
              height="20%"
              url={fileUrl}
              width="100%"
            />
          )}
        </div>

        <Button className="mt-10" onClick={() => onSubmit()}>
          {t('save')}
        </Button>
      </div>
    </div>
  )
}
