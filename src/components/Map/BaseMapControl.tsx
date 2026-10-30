import { MapStyleName } from './mapStyles'

type BaseMapControlProps = {
  value: MapStyleName
  onChange: (style: MapStyleName) => void
}

export default function BaseMapControl({
  value,
  onChange,
}: BaseMapControlProps) {
  return (
    <div
      aria-label="Kartenansicht"
      className="absolute bottom-6 right-2 z-[60] flex overflow-hidden rounded border border-gray-300 bg-white shadow"
      role="group"
    >
      <button
        aria-pressed={value === 'streets'}
        className={getButtonClasses(value === 'streets')}
        onClick={() => onChange('streets')}
        type="button"
      >
        Straßenkarte
      </button>

      <button
        aria-pressed={value === 'satellite'}
        className={getButtonClasses(value === 'satellite', true)}
        onClick={() => onChange('satellite')}
        type="button"
      >
        Satellit
      </button>

      <button
        aria-pressed={value === 'hybrid'}
        className={getButtonClasses(value === 'hybrid', true)}
        onClick={() => onChange('hybrid')}
        type="button"
      >
        Satellit mit Beschriftung
      </button>
    </div>
  )
}

function getButtonClasses(active: boolean, withBorder = false) {
  return [
    withBorder ? 'border-l border-gray-300' : '',
    'px-3 py-2 text-sm text-black',
    active
      ? 'bg-gray-200 font-semibold'
      : 'bg-white hover:bg-gray-100',
  ].join(' ')
}
