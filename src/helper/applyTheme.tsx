export function applyTheme(theme: any) {
  if (theme) {
    Object.keys(theme).forEach((key: string) => {
      switch (key) {
        case 'shadow_color':
          document.documentElement.style.setProperty(
            '--shadow-color',
            theme[key],
          )
          break
        case 'border':
          document.documentElement.style.setProperty('--border', theme[key])
          break
        case 'box_shadow':
          document.documentElement.style.setProperty('--boxshadow', theme[key])
          break
        case 'border_radius':
          document.documentElement.style.setProperty(
            '--border-radius',
            theme[key],
          )
          break
        case 'text_color':
          document.documentElement.style.setProperty('--text-color', theme[key])
          break
        case 'button_color':
          document.documentElement.style.setProperty(
            '--button-color',
            theme[key],
          )
          break
        case 'background_color':
          document.documentElement.style.setProperty(
            '--background-color',
            theme[key],
          )
          break
      }
    })
  }
}
