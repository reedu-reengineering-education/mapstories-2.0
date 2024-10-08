'use client'

import * as React from 'react'

import { useState } from 'react'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import dynamic from 'next/dynamic'
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
  setValue: any
}

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
})

export function TextContent({ setValue }: TextContentEditProps) {
  const [textValue, setTextValue] = useState<string | undefined>('Placeholder')

  React.useEffect(() => {
    setValue(textValue)
  }, [])

  React.useEffect(() => {
    setValue(textValue)
  }, [textValue])

  const handleOnClick = () => {
    if (textValue === 'Placeholder') {
      setTextValue('')
    }
  }

  return (
    <div className="top-0">
      <div className="pb-4 pt-4">
        <div onClick={handleOnClick}>
          {/* @ts-ignore */}
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
  )
}
