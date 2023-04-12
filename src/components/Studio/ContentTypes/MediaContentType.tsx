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
import { Spinner } from '../../Elements/Spinner'
import SizedImage from '../../Elements/SizedImage'
import { Image } from '@prisma/client'
import { retrievePresignedUrl } from '@/src/helper/retrievePresignedUrl'
import { getS3Image } from '@/src/helper/getS3Image'
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

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [imageUrl, setImageUrl] = useState(String)
  const [file, setFile] = useState<File>(null)
  const { addContent, updateContent } = useStep(storyStepId)
  const [selectedValue, setSelectedValue] = useState('s')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0])
    setImageUrl(URL.createObjectURL(acceptedFiles[0]))
  }, [])

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({ accept: { 'image/*': [] }, onDrop })

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
    const getImageWrapper = async () => {
      if (stepItem) {
        if (stepItem.type === 'IMAGE') {
          setIsLoading(true)
          // get image table from db
          const image = (await getMedia(stepItem.imageId)) as Image
          // get image file from s3
          const response = await getS3Image(image)
          setImageUrl(response)
          setIsLoading(false)
        }
        //const response = await getS3Image(im//await getImage2(stepItem)
      }
    }
    getImageWrapper()
  }, [])

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value)
  }

  const uploadImage = async (file: File, uploadedImage: Image) => {
    // retrieve presigned url from back end
    // name of the file on the minio client is the id of the image + the name of the file
    // so only users with access to the image id can access the image
    const preSignedUrl = await retrievePresignedUrl(
      'PUT',
      uploadedImage!.id + '.' + uploadedImage!.name,
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
        await updateContent(stepItem.id, { content: file.name, type: 'IMAGE' })
        toast({
          message: 'Your content has been updated',
          type: 'success',
        })
      } else {
        // create image table
        const uploadedImage = await addMedia({
          name: file.name,
          size: selectedValue,
        } as Image)
        // upload image to s3
        await uploadImage(file, uploadedImage!)

        // create content table with image id as reference
        await addContent({
          imageId: uploadedImage!.id,
          content: file.name,
          type: 'IMAGE',
        })
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
        {isLoading && (
          // show simple spinner while loading center this spinner in the div
          <div className="flex justify-center">
            <Spinner className="flex" />
          </div>
        )}
        {imageUrl && (
          <div className="m-2 flex justify-center">
            <SizedImage alt={imageUrl} size={selectedValue} src={imageUrl} />
          </div>
        )}
        <Button className="mt-10" onClick={() => onSubmit()}>
          {t('save')}
        </Button>
      </div>
    </div>
  )
}
