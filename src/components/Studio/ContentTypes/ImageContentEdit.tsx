// next js component which has an input where you can upload an image
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from '@/src/app/i18n/client'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { toast } from '@/src/lib/toast';
import { Button } from '@/src/components/Elements/Button'
import { usePresignedUpload } from 'next-s3-upload'
import {useDropzone} from 'react-dropzone';
import Image from 'next/image'

interface ImageContentEditProps extends React.HTMLAttributes<HTMLFormElement> {
    storyStepId: string
    lng: string
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
    transition: 'border .24s ease-in-out'
  };
  
  const focusedStyle = {
    borderColor: '#2196f3'
  };
  
  const acceptStyle = {
    borderColor: '#00e676'
  };
  
  const rejectStyle = {
    borderColor: '#ff1744'
  };


export function ImageContentEdit({ storyStepId, lng, ...props } : ImageContentEditProps
) {


    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Do something with the files
        const photo = acceptedFiles[0];
        const photoUrl = URL.createObjectURL(photo);
        setFile(photo);
        setImageUrl(photoUrl);


      }, [])
      const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject
      } = useDropzone({accept: {'image/*': []},onDrop});

      const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
      }), [
        isFocused,
        isDragAccept,
        isDragReject
      ]);

    const { uploadToS3 } = usePresignedUpload();
    
    if (languages.indexOf(lng) < 0) {
        lng = fallbackLng
    }

    const { t } = useTranslation(lng, 'editModal')

    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [imageUrl, setImageUrl] = useState(String);
    const [file, setFile] = useState<File>();


    // upload image to s3
    const submitFile = async () => {
        setIsSaving(true);
        try {
            //@ts-ignore
            const { url } = await uploadToS3(file);            
            const urlDb = `/api/mapstory/step/${storyStepId}/content`
            const method = 'POST';
            const headers = {
                'Content-Type': 'application/json',
            }
            const body = JSON.stringify({ image: url })
            const response = await fetch(urlDb, { method, headers, body });
            if (!response.ok) {
                throw new Error('Something went wrong')
            }
            setIsSaving(false)

           // success toast 
            toast({
                message: 'Das Bild wurde gespeichert.',
                type: 'success',
            })
        } catch (error) {
            console.error(error);
            toast({
                message: 'Das Bild konnte nicht gespeichert werden.',
                type: 'error',
            })
            setIsSaving(false)

        }

    }

    return (
        <div>
        {/* @ts-ignore */}
        <div {...getRootProps({style})}>
        <input {...getInputProps()} />
            {t('dropFiles')}
      </div>
              {imageUrl && <Image alt={imageUrl} height={200} src={imageUrl} width={200}  />}

                  <Button className="mt-10" disabled={isSaving} isLoading={isSaving} onClick={(e) => submitFile()}>
                  {t('save')}
              </Button>
              </div>
    )
}
