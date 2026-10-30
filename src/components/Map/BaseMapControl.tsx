import { MAP_STYLE_ENTRIES, MapStyleName } from './mapStyles'

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
      {MAP_STYLE_ENTRIES.map(([name, style], index) => {
        const isActive = value === name

        return (
          <button
            aria-pressed={isActive}
            className={getButtonClasses(isActive, index > 0)}
            key={name}
            onClick={() => onChange(name)}
            type="button"
          >
            {style.label}
          </button>
        )
      })}
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
