'use client'

import { Button } from '@/src/components/Elements/Button'
import { Modal } from '@/src/components/Modal'
import { TrashIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from '@/src/lib/toast'

export default function DeleteStepButton({ storyId, storyStepId }: { storyId:any, storyStepId: any }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    //const { story, deleteContent } = useStory(id)
    const [isSaving, setIsSaving] = useState<boolean>(false)

    async function handleClick() {
        setIsSaving(true)

        const response = await fetch(`/api/mapstory/${storyId}/step/${storyStepId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        setIsSaving(false)

        if (!response?.ok) {
            return toast({
                title: 'Something went wrong.',
                message: 'Your content was not created. Please try again',
                type: 'error',
            })
        }

        toast({
            message: 'Der Inhalt wurde gelöscht.',
            type: 'success',
        })

        router.refresh()
    }

    return (
        <Modal
            title={
                <span>
                    Willst du die Slide
                    <span className="rounded bg-slate-100 py-1 px-2">{storyStepId}</span>
                    wirklich löschen?
                </span>
            }
            trigger={
                <div className="flex cursor-pointer  p-2 transition-colors hover:bg-red-200">
                    <TrashIcon className="w-5 text-red-500" />
                </div>
            }
        >
            <Modal.Footer>
                <Button
                    disabled={loading}
                    isLoading={loading}
                    onClick={handleClick}
                    variant={'danger'}
                >
                    Löschen
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
