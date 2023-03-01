'use client'

import { Story, StoryStep } from '@prisma/client'
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Layer, MapRef, Popup, Source } from 'react-map-gl'
import { Feature } from 'geojson'
// import { LineString } from 'geojson'
import ViewerMap from './ViewerMap'
import { Button } from './../Elements/Button'
import { usePathname, useRouter } from 'next/navigation'
import mapboxgl from 'mapbox-gl'
import { useStoryStore } from '@/src/lib/store/story'
import React from 'react'


type ViewerViewProps = {
  stories: (Story & {
    steps?: StoryStep[] | undefined;
})[] | undefined
}

interface MarkerProps {
  latitude: number
  longitude: number
  color: string
  key: string
  draggable: boolean
}

export default function ViewerView({
  stories,
}: ViewerViewProps) {

  const mapRef = useRef<MapRef>();
  const path = usePathname()
  const storyID = useStoryStore(state => state.storyID)
  const setStoryID = useStoryStore(state => state.setStoryID)

  const selectedStepIndex = useStoryStore(state => state.selectedStepIndex)

  
  const [mapData, setMapData] = useState<any[] | undefined>()
  const [selectedFeature, setSelectedFeature] = useState<Feature | undefined>()

  const [interactiveLayerIds, setInteractiveLayerIds] = useState<any[]>()
  const [savedView, setSavedView] = useState<any>()

  const router = useRouter()


  useEffect(() => {
    console.log('STORIES CHAGNED', selectedStepIndex)
    updateToStep(selectedStepIndex);
  }, [selectedStepIndex])

  useEffect(() => {
    // console.log('STORIES CHAGNED', stories)
    extractGeoJson(stories)
  }, [stories])

  useEffect(() => {
    // Zoom back to former extend if not viewing a story
    const pathend = path?.split('/').at(-1)
    if(pathend === 'viewer'){
      setStoryID('');
      if(savedView){
        mapRef.current?.fitBounds(savedView)
      }
    }
  }, [path])

    useEffect(() => {
      if(mapData) {
          // drawMapData(mapData)
          const ids = mapData?.map(m => {if (m.geometry.coordinates.length > 0) {return m.properties.id.toString()+'buffer'}}).filter(item => item != undefined) 
          setInteractiveLayerIds(ids)
      }
    }, [mapData])
    

    function extractGeoJson(currentStories: (Story & {
      steps?: StoryStep[] | undefined;
      })[] | undefined) {
      const geojsons: any[] = [];
      if(!currentStories){
          return;
      }
      currentStories.forEach(s => {
          const story: any[] = [];
          if (!s?.steps) {
              return
            }
          s.steps.forEach((step: StoryStep) => {
              if (step.feature) {
                  if (step.feature['point' as keyof typeof step.feature]) {
                      const point = JSON.parse(
                          JSON.stringify(step.feature['point' as keyof typeof step.feature]),
                        )
              
                      story.push([point.longitude, point.latitude]);
                  }
              }
          })
          geojsons.push({
              type: 'Feature',
              properties: {
                  id: s.id,
                  desc: s.description,
                  name: s.name,
                  slug: s.slug
              },
              geometry: {
                type: 'LineString',
                coordinates: story
              },
            }
        );
      })
      setMapData(geojsons);
      // console.log('GEOJSONS', mapData)
    }

    function selectStory(m){
      // mapRef?.current?.fitBounds(m.geometry);
      if(m){
        const coordinates = m.geometry.coordinates;
   
        // Create a 'LngLatBounds' with both corners at the first coordinate.
        const bounds = new mapboxgl.LngLatBounds(
        coordinates[0],
        coordinates[0]
      );
        
      // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
      for (const coord of coordinates) {
        bounds.extend(coord);
      }
      if(mapRef){
        setSavedView(mapRef.current?.getBounds());
        mapRef.current?.fitBounds(bounds, {
          padding: 20
          });
        }  
      }
      router.push(`/viewer/story/${m.properties.slug}/0`)
    }

    function updateToStep(index){
      const story = stories?.filter(story => story.id === storyID)[0]
      if(story?.steps?.length && story?.steps?.length > index){
        console.log(story?.steps[index]);
        // const coordinates = story?.steps[index].feature.point.latitude;
   
        // // Create a 'LngLatBounds' with both corners at the first coordinate.
        // const bounds = new mapboxgl.LngLatBounds(
        //   coordinates[0],
        //   coordinates[0]
        // );
          
        // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
        // for (const coord of coordinates) {
        //   bounds.extend(coord);
        // }
        if(mapRef && story.steps[index].feature ){
          mapRef.current?.flyTo({center: [story?.steps[index].feature.point.longitude, story?.steps[index].feature.point.latitude], zoom: 15, essential: true });
          }  
      }
    }

    const lineStyle = {
        type: 'line' as 'sky',
        paint: {
          'line-color': 'black',
          'line-width': 4,
          'line-opacity': 0.7
          // 'line-border': 2,
          // 'line-border-color': 'red'
        },
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        }
      }
      const lineStyle2 = {
        type: 'line' as 'sky',
        paint: {
          'line-color': '#eb5933',
          'line-width': 10,
          'line-blur': 3,
          'line-opacity': 0.7
          // 'line-border': 2,
          // 'line-border-color': 'red'
        },
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        }
      }
      const lineBuffer = {
        type: 'line' as 'sky',
        paint: {
          'line-color': '#eb5933',
          'line-width': 25,
          'line-blur': 0,
          'line-opacity': 0
          // 'line-border': 2,
          // 'line-border-color': 'red'
        },
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        }
      }

      // const lineName = {
      //   id: 'symbols',
      //   type: 'symbol' as 'sky',
      //   layout: {
      //       'symbol-placement': 'line-center',
      //       'text-font': ['Open Sans Regular'],
      //       'text-field': 'this is a test',
      //       'text-size': 32
      //   },        
      // }

      const onHover = useCallback(event => {
        const feature = event.features && event.features[0];
        if(feature){
            // setPopupPosition(event.lngLat)
            setSelectedFeature(feature);
        } else {
            setSelectedFeature(undefined)
        }
    }, []);

    const onMapLoad = React.useCallback(() => {
      console.log(selectedStepIndex)
     if(selectedStepIndex){
      updateToStep(selectedStepIndex);
     }
    }, []);
    // const filter = useMemo(() => ['==', 'ID', selectedFeature]);
    const mapFilter = useMemo(() => ['==', 'id', storyID], [storyID]);
    const filter = useMemo(() => ['==', 'id', selectedFeature?.properties?.id], [selectedFeature?.properties?.id]);
  return (
    <div>
      
      <ViewerMap interactiveLayerIds={interactiveLayerIds} onLoad={onMapLoad} onMouseMove={onHover} ref={mapRef}>

        {mapData && mapData.map((m, i) => {
            return <Fragment key={i}>
            {m.geometry.coordinates.length > 0 &&
            <>
            <Source data={m as Feature} id={m.properties.id + 'source'} type="geojson">
              {/* @ts-ignore */}
              <Layer {...lineStyle2} filter={selectedFeature ? filter : false} id={m.properties.id}/>
              {/* @ts-ignore */}
              <Layer {...lineStyle} filter={storyID != '' ? mapFilter : true} id={m.properties.id.toString()+'normal'}/>

              {/* @ts-ignore */}
              <Layer {...lineBuffer} id={m.properties.id.toString()+'buffer'} />
              {/* <Layer  {...lineName} /> */}

            </Source>
             
            {storyID === '' &&
              <Popup
                anchor="top"
                closeOnClick={false}
                latitude={m.geometry.coordinates[0][1]}
                longitude={m.geometry.coordinates[0][0]}
                // onClose={() => setPopupInfo(null)}
                >
                <div className='re-basic-box-no-filter'>
                  <div className="p-5">
                    <h3 >{m.properties?.name}</h3>
                    <p> {m.properties?.desc}</p>
                    <div className="flex justify-end mt-2">
                      <Button className="" onClick={() => selectStory(m)}>Mehr erfahren</Button>
                    </div>
                  </div>                
                </div>
              </Popup>
            }
           
            </>
          }
            
          </Fragment>})}

      </ViewerMap>
    </div>
    )
}
