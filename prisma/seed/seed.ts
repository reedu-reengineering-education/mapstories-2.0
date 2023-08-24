import { PrismaClient, Theme } from '@prisma/client'

const prisma = new PrismaClient()

async function updateThemes(themes: any) {
  for await (const theme of themes) {
    await addTheme(theme)
  }
}

async function addTheme(theme: Theme) {
  const themeCreated = await prisma.theme.upsert({
    where: {
      name: theme.name,
    },
    update: theme,
    create: theme,
  })
}

async function seed() {
  // delete existing data
  //   await prisma.theme.deleteMany({}).catch(() => {})

  // import all themes
  const themes = require('./data/themes.json')
  updateThemes(themes)
}

seed()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
