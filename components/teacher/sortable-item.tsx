"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import React from "react"

interface SortableItemProps {
  id: string
  children: React.ReactNode | (({ attributes, listeners }: { attributes: any, listeners: any }) => React.ReactNode)
  className?: string
}

export function SortableItem({ id, children, className }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  // We provide the attributes and listeners to the children via a cloning pattern or simple prop injection
  // To avoid breaking existing code but allow handle-based dragging, we'll keep the spreading on the div
  // but we will move it to the handle in the CourseEditor by passing these as props if children is a function

  return (
    <div ref={setNodeRef} style={style} className={className}>
      {typeof children === 'function'
        ? (children as any)({ attributes, listeners })
        : <div {...attributes} {...listeners}>{children}</div>
      }
    </div>
  )
}
