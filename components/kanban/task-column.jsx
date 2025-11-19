import { Zap } from 'lucide-react'

export default function TaskColumn({ title, columnKey, items, onDragStart, onDragOver, onDrop, isProject }) {
  return (
    <div
      className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 min-h-96 flex flex-col"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, columnKey)}
    >
      <h3 className="font-semibold text-white mb-4 flex items-center justify-between">
        {title}
        <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">
          {items.length}
        </span>
      </h3>

      <div className="flex-1 space-y-3">
        {items.map(item => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => onDragStart(e, item, columnKey)}
            className="bg-slate-800 border border-slate-700 rounded-lg p-4 cursor-move hover:border-blue-500/50 transition group"
          >
            <p className="text-sm font-medium text-white mb-2 group-hover:text-blue-400 transition">
              {item.title}
            </p>
            {item.description && (
              <p className="text-xs text-slate-400 mb-2 line-clamp-2">
                {item.description}
              </p>
            )}
            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold px-2 py-1 rounded capitalize ${
                item.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                item.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {item.priority}
              </span>
              <div className="flex items-center gap-1 text-xs font-semibold text-blue-500">
                <Zap className="w-3 h-3" />
                {item.xp}
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-center text-slate-500 text-sm py-8">No items yet</p>
        )}
      </div>
    </div>
  )
}
