export default function ProjectCard({ project }) {
  return (
    <div className="card-glow p-4 sm:p-5 lg:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-white mb-2 wrap-break-word">{project.title}</h3>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <span className="text-xs font-medium text-cyan-400 bg-cyan-400/20 px-2 py-1 rounded truncate">
          {project.status}
        </span>
        <span className="text-xs sm:text-sm font-semibold text-blue-500">{project.progress}%</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-2">
        <div
          className="bg-linear-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all"
          style={{ width: `${project.progress}%` }}
        />
      </div>
    </div>
  )
}
