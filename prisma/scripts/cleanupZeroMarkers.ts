// One-off cleanup: removes markers that were saved by accident because the
// editor map used to jump to 0,0 when a story had no markers yet.
//
// - Title steps (stories.firstStepId) never have a marker -> feature is removed.
// - Regular steps with a marker within THRESHOLD degrees of 0,0 -> feature is
//   removed, so the author can set it again.
//
// Dry run by default (only lists what would change). Pass --apply to write.
// Optional: --threshold=0.1 (degrees around 0,0, default 0.1)
//
// Run:
//   npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/scripts/cleanupZeroMarkers.ts
//   npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/scripts/cleanupZeroMarkers.ts --apply

import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const apply = process.argv.includes('--apply')
const thresholdArg = process.argv.find(a => a.startsWith('--threshold='))
const threshold = thresholdArg ? Number(thresholdArg.split('=')[1]) : 0.1

type Row = {
  id: string
  story_slug: string | null
  story_name: string | null
  position: number
  lng: number | null
  lat: number | null
}

const fmt = (row: Row) =>
  `  - ${row.story_slug ?? '?'} ("${row.story_name ?? ''}") step ${row.position} [${row.id}] at ${row.lng}, ${row.lat}`

async function main() {
  if (!Number.isFinite(threshold) || threshold <= 0) {
    throw new Error(`Invalid --threshold: ${thresholdArg}`)
  }

  const titleSteps = await prisma.$queryRaw<Row[]>`
    SELECT st.id, s.slug AS story_slug, s.name AS story_name, st.position,
           (st.feature->'geometry'->'coordinates'->>0)::float AS lng,
           (st.feature->'geometry'->'coordinates'->>1)::float AS lat
    FROM storysteps st
    JOIN stories s ON s."firstStepId" = st.id
    WHERE st.feature IS NOT NULL AND st.feature::text <> 'null'
    ORDER BY s.slug`

  const zeroSteps = await prisma.$queryRaw<Row[]>`
    SELECT st.id, s.slug AS story_slug, s.name AS story_name, st.position,
           (st.feature->'geometry'->'coordinates'->>0)::float AS lng,
           (st.feature->'geometry'->'coordinates'->>1)::float AS lat
    FROM storysteps st
    JOIN stories s ON s.id = st."storyId"
    WHERE st.feature IS NOT NULL
      AND st.feature->'geometry'->>'type' = 'Point'
      AND abs((st.feature->'geometry'->'coordinates'->>0)::float) < ${threshold}
      AND abs((st.feature->'geometry'->'coordinates'->>1)::float) < ${threshold}
    ORDER BY s.slug, st.position`

  console.log(`${apply ? '' : '[dry-run] '}threshold: ${threshold}°\n`)
  console.log(`Title steps with a marker: ${titleSteps.length}`)
  titleSteps.forEach(r => console.log(fmt(r)))
  console.log(`\nRegular steps with a marker near 0,0: ${zeroSteps.length}`)
  zeroSteps.forEach(r => console.log(fmt(r)))

  const ids = [...titleSteps, ...zeroSteps].map(r => r.id)
  if (ids.length === 0) {
    console.log('\nNothing to clean up.')
    return
  }
  if (!apply) {
    console.log(`\n[dry-run] ${ids.length} markers would be removed. Re-run with --apply to write.`)
    return
  }

  const result = await prisma.storyStep.updateMany({
    where: { id: { in: ids } },
    data: { feature: Prisma.DbNull },
  })
  console.log(`\nRemoved ${result.count} markers.`)
}

main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
