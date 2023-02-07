'use client'

import { useStoryStore } from '@/src/lib/store/story'
import { StoryStep } from '@prisma/client'
import { HeadingIcon, TextIcon } from '@radix-ui/react-icons'
import * as React from 'react'


type Props = {
  stepId: String
}

const renderSwitch = function renderSwitch(param: string, content: any) {
  console.log(content)
  if (content.title) {
    return (
      <div className="flex">
        <HeadingIcon className='w-14 h-14'></HeadingIcon>
        {content.title}
      </div>
    )
  }
  if (content.text) {
    return (
      <div className="flex">
        <TextIcon className='w-14 h-14'></TextIcon>
        {content.text}
      </div>
    )
  }
}



export function SlideContentListEdit({ stepId }: Props) {

  const story = useStoryStore(state => state.story)
  const step: StoryStep | undefined = story?.steps?.filter(step => step.id === stepId)[0]
  return (
    <div className="py-4">
      {step &&
        step.content &&
        step.content.length > 0 &&
        // <DraggableList
        //   items={
        //     story?.steps?.map(s => ({
        //       id: s.id,
        //       component: (
        //         <Link href={`/studio/${story.id}/${s.id}`}>
        //           <SidebarSlide>
        //             <GlobeAltIcon className="w-10" />
        //           </SidebarSlide>
        //         </Link>
        //       ),
        //     }))!
        //   }
        //   onChange={e => console.log(e)}
        // ></DraggableList>
        step.content?.map(s => (
          <div className="re-basic-box-no-shadow my-2 relative hover:bg-hover cursor-pointer" key={s.id}>
            {renderSwitch('title', s)}
          </div>
        ))}

    </div>
  )
}
