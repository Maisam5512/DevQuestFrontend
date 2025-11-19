export default function StatCard({ icon: Icon, label, value, change }) {
  return (
    <div className="card-glow p-4 sm:p-5 lg:p-6">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex-1">
          <p className="text-slate-400 text-xs sm:text-sm font-medium">{label}</p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-1 wrap-break-word">{value}</p>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600/20 rounded-lg flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
        </div>
      </div>
      <p className="text-xs text-cyan-400">{change}</p>
    </div>
  )
}
