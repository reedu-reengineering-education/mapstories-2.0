// next js component which has an input where you can upload an image
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from '@/src/app/i18n/client'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { toast } from '@/src/lib/toast';
import { Button } from '@/src/components/Elements/Button'
import { usePresignedUpload } from 'next-s3-upload'
import {useDropzone} from 'react-dropzone';
import Image from 'next/image'
import { Input, InputLabel } from '@/src/components/Elements/Input'

interface ImageContentEditProps extends React.HTMLAttributes<HTMLFormElement> {
    storyStepId: string
    lng: string,
    stepItem?: any
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


export function ImageContentEdit({ storyStepId, lng, stepItem, ...props } : ImageContentEditProps
) {   
    if (languages.indexOf(lng) < 0) {
        lng = fallbackLng
    }
    const { uploadToS3 } = usePresignedUpload();
    const { t } = useTranslation(lng, 'editModal')
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [imageUrl, setImageUrl] = useState(String);
    const [width, setWidth] = useState<number>(200);
    const [height, setHeight] = useState<number>(200);
    const [file, setFile] = useState<File>();
    const [showInputs, setShowInputs] = useState<boolean>(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Do something with the files
        const photo = acceptedFiles[0];
        const photoUrl = URL.createObjectURL(photo);
        setFile(photo);
        setImageUrl(photoUrl);
        setShowInputs(true);
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

    // upload image to s3
    const submitFile = async () => {
        setIsSaving(true);
        try {
            //@ts-ignore
            const { url } = stepItem?  '' :  await uploadToS3(file);            
            const urlDb = `/api/mapstory/step/${storyStepId}/content`
            const method = stepItem? 'PUT' : 'POST';
            const headers = {
                'Content-Type': 'application/json',
            }
            const body =stepItem?
                JSON.stringify({...stepItem, imageHeight: height, imageWidth: width}):
                JSON.stringify({ image: url, imageHeight: height, imageWidth: width })
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
        } catch (error: any) {
            toast({
                title: 'Error',
                message: error.message,
                type: 'error',
              })
            setIsSaving(false)

        }

    }

    return (
        <div>
            {!stepItem &&
            /* @ts-ignore */
             <div {...getRootProps({style})}>
                <input {...getInputProps()} />
                    {t('dropFiles')}
             </div>}
        {imageUrl && 
            <div className="flex m-2 justify-center">
                <Image alt={imageUrl} height={height} src={imageUrl} width={width}  />
            </div>}
        {stepItem &&
            <div className="flex m-2 justify-center">
                 <Image alt={stepItem.image} height={stepItem.imageHeight} src={stepItem.image} width={stepItem.imageWidth} />
            </div>}
        <div className="flex flex-col">
            {(showInputs || stepItem) && (
                <div>
                    <div ><InputLabel>Height</InputLabel> <Input defaultValue={stepItem? stepItem.imageHeight: 200} onChange={(e)=> {setHeight(parseInt(e.target.value))} } type="number"  /> </div>
                    <div> <InputLabel>Width</InputLabel><Input defaultValue={stepItem? stepItem.imageWidth: 200} onChange={(e)=>setWidth(parseInt(e.target.value))} type="number" /> </div>
                </div>
            )}
        </div>
            <Button className="mt-10" disabled={isSaving} isLoading={isSaving} onClick={() => submitFile()}>
                  {t('save')}
            </Button>
        </div>
    )
}
