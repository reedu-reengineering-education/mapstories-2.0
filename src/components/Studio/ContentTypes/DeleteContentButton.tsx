'use client'

import { Button } from '@/src/components/Elements/Button'
import { Modal } from '@/src/components/Modal'
import { TrashIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteContentButton({ stepItem }: { stepItem: any }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    //const { story, deleteContent } = useStory(id)
    async function handleClick() {

        const response = await fetch(`/api/mapstory/step/${stepItem.storyStepId}/content/${stepItem.id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        router.refresh()

    }

    return (
        <Modal
            title={
                <span>
                    Willst du den Inhalt
                    <span className="rounded bg-slate-100 py-1 px-2">{stepItem.id}</span>
                    wirklich löschen?
                </span>
            }
            trigger={
                <div className="flex cursor-pointer rounded-full bg-red-100 p-2 transition-colors hover:bg-red-200">
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
