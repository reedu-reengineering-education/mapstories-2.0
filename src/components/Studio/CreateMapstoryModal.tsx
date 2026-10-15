'use client'

import { createMapstorySchema } from '@/src/lib/validations/mapstory'
import { useState } from 'react'
import { Button } from '../Elements/Button'
import { Modal } from '../Modal'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/src/lib/toast'
import { Input } from '../Elements/Input'
import { Textarea } from '../Elements/Textarea'
import { createStory } from '@/src/lib/api/story/createStory'
import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'
import { StoryMode, Theme } from '@prisma/client'
import Switch from '../Elements/Switch'
import { LanguageSelect } from '../Elements/LanguageSelect'
import { availableStoryLanguages } from '@/src/lib/languageFlags'
import { CalendarDaysIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { useMapLanguage } from '@/src/lib/hooks/useMapLanguage'
import { cx } from 'class-variance-authority'

type FormData = z.infer<typeof createMapstorySchema>

type Props = {
  trigger: React.ReactElement
  themes: Theme[]
  defaultAuthor?: string | null
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h3>
      {children}
    </section>
  )
}

function FieldLabel({
  children,
  hint,
}: {
  children: React.ReactNode
  hint?: string
}) {
  return (
    <span className="mb-1 block text-sm font-medium text-gray-700">
      {children}
      {hint && <span className="ml-1 font-normal text-slate-400">({hint})</span>}
    </span>
  )
}

function ToggleRow({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-3">
      <div>
        <p className="text-sm font-medium text-slate-800">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      {children}
    </div>
  )
}

