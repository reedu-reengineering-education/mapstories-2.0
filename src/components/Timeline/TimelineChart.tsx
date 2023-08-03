'use client'

import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

import de from 'apexcharts/dist/locales/de.json'
import en from 'apexcharts/dist/locales/en.json'

interface TimelineEvent {
  timestamp: Date
  title: string
}

interface TimelineChartProps {
  data: TimelineEvent[]
  onEventClick?: (_event: TimelineEvent) => void
  activeIndex?: number
}

export default function TimelineChart({
  data,
  onEventClick,
  activeIndex,
}: TimelineChartProps) {
  const chartData = data.map(e => [e.timestamp.getTime(), 1])

  const ScatterChart = (
    <Chart
      height={200}
      options={{
        chart: {
          type: 'scatter',
          id: 'mainChart',
          height: 200,
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },

          locales: [de, en],
          defaultLocale: 'de',
          events: {
            dataPointSelection: (_, __, { dataPointIndex }) => {
              onEventClick && onEventClick(data[dataPointIndex])
            },
          },
        },
        tooltip: {
          y: {
            formatter: (_, { dataPointIndex }) => data[dataPointIndex].title,
            title: {
              formatter: () => '',
            },
          },
        },
        markers: {
          discrete: [
            {
              seriesIndex: 0,
              // For dataPointIndex: 0 there is no discrete marker at all!
              dataPointIndex: activeIndex,

              // Also docs says its "fill" and "stroke", but "fillColor" and "strokeColor" are working
              fillColor: '#0A0',
              strokeColor: '#FFF',
              size: 7,
            },
          ],
        },
        xaxis: {
          type: 'datetime',
          tooltip: {
            enabled: false,
          },
        },
        yaxis: {
          show: false,
          tooltip: {
            enabled: false,
          },
        },
        grid: {
          yaxis: {
            lines: {
              show: false,
            },
          },
        },
      }}
      series={[
        {
          data: chartData,
        },
      ]}
      type="scatter"
    />
  )

  const TimelineBrush = (
    <Chart
      height={85}
      options={{
        chart: {
          type: 'scatter',
          id: 'brushChart',
          brush: {
            target: 'mainChart',
            enabled: true,
          },
          selection: {
            enabled: true,
            xaxis: {
              min: Math.min(...chartData.map(([x]) => x)),
              max: Math.max(...chartData.map(([x]) => x)),
            },
          },
          height: 85,
          locales: [de, en],
          defaultLocale: 'de',
        },
        markers: {
          size: 3,
          discrete: [
            {
              seriesIndex: 0,
              // For dataPointIndex: 0 there is no discrete marker at all!
              dataPointIndex: activeIndex,

              // Also docs says its "fill" and "stroke", but "fillColor" and "strokeColor" are working
              fillColor: '#0A0',
              strokeColor: '#FFF',
              size: 3,
            },
          ],
        },
        xaxis: {
          type: 'datetime',
          labels: {
            style: {
              fontSize: '0.6rem',
            },
          },
        },
        yaxis: {
          min: 0,
          max: 2,
          show: false,
        },
        grid: {
          padding: {
            top: 0,
          },
          yaxis: {
            lines: {
              show: false,
            },
          },
        },
      }}
      series={[
        {
          data: chartData,
        },
      ]}
      type="scatter"
    />
  )

  return (
    <div>
      <div className="px-2">{ScatterChart}</div>
      <div className="rounded bg-zinc-100 px-2 opacity-80">{TimelineBrush}</div>
    </div>
  )
}
