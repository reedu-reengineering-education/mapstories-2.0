interface StoryLayoutProps {
  children?: React.ReactNode
}

/**
 * Layout for viewing a specific story in the gallery.
 * The map (ViewerView) lives in the parent [filter]/layout.tsx so it stays
 * mounted across step navigation, preventing full page reloads and re-inits.
 */
export default function StoryLayout({ children }: StoryLayoutProps) {
  return <>{children}</>
}
