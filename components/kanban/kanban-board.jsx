'use client'

import { useState } from 'react'
import TaskColumn from './task-column'

export default function KanbanBoard({ data, userRole }) {
  const [draggedItem, setDraggedItem] = useState(null)
  const [items, setItems] = useState(data.data)

  const handleDragStart = (e, item, fromColumn) => {
    setDraggedItem({ item, fromColumn })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, toColumn) => {
    e.preventDefault()
    if (!draggedItem) return

    const { item, fromColumn } = draggedItem

    if (fromColumn === toColumn) {
      setDraggedItem(null)
      return
    }

    setItems(prev => ({
      ...prev,
      [fromColumn]: prev[fromColumn].filter(t => t.id !== item.id),
      [toColumn]: [...prev[toColumn], item],
    }))

    setDraggedItem(null)
  }

  if (data.type === 'projects') {
    // Client view: Project status columns
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        <TaskColumn
          title="Assigned"
          columnKey="assigned"
          items={items.assigned}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isProject
        />
        <TaskColumn
          title="Accepted"
          columnKey="accepted"
          items={items.accepted}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isProject
        />
        <TaskColumn
          title="Working"
          columnKey="working"
          items={items.working}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isProject
        />
        <TaskColumn
          title="Completed"
          columnKey="completed"
          items={items.completed}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isProject
        />
        <TaskColumn
          title="Cancelled"
          columnKey="cancelled"
          items={items.cancelled}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isProject
        />
      </div>
    )
  }

  // PM and Developer view: Task status columns
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <TaskColumn
        title="To Do"
        columnKey="todo"
        items={items.todo}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />
      <TaskColumn
        title="In Progress"
        columnKey="in_progress"
        items={items.in_progress}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />
      <TaskColumn
        title="In Review"
        columnKey="review"
        items={items.review}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />
      <TaskColumn
        title="Done"
        columnKey="done"
        items={items.done}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />
    </div>
  )
}
