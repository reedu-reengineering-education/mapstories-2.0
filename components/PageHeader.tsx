interface StudioHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
}

export function PageHeader({ heading, text, children }: StudioHeaderProps) {
  return (
    <div className="flex justify-between">
      <div className="grid gap-1">
        <h1 className="text-4xl font-bold tracking-wide text-slate-900">
          {heading}
        </h1>
        {text && <p className="text-xl text-neutral-500">{text}</p>}
      </div>
      {children}
    </div>
  )
}
