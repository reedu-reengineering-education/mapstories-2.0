'use client'

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cx } from 'class-variance-authority'
import { useEffect, useState } from 'react'

type DraggableProps = {
  id: UniqueIdentifier
  component: React.ReactElement
}

type DraggableListProps<T> = {
  items: T[]
  orientation?: 'horizontal' | 'vertical'
  onChange?: (_items: T[]) => void
}

export default function DraggableList<
  T extends { [key: string]: any } & DraggableProps,
>({ items, onChange, orientation = 'vertical' }: DraggableListProps<T>) {
  const [itemsStore, setItemsStore] = useState<T[]>([])

  useEffect(() => {
    setItemsStore(items)
  }, [items])

  useEffect(() => {
    onChange && onChange(itemsStore)
  }, [itemsStore])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(undefined)

    const { active, over } = event

    if (!active || !over) {
      return
    }

    if (active.id !== over.id) {
      setItemsStore(item => {
        const oldIndex = items.findIndex(i => i.id === active.id)
        const newIndex = items.findIndex(i => i.id === over.id)

        return arrayMove(item, oldIndex, newIndex)
      })
    }
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id)
  }

  const [activeId, setActiveId] = useState<UniqueIdentifier>()

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <SortableContext
        items={itemsStore}
        strategy={
          orientation === 'vertical'
            ? verticalListSortingStrategy
            : horizontalListSortingStrategy
        }
      >
        {itemsStore.map(i => (
          <SortableItem id={i.id} key={i.id}>
            <div
              className={cx(
                activeId === i.id
                  ? 'rounded-lg border-2 border-dashed border-slate-400 opacity-50'
                  : '',
              )}
            >
              {i.component}
            </div>
          </SortableItem>
        ))}
      </SortableContext>
      <DragOverlay>
        {activeId ? (
          <SortableItem id={activeId}>
            {items.find(i => i.id === activeId)?.component!}
          </SortableItem>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

type SortableItemProps = {
  id: UniqueIdentifier
  children: React.ReactElement
}
export function SortableItem({ id, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  )
}
