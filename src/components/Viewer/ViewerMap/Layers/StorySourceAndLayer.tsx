import { Feature } from 'maplibre-gl'
import { useEffect, useMemo, useState } from 'react'
import { Layer, Source } from 'react-map-gl'

export default function StorySourceLayer({
  geojsons,
  selectedFeature,
  storyID,
  selectedStepIndex,
}: {
  geojsons: GeoJSON.Feature<GeoJSON.LineString>[] | undefined
  selectedFeature: Feature | undefined
  storyID: string
  selectedStepIndex: any
}) {
  const [lineData, setLineData] = useState<
    GeoJSON.FeatureCollection[] | undefined
  >()

  const [lineDataDone, setLineDataDone] = useState<
    GeoJSON.FeatureCollection | undefined
  >()
  // const storyID = useStoryStore(state => state.storyID)
  // const selectedStepIndex = useStoryStore(state => state.selectedStepIndex)

  // generate Line string
  useEffect(() => {
    let newLineData: GeoJSON.FeatureCollection[] | undefined = undefined
   
    geojsons?.map((m, i) => {
      if (!newLineData) {
        newLineData = [m]
      } else {
        newLineData.push(m)
      }
    })
    setLineData(newLineData)
  }, [geojsons])

  useEffect(() => {
    if (storyID != '') {
      let newLineData: GeoJSON.FeatureCollection | undefined = undefined
      const storyGeoJson = geojsons?.filter(geo => geo.properties.id == storyID)
      if (storyGeoJson && storyGeoJson[0]) {
        newLineData = {
          ...storyGeoJson[0],
          geometry: {
            ...storyGeoJson[0].geometry,
            coordinates: storyGeoJson[0].geometry.coordinates.slice(
              0,
              selectedStepIndex + 1,
            ),
          },
        }
        setLineDataDone(newLineData)
      }
    }
  }, [selectedStepIndex, storyID])

  const lineStyle = {
    type: 'line' as 'sky',
    paint: {
      // 'line-color': '#d4da68',
      'line-color': ['match', ['get', 'id'], storyID, '#18325b', '#2596be'],
      'line-width': 4,
      'line-opacity': 0.8,
      // 'line-dasharray': [['==', ['literal', ['get', 'id']], storyID], [[0,0], [1,1]]]
      'line-dasharray': [
        'match',
        ['get', 'id'],
        storyID,
        ['literal', [1, 2]],
        ['literal', [10, 0]],
      ],

      // 'line-border': 2,
      // 'line-border-color': 'red'
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
  }

  const lineOutlineStyle = {
    type: 'line' as 'sky',
    paint: {
      'line-color': '#000000',
      'line-width': 6,
      'line-opacity': ['match', ['get', 'id'], storyID, 0, 1],
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
  }

  // const hightLineStyle = {
  //   type: 'line' as 'sky',
  //   paint: {
  //     'line-color': '#d4da68',
  //     'line-width': 10,
  //     'line-blur': 3,
  //     'line-opacity': 1,
  //     // 'line-border': 2,
  //     // 'line-border-color': 'red'
  //   },
  //   layout: {
  //     'line-join': 'round',
  //     'line-cap': 'round',
  //   },
  // }

  const lineBufferForMouseEvent = {
    type: 'line' as 'sky',
    paint: {
      'line-color': '#eb5933',
      'line-width': 25,
      'line-blur': 0,
      'line-opacity': 0,
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
  }

  const lineDone = {
    type: 'line' as 'sky',
    paint: {
      'line-color': '#d4da68',
      'line-width': 10,
      'line-blur': 3,
      'line-opacity': 1
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
  }
  // const stopTitles = {
  //   type: 'symbol',
  //   paint: {
  //     'text-color': '#383838',
  //     'text-halo-blur': 4,
  //     'text-halo-color': '#f6f6f4',
  //     'text-halo-width': 1
  //   },
  //   layout: {
  //     'text-field': ['format', 'TESTONETOOO', { 'font-scale': 1.2 }],
  //     'text-offset': {
  //       stops: [
  //         [1, [0, 0.3]],
  //         [8, [0, 0.8]],
  //         [16, [0, 1.8]],
  //         [22, [0, 10]],
  //         [25, [0, 40]]
  //       ]
  //     }
  //   },
  //   'text-size': 18
  // };

  //show only selected Story
  const mapFilter = useMemo(() => ['==', 'id', storyID ?? 0], [storyID])

  //Filter for selectedFeature (hover or click on feature could trigger this)
  const filter = useMemo(
    () => ['==', 'id', selectedFeature?.properties?.id ?? 0],
    [selectedFeature?.properties?.id],
  )

  //TODO: simplify this. filter combination for selected features and selected story.
  const mapFilterAdvanced = useMemo(
    () => [
      'all',
      ['!=', 'id', selectedFeature?.properties?.id ?? 0],
      storyID != '' ? ['==', 'id', storyID] : ['has', 'id'],
    ],
    [selectedFeature?.properties?.id, storyID],
  )

  return (
    <>
      {lineData &&
        lineData.map((m, i) => (
          <Source
            data={m}
            id={'linesource' + i}
            key={'linesource' + i}
            type="geojson"
          >

            {/* @ts-ignore */}
            {/* <Layer
            {...hightLineStyle}
            filter={selectedFeature ? filter : false} 
            id={m.properties.id}
          /> */}

            <Layer
              {...lineOutlineStyle}
              filter={
                selectedFeature || storyID != '' ? mapFilterAdvanced : true
              }
              id={m.properties.id.toString() + 'normal'}
            />

            {/* @ts-ignore */}
            <Layer
              {...lineStyle}
              filter={
                selectedFeature || storyID != '' ? mapFilterAdvanced : true
              }
              id={m.properties.id.toString() + 'outline'}
            />

            {/* @ts-ignore */}
            <Layer
              {...lineStyle}
              filter={
                selectedFeature || storyID != '' ? mapFilterAdvanced : true
              }
              id={m.properties.id.toString() + 'outline'}
            />

            {/* @ts-ignore */}
            <Layer
              {...lineBufferForMouseEvent}
              filter={storyID != '' ? mapFilter : true}
              id={m.properties.id.toString() + 'buffer'}
            />
          </Source>
        ))}
      {lineDataDone && (
        <Source data={lineDataDone} id={'linesourceDone'} type="geojson">
          <Layer {...lineDone} id={'lineSourceDone'} />
        </Source>
      )}
    </>
  )
}
