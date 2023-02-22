// next js component which has an input where you can upload an image
import { useState } from 'react'
import { useTranslation } from '@/src/app/i18n/client'
import { useRouter } from 'next/navigation'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { Input } from '@/src/components/Elements/Input'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { toast } from '@/src/lib/toast';
import { Button } from '@/src/components/Elements/Button'


interface TextContentEditProps extends React.HTMLAttributes<HTMLFormElement> {
    storyStepId: string
    stepItem?: any
    lng: string
    setContentType?: any
    className?:any
  }

  
export function ImageContentEdit({ storyStepId, className, slideContent, lng, ...props }
) {

    const router = useRouter()

    if (languages.indexOf(lng) < 0) {
        lng = fallbackLng
    }

    const { t } = useTranslation(lng, 'editModal')

    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [imageUrl, setImageUrl] = useState(String);
    const [fileName, setFileName] = useState();
    const [fileState, setFile] = useState<File>();



    const submitFile = async () => {
        const imageUploaded = await uploadImage(fileState);
        try {
            setIsSaving(true);
            const url = `/api/mapstory/step/${storyStepId}/content`;
            const method = 'POST';
            const headers = {
                'Content-Type': 'application/json',
            };
            const body = JSON.stringify({ image: fileState.name });
            const response = await fetch(url, { method, headers, body });
            if (response.ok) {
                toast({
                    message: 'Das Bild wurde gespeichert.',
                    type: 'success',
                })
                setIsSaving(false);
                router.refresh();
            }
        } catch (error) {
            console.error(error);
            toast({
                message: 'Das Bild konnte nicht gespeichert werden.',
                type: 'error',
            })
        }

    }

    const uploadImage = async (fileInput: File) => {

        // make a http put request to upload the image to localhost:9444/mapstories20/
        const url = `http://localhost:9444/mapstories20/${fileInput.name}`;
        const method = 'PUT';
        const headers = {
            'Content-Type': fileInput.type,
        };
        const body = fileInput;
        const response = await fetch(url, { method, headers, body });
        if (response.ok) {
            // if the image was uploaded successfully, give a success toast
            toast({
                message: 'Das Bild wurde hochgeladen.',
                type: 'success',
            })
            return true;
        }
        return false;
    }

    const handleFileChange = async (e:any) => {
        const photo = e.target.files[0];
        const photoUrl = URL.createObjectURL(photo);
        setFile(photo);
        setImageUrl(photoUrl);
    };

    return (
        <div className="flex flex-col">
            <div className="flex mg-4">
                {imageUrl && <img src={imageUrl} />}
                <label htmlFor="imageupload">
                    <div className="h-9 w-10 cursor-pointer rounded border border-slate-300 hover:border-slate-400">
                        <ChevronDownIcon className="mx-2 mt-2 h-4 w-4 stroke-2" />
                    </div>
                </label>
                <Input
                    accept="image/*"
                    className="hidden"
                    // errors={errors.image}
                    id="imageupload"
                    onChange={e => handleFileChange(e)}
                    type="file"
                // {...register('image')}
                ></Input>
                <Input
                    label="Bild"
                    placeholder="Wähle ein Bild aus oder gib eine URL ein"
                    size={100}
                ></Input>
            </div>
            <Button className="mt-10" disabled={isSaving} isLoading={isSaving} onClick={(e) => submitFile()}>
                {t('save')}
            </Button>
        </div>
    )

}