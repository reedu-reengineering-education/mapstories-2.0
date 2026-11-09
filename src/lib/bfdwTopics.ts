// Topic areas ("Themenbereiche") a story can belong to (originally defined
// for BFDW, available on all sites). Each topic has its own color so stories
// can be told apart at a glance in the gallery.
// The keys are stored in Story.topic - don't rename them without a migration.
export const BFDW_TOPICS = [
  { key: 'KLIMA_UMWELT', label: 'Klima und Umwelt', color: '#2e7d32' },
  {
    key: 'DEMOKRATIE_MENSCHENRECHTE',
    label: 'Demokratie und Menschenrechte',
    color: '#1565c0',
  },
  {
    key: 'GESCHLECHTERGERECHTIGKEIT',
    label: 'Geschlechter-Gerechtigkeit',
    color: '#8e24aa',
  },
  {
    key: 'AGRAROEKOLOGIE_NAHRUNG',
    label: 'Agrarökologie und Recht auf Nahrung',
    color: '#a0661b',
  },
  { key: 'PSYCHOSOZIALES', label: 'Psychosoziale Themen', color: '#d81b60' },
  { key: 'FRIEDENSFOERDERUNG', label: 'Friedensförderung', color: '#00897b' },
  { key: 'FLUCHT_MIGRATION', label: 'Flucht & Migration', color: '#ef6c00' },
  {
    key: 'BILDUNG_DIGITALER_WANDEL',
    label: 'Bildung und Digitaler Wandel',
    color: '#c99400',
  },
  {
    key: 'OEKUMENE_KIRCHE_THEOLOGIE',
    label: 'Ökumene/ Kirche & Theologie',
    color: '#546e7a',
  },
  { key: 'GESUNDHEIT', label: 'Gesundheit', color: '#c62828' },
] as const

export type BfdwTopic = (typeof BFDW_TOPICS)[number]
export type BfdwTopicKey = BfdwTopic['key']

export const BFDW_TOPIC_KEYS = BFDW_TOPICS.map(t => t.key) as [
  BfdwTopicKey,
  ...BfdwTopicKey[],
]

export function getBfdwTopic(key?: string | null): BfdwTopic | undefined {
  return key ? BFDW_TOPICS.find(t => t.key === key) : undefined
}
