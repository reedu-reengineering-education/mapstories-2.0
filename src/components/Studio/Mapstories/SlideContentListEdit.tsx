'use client'

import { useStoryStore } from '@/src/lib/store/story'
import { StoryStep } from '@prisma/client'
import { HeadingIcon, PlusIcon } from '@radix-ui/react-icons'
import * as React from 'react'
import { Button } from '../../Elements/Button'
import { Modal } from '../../Modal'
import { TitleContentEdit } from '../ContentTypes/TitleContentEdit'


type Props = {
  stepId: String
}

const renderSwitch = function renderSwitch(param: string, content: any) {
  switch (param) {
    case 'title':
      return (
        <div className="flex">
          <HeadingIcon className='w-14 h-14'></HeadingIcon>
          {content.title}
        </div>
      );
    default:
      return 'foo';
  }
}



export function SlideContentListEdit({ stepId }: Props) {

  const story = useStoryStore(state => state.story)
  const step: StoryStep | undefined = story?.steps?.filter(step => step.id === stepId)[0]
  const click = function (s) {
    // hier zu <TitleContentEdit.tsx> mit s weiterleiten oder ein Modal damit öffnen
    console.log(s);


  };
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
        // re-basic-box-no-shadow my-2 relative hover:bg-hover cursor-pointer
        step.content?.map(s => (
          <Modal key={s.id} title={'Editieren'} trigger={<Button
            className="my-2 relative hover:bg-hover cursor-pointer"
            startIcon={<PlusIcon className="w-4" />}
            variant={'inverse'}
          >
            {renderSwitch('title', s)}
          </Button>}>
            <Modal.Content>
              <TitleContentEdit slideContent={s} storyStepId={s.id} ></TitleContentEdit>
            </Modal.Content>
          </Modal>
        ))
      }

    </div >
  )
}
