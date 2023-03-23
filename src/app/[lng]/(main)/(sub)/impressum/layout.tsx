interface LayoutProps {
  children?: React.ReactNode
}

export default async function Layout({ children }: LayoutProps) {
  return <div className="container mx-auto my-6">{children}</div>
}
