// 'use client'

// import { useEffect, useState } from 'react'
// import Link from 'next/link'
// import { useAuth } from '@/hooks/useAuth'
// import { Plus } from 'lucide-react'

// export default function ProjectsPage() {
//   const { user } = useAuth()
//   const [projects, setProjects] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const token = localStorage.getItem('token')
//         console.log('[v0] Token:', token ? 'exists' : 'missing')
        
//         const response = await fetch('http://localhost:4000/api/project/all', {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Cache-Control': 'no-cache, no-store, must-revalidate',
//             'Pragma': 'no-cache'
//           }
//         })

//         console.log('[v0] Response status:', response.status)
        
//         if (!response.ok && response.status !== 304) {
//           throw new Error(`HTTP error! status: ${response.status}`)
//         }

//         let data = null
//         if (response.status === 200 || response.status === 304) {
//           data = await response.json()
//           console.log('[v0] Fetched data:', data)
//           console.log('[v0] Data structure:', Object.keys(data))
          
//           // Handle both { projects: [...] } and direct array
//           const projectsArray = Array.isArray(data) ? data : (data.projects || data.data || [])
//           console.log('[v0] Projects array:', projectsArray)
//           console.log('[v0] Projects count:', projectsArray.length)
          
//           setProjects(projectsArray)
//         }
//       } catch (error) {
//         console.error('[v0] Error fetching projects:', error)
//         setError(error.message)
//         setProjects([])
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchProjects()
//   }, [])

//   if (loading) {
//     return <div className="p-6 text-center text-slate-400">Loading projects...</div>
//   }

//   if (error) {
//     return <div className="p-6 text-center text-red-400">Error: {error}</div>
//   }

//   return (
//     <div className="p-4 sm:p-6 lg:p-8">
//       <div className="flex items-center justify-between mb-8">
//         <h1 className="text-2xl sm:text-3xl font-bold text-white">My Projects</h1>
//         {user?.role === 'client' && (
//           <Link
//             href="/dashboard/projects/create"
//             className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
//           >
//             <Plus className="w-5 h-5" />
//             <span className="hidden sm:inline">New Project</span>
//           </Link>
//         )}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {projects.length === 0 ? (
//           <div className="col-span-full text-center py-12 text-slate-400">
//             No projects found
//           </div>
//         ) : (
//           projects.map(project => (
//             <div key={project._id || project.id} className="card-glow p-4">
//               <h3 className="font-semibold text-white mb-2">{project.title}</h3>
//               <p className="text-sm text-slate-400 mb-4">{project.description}</p>
//               <div className="text-xs text-slate-500">
//                 <p>Status: <span className="text-blue-400 capitalize">{project.status}</span></p>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   )
// }








'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Plus, Edit, Trash2, MoreVertical } from 'lucide-react'

export default function ProjectsPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [activeMenu, setActiveMenu] = useState(null)

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

  const handleDelete = async (projectId, projectStatus) => {
    // Prevent deletion if project is accepted or beyond
    if (projectStatus !== 'assigned') {
      alert('Cannot delete project that has been accepted by a PM')
      return
    }

    if (!confirm('Are you sure you want to delete this project?')) {
      return
    }

    setDeletingId(projectId)
    setActiveMenu(null)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:4000/api/project/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete project')
      }

      // Remove project from state
      setProjects(prev => prev.filter(project => project._id !== projectId))
      
      // Show success message
      alert('Project deleted successfully!')
    } catch (error) {
      console.error('Error deleting project:', error)
      alert(error.message || 'Failed to delete project')
    } finally {
      setDeletingId(null)
    }
  }

  const toggleMenu = (projectId) => {
    setActiveMenu(activeMenu === projectId ? null : projectId)
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenu(null)
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
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
            <div key={project._id || project.id} className="card-glow p-4 relative">
              {/* Menu Button */}
              {user?.role === 'client' && (
                <div className="absolute top-3 right-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleMenu(project._id)
                    }}
                    className="p-1 hover:bg-slate-700 rounded transition"
                  >
                    <MoreVertical className="w-4 h-4 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {activeMenu === project._id && (
                    <div className="absolute right-0 top-8 mt-1 w-32 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-10">
                      <Link
                        href={`/dashboard/projects/edit/${project._id}`}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-slate-700 transition"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(project._id, project.status)
                        }}
                        disabled={deletingId === project._id || project.status !== 'assigned'}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        <Trash2 className="w-3 h-3" />
                        {deletingId === project._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              <h3 className="font-semibold text-white mb-2 pr-8">{project.title}</h3>
              <p className="text-sm text-slate-400 mb-4 line-clamp-2">{project.description}</p>
              
              <div className="text-xs text-slate-500 space-y-1">
                <p>Status: <span className="text-blue-400 capitalize">{project.status}</span></p>
                {project.deadline && (
                  <p>Deadline: <span className="text-slate-300">{new Date(project.deadline).toLocaleDateString()}</span></p>
                )}
                {project.projectXp > 0 && (
                  <p>XP Budget: <span className="text-green-400">{project.projectXp} XP</span></p>
                )}
                {project.tags && project.tags.length > 0 && (
                  <p>Tags: <span className="text-slate-300">{project.tags.join(', ')}</span></p>
                )}
              </div>

              {/* Delete warning for non-assigned projects */}
              {user?.role === 'client' && project.status !== 'assigned' && (
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



