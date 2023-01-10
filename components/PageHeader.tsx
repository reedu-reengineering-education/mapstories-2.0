interface StudioHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
}

export function PageHeader({ heading, text, children }: StudioHeaderProps) {
  return (
    <div className="flex justify-between">
      <div className="my-6 grid gap-1 md:my-12">
        <h1 className="text-3xl font-bold tracking-wide text-slate-900 md:text-5xl lg:text-6xl">
          {heading}
        </h1>
        {text && (
          <p className="text-slate-700 sm:text-xl sm:leading-8">{text}</p>
        )}
      </div>
      {children}
    </div>
  )
}
