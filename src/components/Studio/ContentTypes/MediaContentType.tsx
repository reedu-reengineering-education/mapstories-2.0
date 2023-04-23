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
import useMedia, { Media } from '@/src/lib/api/media/useMedia'
import SizedImage from '../../Elements/SizedImage'
import { Image, MediaType } from '@prisma/client'
import { retrievePresignedUrl } from '@/src/helper/retrievePresignedUrl'
import { getS3Image } from '@/src/helper/getS3Image'
import * as z from 'zod'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { isValidLink } from '@/src/helper/isValidLink'
import { generateRandomName } from '@/src/helper/generateRandomName'
import ReactPlayer from 'react-player'

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

  const { updateMedia } = useMedia(storyStepId)
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

  const { getMedia, addMedia } = useMedia(storyStepId)

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
      if (stepItem.type) {
        // get image table from db
        const image = (await getMedia(stepItem.imageId)) as Image
        setSelectedValue(image.size)
        if (stepItem.type === 'IMAGE') {
          setTabIndex(1)
          setFileType(stepItem.type)
          setIsLoading(true)
          // get image file from s3
          const response = await getS3Image(image)
          setFileUrl(response)
          setIsLoading(false)
        }
        if (stepItem.type === 'EXTERNALIMAGE' && image.url) {
          setFileUrl(image.url)
          setTabIndex(0)
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
      // if size is changed

      if (stepItem) {
        await updateMedia(stepItem.imageId, { size: selectedValue } as Image)
        toast({
          message: 'Your content has been updated',
          type: 'success',
        })
      } else {
        // create image table
        if (tabIndex) {
          if (!file) {
            throw new Error('No file selected')
          }
          const uploadedMedia = await addMedia({
            name: file.name,
            size: selectedValue,
          })
          // upload file to s3
          await uploadFile(file, uploadedMedia)
          await addContent({
            imageId: uploadedMedia.id,
            content: file.name,
            type: fileType,
          })
        }
        if (!tabIndex) {
          const image = await addMedia({
            name: generateRandomName(),
            url: fileUrl,
            size: selectedValue,
          })
          await addContent({
            imageId: image.id,
            content: image.name,
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
    const valid = isValidLink(e.target.value)
    valid ? setFileUrl(e.target.value) : console.log('kein gültiger link')
    setIsLoading(false)
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
        {/* {isLoading && (
          // show simple spinner while loading center this spinner in the div
          <div className="flex justify-center">
            <Spinner className="flex" />
          </div>
        )} */}
        <div className="pt-2">
          {fileUrl && fileType === 'IMAGE' && (
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
              height="100%"
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