function OptionCard({
  selected,
  onSelect,
  children,
}: {
  selected: boolean
  onSelect: () => void
  children: React.ReactNode
}) {
  return (
    <button
      aria-pressed={selected}
      className={cx(
        'relative flex flex-col gap-1 rounded-lg border-2 p-3 text-left transition-all',
        selected
          ? 'border-[#62a044] bg-[#62a044]/10'
          : 'border-slate-200 opacity-70 hover:border-slate-400 hover:opacity-100',
      )}
      onClick={onSelect}
      type="button"
    >
      {selected && (
        <CheckCircleIcon className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white text-[#62a044]" />
      )}
      {children}
    </button>
  )
}

function ThemePreview({ theme }: { theme: Theme }) {
  return (
    <div
      className="flex h-12 items-center justify-center px-2 text-xs"
      style={
        {
          '--shadow-color': theme.shadow_color ?? undefined,
          border: theme.border ?? undefined,
          borderRadius: theme.border_radius ?? undefined,
          boxShadow: theme.box_shadow ?? undefined,
          background: theme.background_color ?? 'white',
          color: theme.text_color ?? undefined,
          fontFamily: theme.fontFamily ?? undefined,
        } as React.CSSProperties
      }
    >
      <span
        className="h-2 w-8 rounded-full"
        style={{ background: theme.button_color ?? '#38383a' }}
      />
    </div>
  )
}

function getDefaultLanguage(lng: string) {
  return availableStoryLanguages.some(l => l.code === lng) ? lng : 'de'
}

function getDefaultTheme(themes: Theme[]) {
  if (themes.some(theme => theme.name === 'Standard')) {
    return 'Standard'
  }
  return themes[0]?.name ?? null
}

export default function CreateMapstoryModal({
  trigger,
  themes,
  defaultAuthor,
}: Props) {
  const router = useRouter()
  const language = useBoundStore(state => state.language)
  const { t } = useTranslation(language, 'createMapstory')
  // the language currently selected in the menu (route segment)
  const uiLanguage = useMapLanguage()

  const getDefaultValues = (): Partial<FormData> => ({
    name: '',
    mode: StoryMode.NORMAL,
    author: defaultAuthor ?? '',
    description: '',
    visibility: 'PRIVATE',
    themeId: getDefaultTheme(themes),
    lines: true,
    community: false,
    language: getDefaultLanguage(uiLanguage),
  })

  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(createMapstorySchema),
    defaultValues: getDefaultValues(),
  })
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [open, setOpen] = useState(false)

  const isPublic = watch('visibility') === 'PUBLIC'

  async function onSubmit(data: FormData) {
    setIsSaving(true)

    try {
      const response = await createStory({
        ...data,
        // community suggestions only work for public stories
        community: data.community && data.visibility === 'PUBLIC',
      })
      toast({
        message: t('created'),
        type: 'success',
      })
      const newStory = await response.data
      router.push(`/storylab/${newStory.slug}`)
      setOpen(false)
    } catch (e) {
      return toast({
        title: t('somethingWrong'),
        message: t('notCreated'),
        type: 'error',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal
      description={t('description')}
      onOpenChange={isOpen => {
        // always start from the defaults, e.g. after switching the UI language
        if (isOpen) {
          reset(getDefaultValues())
        }
        setOpen(isOpen)
      }}
      open={open}
      title={t('title')}
      trigger={trigger}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Content className="flex max-h-[65vh] flex-col gap-8 overflow-y-auto">
          <Section title={t('sectionBasics')}>
            <label>
              <FieldLabel>{t('name')}</FieldLabel>
              <Input
                autoFocus
                errors={errors.name}
                placeholder={t('namePlaceholder')}
                size={100}
                {...register('name')}
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label>
                <FieldLabel hint={t('optional')}>{t('author')}</FieldLabel>
                <Input
                  errors={errors.author}
                  placeholder={t('authorPlaceholder')}
                  size={100}
                  {...register('author')}
                />
              </label>
              <label>
                <FieldLabel>{t('language')}</FieldLabel>
                <Controller
                  control={control}
                  name="language"
                  render={({ field: { onChange, value, ref } }) => (
                    <LanguageSelect
                      className="h-9"
                      languages={availableStoryLanguages}
                      onChange={onChange}
                      ref={ref}
                      value={value}
                    />
                  )}
                />
              </label>
            </div>
            <p className="-mt-2 text-xs text-slate-500">{t('languageHint')}</p>
            <label>
              <FieldLabel hint={t('optional')}>{t('description')}</FieldLabel>
              <Textarea
                errors={errors.description}
                placeholder={t('descriptionPlaceholder')}
                rows={3}
                {...register('description')}
              />
            </label>
          </Section>

          <Section title={t('sectionAppearance')}>
            <div>
              <FieldLabel>{t('mode')}</FieldLabel>
              <Controller
                control={control}
                name="mode"
                render={({ field: { onChange, value } }) => (
                  <div className="grid gap-3 md:grid-cols-2">
                    <OptionCard
                      onSelect={() => onChange(StoryMode.NORMAL)}
                      selected={value === StoryMode.NORMAL}
                    >
                      <MapPinIcon className="h-6 w-6 text-slate-700" />
                      <span className="text-sm font-medium">
                        {t('modeNormal')}
                      </span>
                      <span className="text-xs text-slate-500">
                        {t('modeNormalDescription')}
                      </span>
                    </OptionCard>
                    <OptionCard
                      onSelect={() => onChange(StoryMode.TIMELINE)}
                      selected={value === StoryMode.TIMELINE}
                    >
                      <CalendarDaysIcon className="h-6 w-6 text-slate-700" />
                      <span className="text-sm font-medium">
                        {t('modeTimeline')}
                      </span>
                      <span className="text-xs text-slate-500">
                        {t('modeTimelineDescription')}
                      </span>
                    </OptionCard>
                  </div>
                )}
              />
            </div>

            {themes.length > 0 && (
              <div>
                <FieldLabel>{t('theme')}</FieldLabel>
                <Controller
                  control={control}
                  name="themeId"
                  render={({ field: { onChange, value } }) => (
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                      {themes.map(theme => (
                        <OptionCard
                          key={theme.name}
                          onSelect={() => onChange(theme.name)}
                          selected={value === theme.name}
                        >
                          <ThemePreview theme={theme} />
                          <span className="mt-1 text-sm font-medium">
                            {theme.name}
                          </span>
                        </OptionCard>
                      ))}
                    </div>
                  )}
                />
              </div>
            )}

            <Controller
              control={control}
              name="lines"
              render={({ field: { onChange, value, ref } }) => (
                <ToggleRow
                  description={t('linesDescription')}
                  title={t('lines')}
                >
                  <Switch
                    defaultChecked={value}
                    onCheckedChange={onChange}
                    ref={ref}
                  />
                </ToggleRow>
              )}
            />
          </Section>

          <Section title={t('sectionSharing')}>
            <Controller
              control={control}
              name="visibility"
              render={({ field: { onChange, value, ref } }) => (
                <ToggleRow
                  description={t('publicDescription')}
                  title={t('public')}
                >
                  <Switch
                    defaultChecked={value === 'PUBLIC'}
                    onCheckedChange={checked =>
                      onChange(checked ? 'PUBLIC' : 'PRIVATE')
                    }
                    ref={ref}
                  />
                </ToggleRow>
              )}
            />
            <div className={isPublic ? '' : 'pointer-events-none opacity-50'}>
              <Controller
                control={control}
                name="community"
                render={({ field: { onChange, value, ref } }) => (
                  <ToggleRow
                    description={t('communityDescription')}
                    title={t('community')}
                  >
                    <Switch
                      defaultChecked={value}
                      disabled={!isPublic}
                      onCheckedChange={onChange}
                      ref={ref}
                    />
                  </ToggleRow>
                )}
              />
            </div>
          </Section>
        </Modal.Content>
        <Modal.Footer className="flex justify-end gap-2">
          <Button
            onClick={() => setOpen(false)}
            type="button"
            variant={'inverse'}
          >
            {t('cancel')}
          </Button>
          <Button disabled={isSaving} isLoading={isSaving} type="submit">
            {t('create')}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}
