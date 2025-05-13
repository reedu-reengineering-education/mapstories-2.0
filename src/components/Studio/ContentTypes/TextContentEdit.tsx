'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/src/components/Elements/Button'
import { useState } from 'react'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import dynamic from 'next/dynamic'
import { toast } from '@/src/lib/toast'
import { useTranslation } from '@/src/app/i18n/client'
import { fallbackLng, languages } from '@/src/app/i18n/settings'
import { useBoundStore } from '@/src/lib/store/store'
import useStep from '@/src/lib/api/step/useStep'
import {
  Bold,
  Code,
  HeadingIcon,
  HelpCircleIcon,
  Italic,
  Link,
  List,
  Table,
} from 'lucide-react'
import { commands } from '@uiw/react-md-editor'
import { ToolbarButton } from '../../Elements/MarkdownToolbar'
interface TextContentEditProps extends React.HTMLAttributes<HTMLFormElement> {
  storyStepId: string
  stepItem?: any
  setContentType?: any
  setShowModal?: any
}

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
})

export function TextContentEdit({
  storyStepId,
  stepItem,
  setContentType,
  setShowModal,
}: TextContentEditProps) {
  let lng = useBoundStore(state => state.language)
  if (languages.indexOf(lng) < 0) {
    lng = fallbackLng
  }
  const router = useRouter()
  const [isSaving, setIsSaving] = useState<boolean>(false)

  const { t } = useTranslation(lng, 'editModal')

  const [textValue, setTextValue] = useState<string | undefined>(
    t('placeholderTextInput'),
  )
  const { addContent, updateContent } = useStep(storyStepId)

  React.useEffect(() => {
    if (stepItem) {
      setTextValue(stepItem.content)
    }
  }, [])

  async function onSubmit(text: string) {
    try {
      setIsSaving(true)
      if (stepItem) {
        await updateContent(stepItem.id, {
          ...stepItem,
          content: text,
          type: 'TEXT',
        })
        toast({
          message: t('contentUpdated'),
          type: 'success',
        })
      } else {
        await addContent({ content: text, type: 'TEXT' })
        toast({
          message: t('contentCreated'),
          type: 'success',
        })
      }
    } catch (error) {
      console.log(error)
      toast({
        title: t('somethingWrong'),
        message: t('contentNotCreated'),
        type: 'error',
      })
    } finally {
      setIsSaving(false)
    }
    if (setShowModal) {
      setShowModal(false)
    }
    setContentType && setContentType('')
  }

  function handleOnClick() {
    if (textValue === t('placeholderTextInput')) {
      setTextValue('')
    }
  }

  return (
    <div className="top-0">
      <div className="pb-4 pt-4">
        <div onClick={handleOnClick}>
          <h3> Text erstellen</h3>
          <div className="mb-2 mt-2 text-sm text-gray-500">
            {t('textEditor')}{' '}
          </div>
          {/* @ts-ignore */}
          <div className="p-1 shadow-sm">
            <MDEditor
              commands={[
                commands.bold,
                commands.italic,
                commands.title,
                commands.link,
                commands.code,
                commands.table,
                commands.orderedListCommand,
                commands.help,
              ]}
              components={{
                toolbar: (command, disabled, executeCommand) => {
                  switch (command.name) {
                    case 'bold':
                      return (
                        <ToolbarButton
                          icon={<Bold className="h-4 w-4" />}
                          label="Fett"
                          onClick={() => executeCommand(command)}
                        />
                      )
                    case 'italic':
                      return (
                        <ToolbarButton
                          icon={<Italic className="h-4 w-4" />}
                          label="Kursiv"
                          onClick={() => executeCommand(command)}
                        />
                      )
                    case 'title1':
                      return (
                        <ToolbarButton
                          icon={<HeadingIcon className="h-4 w-4" />}
                          label="Überschrift"
                          onClick={() => executeCommand(command)}
                        />
                      )
                    case 'code':
                      return (
                        <ToolbarButton
                          icon={<Code className="h-4 w-4" />}
                          label="Code"
                          onClick={() => executeCommand(command)}
                        />
                      )
                    case 'link':
                      return (
                        <ToolbarButton
                          icon={<Link className="h-4 w-4" />}
                          label="Link"
                          onClick={() => executeCommand(command)}
                        />
                      )
                    case 'table':
                      return (
                        <ToolbarButton
                          icon={<Table className="h-4 w-4" />}
                          label="Tabelle"
                          onClick={() => executeCommand(command)}
                        />
                      )
                    case 'ordered-list':
                      return (
                        <ToolbarButton
                          icon={<List className="h-4 w-4" />}
                          label="Liste"
                          onClick={() => executeCommand(command)}
                        />
                      )
                    case 'help':
                      return (
                        <ToolbarButton
                          icon={<HelpCircleIcon className="h-4 w-4" />}
                          label="Liste"
                          onClick={() => executeCommand(command)}
                        />
                      )
                    default:
                      return
                  }
                },
              }}
              data-color-mode="light"
              extraCommands={[]}
              onChange={setTextValue}
              value={textValue}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          disabled={isSaving}
          isLoading={isSaving}
          onClick={() => {
            if (textValue != undefined) {
              onSubmit(textValue)
            }
            setContentType ? setContentType('') : null
          }}
          type="submit"
        >
          {stepItem && t('save')}
          {!stepItem && t('create')}
        </Button>
      </div>{' '}
    </div>
  )
}
