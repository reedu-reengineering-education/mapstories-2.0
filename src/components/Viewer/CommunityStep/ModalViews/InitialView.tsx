import { Button } from '@/src/components/Elements/Button'

// Individual sub-components for each content type view
export default function InitialView({ onCancel, onAdd }: any) {
  return (
    <div className="flex flex-col gap-4">
      Du kannst dieser Story einen Community Step hinzufügen. Dieser muss von
      den Autoren genehmigt werden und wird dann in die Story eingefügt und
      angezeigt.
      <div className="flex flex-row justify-end gap-4">
        <Button onClick={onCancel} variant={'inverse'}>
          Abbrechen
        </Button>
        <Button onClick={onAdd}>Weiter</Button>
      </div>
    </div>
  )
}
