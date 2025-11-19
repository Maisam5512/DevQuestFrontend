'use client'

import { useState } from 'react'
import { Wand2 } from 'lucide-react'
import KanbanBoard from '@/components/kanban/kanban-board'

export default function KanbanPage() {
  const [tasks, setTasks] = useState({
    todo: [
      { id: 1, title: 'Design database schema', xp: 100, priority: 'high' },
      { id: 2, title: 'Setup CI/CD pipeline', xp: 150, priority: 'medium' },
    ],
    inProgress: [
      { id: 3, title: 'Implement authentication', xp: 200, priority: 'high' },
    ],
    review: [
      { id: 4, title: 'API integration tests', xp: 120, priority: 'low' },
    ],
    done: [
      { id: 5, title: 'Project kickoff meeting', xp: 50, priority: 'low' },
      { id: 6, title: 'Requirement documentation', xp: 80, priority: 'medium' },
    ],
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center gap-2 sm:gap-3">
          <Wand2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 shrink-0" />
          <span className="wrap-break-words">Quest Board</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">Drag tasks between columns to update their status</p>
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <KanbanBoard tasks={tasks} setTasks={setTasks} />
      </div>
    </div>
  )
}
