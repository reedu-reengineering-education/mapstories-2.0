import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateThemes(themes: any) {
  for await (const theme of themes) {
    await addTheme(theme)
  }
}

async function addTheme(theme: any) {
  const themeCreated = await prisma.theme.create({
    data: theme,
  })
}

async function seed() {
  // delete existing data
  await prisma.theme.deleteMany({}).catch(() => {})

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
