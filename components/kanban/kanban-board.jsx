'use client'

import { useState } from 'react'
import TaskColumn from './task-column'

export default function KanbanBoard({ tasks, setTasks }) {
  const [draggedTask, setDraggedTask] = useState(null)

  const handleDragStart = (e, task, fromColumn) => {
    setDraggedTask({ task, fromColumn })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, toColumn) => {
    e.preventDefault()
    if (!draggedTask) return

    const { task, fromColumn } = draggedTask

    if (fromColumn === toColumn) {
      setDraggedTask(null)
      return
    }

    setTasks(prev => ({
      ...prev,
      [fromColumn]: prev[fromColumn].filter(t => t.id !== task.id),
      [toColumn]: [...prev[toColumn], task],
    }))

    setDraggedTask(null)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <TaskColumn
        title="To Do"
        columnKey="todo"
        tasks={tasks.todo}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />
      <TaskColumn
        title="In Progress"
        columnKey="inProgress"
        tasks={tasks.inProgress}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />
      <TaskColumn
        title="In Review"
        columnKey="review"
        tasks={tasks.review}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />
      <TaskColumn
        title="Done"
        columnKey="done"
        tasks={tasks.done}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />
    </div>
  )
}
