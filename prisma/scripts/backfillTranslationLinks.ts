// One-off backfill: links steps/contents of existing translations to the
// steps/contents of their original story (sourceStepId / sourceContentId), so
// structural changes in the original can be synced into the translations.
//
// Mapping: title step -> title step, other steps by position, contents by
// position within the step (only if the content type matches).
// Mismatches are logged and left unlinked.
//
// Run: npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/scripts/backfillTranslationLinks.ts [--dry-run]

import { PrismaClient, SlideContent, StoryStep } from '@prisma/client'

const prisma = new PrismaClient()
const dryRun = process.argv.includes('--dry-run')

type Step = StoryStep & { content: SlideContent[] }

let linkedSteps = 0
let linkedContents = 0
const warnings: string[] = []

async function linkStep(source: Step, target: Step, label: string) {
  if (!target.sourceStepId) {
    linkedSteps++
    if (!dryRun) {
      await prisma.storyStep.update({
        where: { id: target.id },
        data: { sourceStepId: source.id },
      })
    }
  }

  if (source.content.length !== target.content.length) {
    warnings.push(
      `${label}: content count differs (original ${source.content.length}, translation ${target.content.length})`,
    )
  }
  const sourceByPos = new Map(source.content.map(c => [c.position, c]))
  for (const content of target.content) {
    if (content.sourceContentId) {
      continue
    }
    const match = sourceByPos.get(content.position)
    if (!match || match.type !== content.type) {
      warnings.push(
        `${label}: content at position ${content.position} (${content.type}) has no matching original content`,
      )
      continue
    }
    linkedContents++
    if (!dryRun) {
      await prisma.slideContent.update({
        where: { id: content.id },
        data: { sourceContentId: match.id },
      })
    }
  }
}

async function main() {
  const include = {
    firstStep: { include: { content: true } },
    steps: { include: { content: true } },
  }
  const originals = await prisma.story.findMany({
    where: { isTranslation: false, groupId: { not: null } },
    include: include,
  })

  for (const original of originals) {
    const translations = await prisma.story.findMany({
      where: { groupId: original.groupId, isTranslation: true },
      include: include,
    })

    for (const translation of translations) {
      const prefix = `[${original.slug} -> ${translation.language} (${translation.slug})]`

      if (original.firstStep && translation.firstStep) {
        await linkStep(original.firstStep, translation.firstStep, `${prefix} title`)
      }

      if (original.steps.length !== translation.steps.length) {
        warnings.push(
          `${prefix}: step count differs (original ${original.steps.length}, translation ${translation.steps.length})`,
        )
      }
      const sourceByPos = new Map(original.steps.map(s => [s.position, s]))
      for (const step of translation.steps) {
        const source = sourceByPos.get(step.position)
        if (!source) {
          warnings.push(`${prefix}: step at position ${step.position} has no original step`)
          continue
        }
        await linkStep(source, step, `${prefix} step ${step.position}`)
      }
    }
  }

  console.log(`${dryRun ? '[dry-run] ' : ''}linked ${linkedSteps} steps, ${linkedContents} contents`)
  if (warnings.length > 0) {
    console.log(`\n${warnings.length} warnings (left unlinked, please check manually):`)
    warnings.forEach(w => console.log(`- ${w}`))
  }
}

main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
