'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useUser } from '@/hooks/useUser'
import { Plus, Edit, Trash2, MoreVertical, UserPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ProjectsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { getUsersByRole } = useUser()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [assigningId, setAssigningId] = useState(null)
  const [activeMenu, setActiveMenu] = useState(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedPM, setSelectedPM] = useState('')
  const menuRef = useRef(null)

  // Get PMs from useUser hook
  const pms = getUsersByRole('pm')

  useEffect(() => {
    fetchProjects()
  }, [])

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('devQuestUserToken')
      if (!token) {
        throw new Error('No authentication token found')
      }
      
      const response = await fetch('http://localhost:4000/api/project/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const projectsArray = Array.isArray(data) ? data : (data.projects || data.data || [])
      setProjects(projectsArray)
    } catch (error) {
      console.error('Error fetching projects:', error)
      setError(error.message)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (projectId, projectStatus) => {
    // Only allow deletion for assigned or cancelled projects
    if (projectStatus !== 'assigned' && projectStatus !== 'cancelled') {
      alert('Cannot delete project that has been accepted by a PM')
      return
    }

    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return
    }

    setDeletingId(projectId)
    setActiveMenu(null)

    try {
      const token = localStorage.getItem('devQuestUserToken')
      if (!token) {
        throw new Error('No authentication token found')
      }
      
      const response = await fetch(`http://localhost:4000/api/project/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Failed to delete project (${response.status})`)
      }

      // Remove project from state
      setProjects(prev => prev.filter(project => project._id !== projectId))
      
      // Show success message
      alert('Project deleted successfully!')
    } catch (error) {
      console.error('Error deleting project:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setDeletingId(null)
    }
  }

  const handleAssignPM = async (projectId) => {
    if (!selectedPM) {
      alert('Please select a Project Manager')
      return
    }

    setAssigningId(projectId)

    try {
      const token = localStorage.getItem('devQuestUserToken')
      if (!token) {
        throw new Error('No authentication token found')
      }
      
      const response = await fetch(`http://localhost:4000/api/project/${projectId}/assign-pm`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pmId: selectedPM })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to assign PM')
      }

      const result = await response.json()

      // Update project in state
      setProjects(prev => prev.map(project => {
        if (project._id === projectId) {
          // Find the selected PM to get their name
          const selectedPMData = pms.find(pm => pm._id === selectedPM)
          return { 
            ...project, 
            pm: selectedPM,
            pmName: selectedPMData?.name || selectedPMData?.username || 'Unknown PM',
            status: 'assigned' 
          }
        }
        return project
      }))

      setShowAssignModal(false)
      setSelectedPM('')
      setAssigningId(null)
      alert('PM assigned successfully!')
    } catch (error) {
      console.error('Error assigning PM:', error)
      alert(`Error: ${error.message}`)
      setAssigningId(null)
    }
  }

  const toggleMenu = (projectId, e) => {
    if (e) {
      e.stopPropagation()
      e.preventDefault()
    }
    setActiveMenu(activeMenu === projectId ? null : projectId)
  }

  const canEditProject = (project) => {
    // Client can edit if project is assigned or cancelled
    if (user?.role === 'client') {
      return project.status === 'assigned' || project.status === 'cancelled'
    }
    return false
  }

  const canDeleteProject = (project) => {
    // Client can delete if project is assigned or cancelled
    if (user?.role === 'client') {
      return project.status === 'assigned' || project.status === 'cancelled'
    }
    return false
  }

  const canAssignPM = (project) => {
    // Client can assign PM if project is assigned or cancelled
    if (user?.role === 'client') {
      return project.status === 'assigned' || project.status === 'cancelled'
    }
    return false
  }

  if (loading) {
    return <div className="p-6 text-center text-slate-400">Loading projects...</div>
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-400 mb-4">Error: {error}</div>
        <button 
          onClick={fetchProjects}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Assign PM Modal */}
      {showAssignModal && assigningId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-white mb-4">
              Assign Project Manager
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-2">
                Select Project Manager
              </label>
              <select
                value={selectedPM}
                onChange={(e) => setSelectedPM(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
              >
                <option value="">Select a PM...</option>
                {pms.map(pm => (
                  <option key={pm._id} value={pm._id}>
                    {pm.name} - {pm.email}
                  </option>
                ))}
              </select>
              {pms.length === 0 && (
                <p className="mt-2 text-sm text-yellow-400">
                  No project managers available. Please check if PMs are registered in the system.
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAssignModal(false)
                  setSelectedPM('')
                  setAssigningId(null)
                }}
                className="flex-1 px-4 py-2 border border-slate-600 rounded-lg text-white hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAssignPM(assigningId)}
                disabled={!selectedPM || assigningId === null}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition"
              >
                {assigningId ? 'Assigning...' : 'Assign PM'}
              </button>
            </div>
          </div>
        </div>
      )}

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
            No projects found. Create your first project!
          </div>
        ) : (
          projects.map(project => (
            <div key={project._id || project.id} className="card-glow p-4 relative">
              {/* Menu Button - Only for client */}
              {user?.role === 'client' && (
                <div ref={menuRef} className="absolute top-3 right-3 z-20">
                  <button
                    onClick={(e) => toggleMenu(project._id, e)}
                    className="p-1 hover:bg-slate-700 rounded transition"
                    aria-label="Project options"
                  >
                    <MoreVertical className="w-4 h-4 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {activeMenu === project._id && (
                    <div 
                      className="absolute right-0 top-8 mt-1 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-30"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Assign PM Option - Only for assigned/cancelled projects */}
                      {canAssignPM(project) && (
                        <button
                          onClick={() => {
                            setAssigningId(project._id)
                            setShowAssignModal(true)
                            setActiveMenu(null)
                          }}
                          className="flex items-center gap-2 w-full px-4 py-3 text-sm text-white hover:bg-slate-700 transition border-b border-slate-700"
                        >
                          <UserPlus className="w-4 h-4" />
                          Assign/Change PM
                        </button>
                      )}

                      {/* Edit Option - Only for assigned/cancelled projects */}
                      {canEditProject(project) && (
                        <Link
                          href={`/dashboard/projects/edit/${project._id}`}
                          className="flex items-center gap-2 w-full px-4 py-3 text-sm text-white hover:bg-slate-700 transition border-b border-slate-700"
                          onClick={() => setActiveMenu(null)}
                        >
                          <Edit className="w-4 h-4" />
                          Edit Project
                        </Link>
                      )}

                      {/* Delete Option - Only for assigned/cancelled projects */}
                      {canDeleteProject(project) && (
                        <button
                          onClick={() => {
                            handleDelete(project._id, project.status)
                          }}
                          disabled={deletingId === project._id}
                          className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-400 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          <Trash2 className="w-4 h-4" />
                          {deletingId === project._id ? 'Deleting...' : 'Delete Project'}
                        </button>
                      )}

                      {/* Show disabled options if not allowed */}
                      {!canEditProject(project) && !canDeleteProject(project) && !canAssignPM(project) && (
                        <div className="px-4 py-3 text-sm text-slate-400 italic">
                          Project cannot be modified
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <h3 className="font-semibold text-white mb-2 pr-8">{project.title}</h3>
              <p className="text-sm text-slate-400 mb-4 line-clamp-2">{project.description}</p>
              
              <div className="text-xs text-slate-500 space-y-1">
                <p>Status: <span className={`capitalize ${
                  project.status === 'completed' ? 'text-green-400' :
                  project.status === 'working' ? 'text-blue-400' :
                  project.status === 'accepted' ? 'text-yellow-400' :
                  project.status === 'cancelled' ? 'text-red-400' :
                  'text-slate-300'
                }`}>{project.status}</span></p>
                
                {project.deadline && (
                  <p>Deadline: <span className="text-slate-300">{new Date(project.deadline).toLocaleDateString()}</span></p>
                )}
                
                {project.projectXp > 0 && (
                  <p>XP Budget: <span className="text-green-400">{project.projectXp} XP</span></p>
                )}
                
                {project.tags && project.tags.length > 0 && (
                  <p>Tags: <span className="text-slate-300">{project.tags.join(', ')}</span></p>
                )}
                
                {project.pmName && (
                  <p>PM: <span className="text-slate-300">{project.pmName}</span></p>
                )}
              </div>

              {/* Warning for non-deletable projects */}
              {user?.role === 'client' && project.status !== 'assigned' && project.status !== 'cancelled' && (
                <div className="mt-3 p-2 bg-yellow-900/20 border border-yellow-700 rounded text-xs text-yellow-300">
                  Cannot delete project that has been accepted
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}



