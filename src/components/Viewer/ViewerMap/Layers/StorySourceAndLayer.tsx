import { useEffect, useState } from 'react'
import { Layer, Source } from 'react-map-gl'

export default function StorySourceLayer({
  geojsons,
  selectedFeature,
  storyID,
  selectedStepIndex,
}: {
  geojsons: GeoJSON.Feature<GeoJSON.LineString>[] | undefined
  selectedFeature: GeoJSON.Feature | undefined
  storyID: string
  selectedStepIndex: any
}) {
  const [lineData, setLineData] = useState<GeoJSON.Feature[] | undefined>()

  const [lineDataDone, setLineDataDone] = useState<
    GeoJSON.Feature | undefined
  >()

  const [lineDataTodo, setLineDataTodo] = useState<
    GeoJSON.Feature | undefined
  >()

  // generate Line string
  useEffect(() => {
    let newLineData: GeoJSON.Feature[] | undefined = undefined

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
      let newLineData: GeoJSON.Feature | undefined = undefined
      let newLineDataTodo: GeoJSON.Feature | undefined = undefined

      const storyGeoJson = geojsons?.filter(
        geo => geo.properties?.id == storyID,
      )
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

        newLineDataTodo = {
          ...storyGeoJson[0],
          geometry: {
            ...storyGeoJson[0].geometry,
            coordinates:
              storyGeoJson[0].geometry.coordinates.slice(selectedStepIndex),
          },
        }
        setLineDataTodo(newLineDataTodo)
      }
    } else {
      resetSelectedStoryData()
    }
  }, [selectedStepIndex, storyID])

  function resetSelectedStoryData() {
    setLineDataDone(undefined)
    setLineDataTodo(undefined)
  }

  const lineStyle = {
    type: 'line' as 'sky',
    paint: {
      'line-color': ['match', ['get', 'id'], storyID, '#18325b', '#d91e9b'],
      'line-width': 4,
      'line-opacity': 0.8,
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
      visibility: storyID === '' ? 'visible' : 'none',
    },
  }

  const lineOutlineStyle = {
    type: 'line' as 'sky',
    paint: {
      'line-color': '#38383a',
      'line-width': 4,
      'line-opacity': ['match', ['get', 'id'], storyID, 0, 1],
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
      visibility: storyID === '' ? 'visible' : 'none',
    },
  }

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
      visibility: storyID != '' ? 'visible' : 'none',
    },
  }

  const lineDone = {
    type: 'line' as 'sky',
    paint: {
      'line-color': '#d4da68',
      'line-width': 10,
      'line-blur': 3,
      'line-opacity': 1,
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
  }

  const lineTodo = {
    type: 'line' as 'sky',
    paint: {
      'line-color': '#18325b',
      'line-width': 6,
      'line-blur': 0,
      'line-opacity': 0.8,
      'line-dasharray': [1, 2],
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
  }

  function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16)
  }

  function getLineStyle(id: string) {
    const color = getRandomColor()
    return {
      type: 'line' as 'sky',
      paint: {
        'line-color': ['match', ['get', 'id'], id, color, color],
        'line-width': 2,
        'line-opacity': 0.8,
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
        visibility: storyID === '' ? 'visible' : 'none',
      },
    }
  }

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
            <Layer
              {...lineOutlineStyle}
              id={m.properties?.id.toString() + 'outline'}
            />
            {/* @ts-ignore */}
            <Layer
              {...getLineStyle(storyID)}
              id={m.properties?.id.toString() + 'normal'}
            />
            {/* @ts-ignore */}
            <Layer
              {...lineBufferForMouseEvent}
              id={m.properties?.id.toString() + 'buffer'}
            />
          </Source>
        ))}
      {lineDataDone && (
        <Source data={lineDataDone} id={'linesourceDone'} type="geojson">
          {/* @ts-ignore */}
          <Layer {...lineDone} id={'lineSourceDone'} />
        </Source>
      )}
      {lineDataTodo && (
        <Source data={lineDataTodo} id={'linesourceTodo'} type="geojson">
          {/* @ts-ignore */}
          <Layer {...lineTodo} id={'lineSourceTodo'} />
        </Source>
      )}
    </>
  )
}
