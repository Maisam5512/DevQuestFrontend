'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useUser } from '@/hooks/useUser'

export default function CreateProjectPage() {
  const router = useRouter()
  const { users, loading, error, getUsersByRole } = useUser()
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pm: '',
    deadline: '',
    tags: '',
    projectXp: 0,
  })

  const pms = getUsersByRole('pm')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error('Project title is required')
      return
    }

    if (!formData.pm) {
      toast.error('Please select a project manager')
      return
    }

    setSubmitting(true)

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        pm: formData.pm,
        deadline: formData.deadline || null,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        projectXp: parseInt(formData.projectXp) || 0,
      }

      const response = await fetch('http://localhost:4000/api/project/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('devQuestUserToken')}`
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create project')
      }

      toast.success('Project created successfully!')
      router.push('/dashboard/projects')
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error(error.message || 'Failed to create project')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Create New Project</h1>
      <p className="text-slate-400 mb-8">Post your project and assign it to an available project manager</p>

      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-300 text-sm">
          Failed to load project managers: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 card-glow p-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Project Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter project title"
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your project"
            rows={4}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Project Manager *
          </label>
          <select
            name="pm"
            value={formData.pm}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">
              {loading ? 'Loading managers...' : pms.length > 0 ? 'Select a project manager' : 'No PMs available'}
            </option>
            {pms.map(pm => (
              <option key={pm._id} value={pm._id}>
                {pm.name} - {pm.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Deadline
          </label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Tags
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., frontend, backend, urgent"
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Project XP Budget
          </label>
          <input
            type="number"
            name="projectXp"
            value={formData.projectXp}
            onChange={handleChange}
            placeholder="Enter XP budget"
            min="0"
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-4 py-2 border border-slate-700 rounded-lg text-white hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || loading}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition"
          >
            {submitting ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  )
}
