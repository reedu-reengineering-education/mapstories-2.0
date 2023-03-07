'use client'

import { TextContentEdit } from './TextContentEdit'
import { TitleContentEdit } from './TitleContentEdit'
import { EmbedContentEdit } from './EmbedContentEdit'

export function EditContentType(props) {
  // this function in a switch statement
  // it will return the correct component based on the type of content
  // it will also pass the id of the content to the component
  // so that it can be edited
  // this is a good example of a component that is not a class

  return (
    <div>
      {props.stepItem.title && <TitleContentEdit stepItem={props.stepItem} />}
      {props.stepItem.text && <TextContentEdit stepItem={props.stepItem} />}
      {props.stepItem.media && <EmbedContentEdit stepItem={props.stepItem} />}
    </div>
  )
}
