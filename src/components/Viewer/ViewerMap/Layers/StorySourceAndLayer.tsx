import { useEffect, useState } from 'react'
import { Layer, Source } from 'react-map-gl'

export default function StorySourceLayer({
  geojsons,
  storyID,
  selectedStepIndex,
}: {
  geojsons: GeoJSON.Feature<GeoJSON.LineString>[] | undefined
  selectedFeature: GeoJSON.Feature | undefined
  storyID: string
  selectedStepIndex: any
}) {
  const [lineData, setLineData] = useState<GeoJSON.Feature[] | undefined>()

  const [visitedLine, setVisitedLine] = useState<GeoJSON.Feature | undefined>()

  const [upcomingLine, setUpcomingLine] = useState<
    GeoJSON.Feature | undefined
  >()

  const [activeLine, setActiveLine] = useState<GeoJSON.Feature | undefined>()

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
      let newActiveLine: GeoJSON.Feature | undefined = undefined
      let newUpcomingLine: GeoJSON.Feature | undefined = undefined
      let newVisitedLine: GeoJSON.Feature | undefined = undefined

      const storyGeoJson = geojsons?.filter(
        geo => geo.properties?.id == storyID,
      )

      if (storyGeoJson && storyGeoJson[0]) {
        // Linie zwischen aktuellem und vorherigem Marker
        const previousIndex = Math.max(selectedStepIndex - 1, 0)
        newActiveLine = {
          ...storyGeoJson[0],
          geometry: {
            ...storyGeoJson[0].geometry,
            coordinates: storyGeoJson[0].geometry.coordinates.slice(
              previousIndex,
              selectedStepIndex + 1, // Inklusive des aktuellen Markers
            ),
          },
        }
        setActiveLine(newActiveLine)

        newUpcomingLine = {
          ...storyGeoJson[0],
          geometry: {
            ...storyGeoJson[0].geometry,
            coordinates:
              storyGeoJson[0].geometry.coordinates.slice(selectedStepIndex),
          },
        }
        setUpcomingLine(newUpcomingLine)
        newVisitedLine = {
          ...storyGeoJson[0],
          geometry: {
            ...storyGeoJson[0].geometry,
            coordinates: storyGeoJson[0].geometry.coordinates.slice(
              0,
              selectedStepIndex + 1,
            ),
          },
        }
        setVisitedLine(newVisitedLine)
      }
    } else {
      resetSelectedStoryData()
    }
  }, [selectedStepIndex, storyID])

  function resetSelectedStoryData() {
    setActiveLine(undefined)
    setUpcomingLine(undefined)
    setVisitedLine(undefined)
  }

  const stylesActive = {
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

  const stylesUpcoming = {
    type: 'line' as 'sky',
    paint: {
      'line-color': '#18325b',
      'line-width': 6,
      'line-blur': 0,
      'line-opacity': 0.15,
      'line-dasharray': [1, 2],
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
  }

  const stylesVisited = {
    type: 'line' as 'sky',
    paint: {
      'line-color': '#18325b',
      'line-width': 6,
      'line-blur': 0,
      'line-opacity': 0.15,
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
  }

  // get a random colour which is not white

  function getLineStyle(id: string) {
    const routeColors = [
      '#FF5733',
      '#FFC300',
      '#36DBCA',
      '#FF8547',
      '#3D9970',
      '#FF4136',
      '#85144b',
      '#7FDBFF',
      '#B10DC9',
      '#01FF70',
      '#2ECC40',
      '#39CCCC',
      '#F012BE',
      '#3D9970',
      '#605ca8',
    ]

    return {
      type: 'line' as 'sky',
      paint: {
        'line-color': [
          'match',
          ['get', 'id'],
          id,
          '#18325b',
          routeColors[Math.floor(Math.random() * routeColors.length)],
        ],
        'line-width': 4,
        'line-opacity': 0.9,
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
              {...getLineStyle(storyID)}
              id={m.properties?.id.toString() + 'normal'}
            />
          </Source>
        ))}

      {upcomingLine && (
        <Source data={upcomingLine} id={'lineUpcoming'} type="geojson">
          {/* @ts-ignore */}
          <Layer {...stylesUpcoming} id={'lineUpcoming'} />
        </Source>
      )}
      {visitedLine && (
        <Source data={visitedLine} id={'lineVisited'} type="geojson">
          {/* @ts-ignore */}
          <Layer {...stylesVisited} id={'lineVisited'} />
        </Source>
      )}
      {activeLine && (
        <Source data={activeLine} id={'lineActive'} type="geojson">
          {/* @ts-ignore */}
          <Layer {...stylesActive} id={'lineActive'} />
        </Source>
      )}
    </>
  )
}
