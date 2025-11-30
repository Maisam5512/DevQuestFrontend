'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Plus } from 'lucide-react'

export default function ProjectsPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('devQuestUserToken')
        console.log('[v0] Token:', token ? 'exists' : 'missing')
        
        const response = await fetch('http://localhost:4000/api/project/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        })

        console.log('[v0] Response status:', response.status)
        
        if (!response.ok && response.status !== 304) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        let data = null
        if (response.status === 200 || response.status === 304) {
          data = await response.json()
          console.log('[v0] Fetched data:', data)
          console.log('[v0] Data structure:', Object.keys(data))
          
          // Handle both { projects: [...] } and direct array
          const projectsArray = Array.isArray(data) ? data : (data.projects || data.data || [])
          console.log('[v0] Projects array:', projectsArray)
          console.log('[v0] Projects count:', projectsArray.length)
          
          setProjects(projectsArray)
        }
      } catch (error) {
        console.error('[v0] Error fetching projects:', error)
        setError(error.message)
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return <div className="p-6 text-center text-slate-400">Loading projects...</div>
  }

  if (error) {
    return <div className="p-6 text-center text-red-400">Error: {error}</div>
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">My Projects</h1>
        {user?.role === 'client' && (
          <Link
            href="/dashboard/projects/create"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">New Project</span>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400">
            No projects found
          </div>
        ) : (
          projects.map(project => (
            <div key={project._id || project.id} className="card-glow p-4">
              <h3 className="font-semibold text-white mb-2">{project.title}</h3>
              <p className="text-sm text-slate-400 mb-4">{project.description}</p>
              <div className="text-xs text-slate-500">
                <p>Status: <span className="text-blue-400 capitalize">{project.status}</span></p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}



