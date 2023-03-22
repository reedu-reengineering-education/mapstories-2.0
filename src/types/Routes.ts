export interface Route {
  title: string
  href: string
  disabled?: boolean
  icon?: React.ForwardRefExoticComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined
      titleId?: string | undefined
    }
  >
}
