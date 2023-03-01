'use client'

import { Button } from '@/src/components/Elements/Button'
import useStory from '@/src/lib/api/story/useStory'
import { useStoryStore } from '@/src/lib/store/story'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useEffect } from 'react'
import { Slide } from './Slide'

type Props = {
  slug: string
  page: string
  // story: (Story & {
  //   steps?: StoryStep[] | undefined;
  // }) | undefined
}


export function Slides({ slug, page }: Props) {

  const router = useRouter();
  const setStoryID = useStoryStore(state => state.setStoryID);
  const { story } = useStory(slug);

  const updateSelectedStepIndex = useStoryStore(state => state.updateSelectedStepIndex)
  const selectedStepIndex = useStoryStore(state => state.selectedStepIndex)

  useEffect(() => {
    if(story){
      setStoryID(story.id)
    } else {
      setStoryID('')
    }
  }, [story])

  useEffect(() => {
    console.log(page)
    updateSelectedStepIndex(parseInt(page))
  }, [page])

  useEffect(() => {
    console.log(parseInt(page))
    updateSelectedStepIndex(parseInt(page))
  }, [])

  function nextStep(){
      // const length = story?.steps?.length
      router.push(`/viewer/story/${slug}/${page ? parseInt(page)+1: '1'}`)
      
  }

  function prevStep(){
    // const length = story?.steps?.length
    router.push(`/viewer/story/${slug}/${page ? parseInt(page)-1: '1'}`)
    // updateSelectedStepIndex(page ? parseInt(page)-1: 1)
}
  
  return (
    <div className="py-4">
        {/* <Slide step={ story?.steps?[page] ? story?.steps?[page] : undefined} /> */}
        <Slide step={story?.steps[parseInt(page)]}></Slide>
        {/* <Slide step={ story?.steps?[page] ? story?.steps?[page] : undefined}></Slide>
         */}
        <Button onClick={() => nextStep()}>{parseInt(page) < 1 ? 'Abspielen' : 'Weiter'}</Button>
        <Button onClick={() => prevStep()}>{parseInt(page) > 1 ? 'Zurück' : 'NIX'}</Button>

         { parseInt(page) < 1 &&
            <div>
              <Button onClick={() => router.push('viewer')}>Abbrechen</Button>
            </div>
         }
    </div >
  )
}
