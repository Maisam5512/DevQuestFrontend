"use client"

import { useState } from "react"

const TaskCard = ({ task, onAccept, onIgnore , pm }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatDate = (date) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "text-green-500"
      case "pending":
        return "text-yellow-500"
      case "completed":
        return "text-blue-500"
      default:
        return "text-gray-500"
    }
  }

  const shouldShowReadMore = task.description && task.description.length > 100

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-all">
      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-4 line-clamp-2">{task.title || "Untitled Task"}</h3>

      {/* Assigned By */}
      <div className="mb-2">
        <span className="text-gray-400 text-sm">Assigned by: </span>
        <span className="text-gray-200 text-sm">{pm || "Unknown"}</span>
      </div>

      {/* Assign Date */}
      <div className="mb-4">
        <span className="text-gray-400 text-sm">Assigned on: </span>
        <span className="text-gray-200 text-sm">{formatDate(task.assignedDate || task.createdAt)}</span>
      </div>

      {/* Description */}
      <div className="mb-4">
        <p className={`text-gray-300 text-sm ${!isExpanded && "line-clamp-2"}`}>
          {task.description || "No description provided"}
        </p>
        {shouldShowReadMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-400 hover:text-blue-300 text-sm mt-2 font-medium"
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {/* Status */}
      <div className="mb-6">
        <span className="text-gray-400 text-sm">Status: </span>
        <span className={`text-sm font-semibold ${getStatusColor(task.status)}`}>{task.status || "Pending"}</span>
      </div>

      {/* Action Buttons */}
      {task.status !== "accepted" && (
        <div className="flex gap-3">
          <button
            onClick={() => onAccept(task._id)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Accept
          </button>
          <button
            onClick={() => onIgnore(task._id)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Ignore
          </button>
        </div>
      )}
    </div>
  )
}

export default TaskCard
