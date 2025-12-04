'use client'

import { useState, useEffect } from 'react'
import { Wand2 } from 'lucide-react'
import KanbanBoard from '@/components/kanban/kanban-board'
import { useAuth } from '@/hooks/useAuth'

export default function KanbanPage() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')

        if (user?.role === 'client') {
          const response = await fetch('http://localhost:4000/api/project/all', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache',
            },
          })
          
          if (!response.ok) throw new Error('Failed to fetch projects')
          const result = await response.json()
          
          // Group projects by status
          const grouped = {
            assigned: [],
            accepted: [],
            working: [],
            completed: [],
            cancelled: [],
          }
          
          result.projects?.forEach(project => {
            const status = project.status || 'assigned'
            if (grouped[status]) {
              grouped[status].push({
                id: project._id,
                title: project.title,
                description: project.description,
                xp: project.projectXp || 0,
                priority: project.tags?.includes('urgent') ? 'high' : 'medium',
                status: status,
              })
            }
          })
          
          setData({ type: 'projects', data: grouped })
        } else if (user?.role === 'pm') {
          const response = await fetch('http://localhost:4000/api/task/project/all', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache',
            },
          })
          
          if (!response.ok) throw new Error('Failed to fetch tasks')
          const result = await response.json()
          
          // Group tasks by status
          const grouped = {
            todo: [],
            in_progress: [],
            review: [],
            done: [],
          }
          
          result.tasks?.forEach(task => {
            const status = task.status || 'todo'
            const mappedStatus = status === 'in_progress' ? 'in_progress' : status
            if (grouped[mappedStatus]) {
              grouped[mappedStatus].push({
                id: task._id,
                title: task.title,
                description: task.description,
                xp: task.xp || 0,
                priority: task.priority || 'medium',
                status: mappedStatus,
              })
            }
          })
          
          setData({ type: 'tasks', data: grouped })
        } else if (user?.role === 'developer') {
          const response = await fetch('http://localhost:4000/api/task/assigned', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache',
            },
          })
          
          if (!response.ok) throw new Error('Failed to fetch assigned tasks')
          const result = await response.json()
          
          // Group tasks by status
          const grouped = {
            todo: [],
            in_progress: [],
            review: [],
            done: [],
          }
          
          result.tasks?.forEach(task => {
            const status = task.status || 'todo'
            const mappedStatus = status === 'in_progress' ? 'in_progress' : status
            if (grouped[mappedStatus]) {
              grouped[mappedStatus].push({
                id: task._id,
                title: task.title,
                description: task.description,
                xp: task.xp || 0,
                priority: task.priority || 'medium',
                status: mappedStatus,
              })
            }
          })
          
          setData({ type: 'tasks', data: grouped })
        }
      } catch (err) {
        console.error('Kanban fetch error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center gap-2 sm:gap-3">
          <Wand2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 shrink-0" />
          <span className="word-break-wrap">
            {user?.role === 'client' ? 'Project Board' : 'Quest Board'}
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          {user?.role === 'client' 
            ? 'Track your projects from assignment to completion'
            : user?.role === 'pm'
            ? 'Manage tasks and team progress'
            : 'Complete your assigned quests and earn XP'}
        </p>
      </div>

      {loading && <p className="text-slate-400">Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      
      {data && (
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <KanbanBoard data={data} userRole={user?.role} />
        </div>
      )}
    </div>
  )
}



