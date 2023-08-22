export function applyTheme(theme: any) {
  if (theme) {
    Object.keys(theme).forEach((key: string) => {
      switch (key) {
        case 'shadow_color':
          document.documentElement.style.setProperty(
            '--shadow-color',
            theme[key],
          )
        case 'border':
          document.documentElement.style.setProperty('--border', theme[key])
        case 'box_shadow':
          document.documentElement.style.setProperty('--boxshadow', theme[key])
        case 'border_radius':
          document.documentElement.style.setProperty(
            '--border-radius',
            theme[key],
          )
        case 'text_color':
          document.documentElement.style.setProperty('--text-color', theme[key])
      }
    })
  }
}
