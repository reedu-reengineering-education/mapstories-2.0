'use client'

import DraggableList from '@/components/DraggableList'
import { useStoryStore } from '@/lib/store/story'
import { FaceSmileIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import SidebarSlide from './SidebarSlide'

export default function MapstorySidebar() {

  // const storystore = useStoryStore();
  const story = useStoryStore(state => state.story)
  console.log(story);
  return (
    <aside className="flex h-24 w-full gap-2 overflow-scroll p-4 md:h-full md:flex-col">
      <DraggableList
        items={[
          {
            id: 1,
            component: (
              <SidebarSlide>
                <GlobeAltIcon className="w-10" />
              </SidebarSlide>
            ),
            test: 123,
          },
          {
            id: 2,
            component: (
              <SidebarSlide>
                <FaceSmileIcon className="w-10" />
              </SidebarSlide>
            ),
            test: 456,
          },
        ]}
        onChange={e => console.log(e)}
      ></DraggableList>
    </aside>
  )
}
