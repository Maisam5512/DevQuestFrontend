'use client'

import { useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { GripVertical, Zap } from 'lucide-react'

const statuses = [
  { id: 'todo', label: 'To Do', color: 'bg-gray-600' },
  { id: 'inprogress', label: 'In Progress', color: 'bg-[#6A0DAD]' },
  { id: 'review', label: 'Review', color: 'bg-[#FFD700]' },
  { id: 'done', color: 'bg-[#03C988]', label: 'Done' }
]

export default function KanbanBoard({ tasks, onStatusChange }) {
  const [draggedTask, setDraggedTask] = useState(null)

  const handleDragStart = (e, task) => {
    setDraggedTask(task)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, status) => {
    e.preventDefault()
    if (draggedTask) {
      onStatusChange(draggedTask.id, status)
      setDraggedTask(null)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statuses.map((status) => (
        <div
          key={status.id}
          className="bg-[#2a1a4a] rounded-lg p-4 min-h-[500px] border border-[#6A0DAD]/30"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, status.id)}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-3 h-3 rounded-full ${status.color}`} />
            <h3 className="font-bold text-white">{status.label}</h3>
            <span className="ml-auto text-sm text-gray-400 bg-[#4B0082]/50 px-2 py-1 rounded">
              {tasks.filter(t => t.status === status.id).length}
            </span>
          </div>

          <div className="space-y-3">
            {tasks.filter(t => t.status === status.id).map((task) => (
              <Card
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task)}
                className="bg-[#4B0082]/50 border-[#6A0DAD]/50 cursor-move hover:border-[#FFD700]/50 transition"
              >
                <CardContent className="pt-4">
                  <div className="flex gap-2 mb-2">
                    <GripVertical className="w-4 h-4 text-gray-400 shrink-0" />
                    <h4 className="text-sm font-medium text-white flex-1">{task.title}</h4>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">{task.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-[#FFD700]/20 text-[#FFD700]">{task.priority}</Badge>
                    <span className="text-xs font-bold text-[#FFD700] flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {task.xpReward || 100}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
