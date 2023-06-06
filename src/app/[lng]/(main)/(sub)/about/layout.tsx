interface LayoutProps {
  children?: React.ReactNode
}

export default async function Layout({ children }: LayoutProps) {
  //const user = await getCurrentUser()

  return <div>{children}</div>
}
