type SidebarSlideProps = {
  children: React.ReactElement
}

export default function SidebarSlide({ children }: SidebarSlideProps) {
  return (
    <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-slate-100">
      {children}
    </div>
  )
}
