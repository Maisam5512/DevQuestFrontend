'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { ChevronRight, Users, Calendar } from 'lucide-react'

export default function ProjectList({ projects, userRole }) {
  if (projects.length === 0) {
    return (
      <Card className="bg-[#4B0082]/30 border-[#6A0DAD]/50 border-dashed">
        <CardContent className="pt-12 pb-12 text-center">
          <p className="text-gray-400 mb-4">No projects yet</p>
          {userRole !== 'developer' && (
            <Link href="/projects/new">
              <Button className="bg-[#FFD700] hover:bg-[#FFA500] text-black font-bold">
                Create First Project
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {projects.map((project) => (
        <Card key={project.id} className="bg-[#4B0082]/30 border-[#6A0DAD]/50 hover:border-[#FFD700]/50 transition-all hover:glow-purple">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{project.description}</p>
                <div className="flex gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Due: {new Date(project.deadline).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {project.tasksCount || 0} tasks
                  </span>
                </div>
              </div>
              <Link href={`/projects/${project.id}`}>
                <Button className="bg-[#6A0DAD] hover:bg-[#5A0D9D] text-white">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
