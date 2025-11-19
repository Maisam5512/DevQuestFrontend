'use client';

import { useState, useEffect } from 'react';
import { useTask } from '@/hooks/useTask';
import useAuth from '@/hooks/userAPI.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

export default function TasksPage() {
  const { tasks, loading, error, createTask, fetchTasks, updateTask, deleteTask } = useTask();
  const { getDeveloperUsers } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    xp: '',
    deadline: '',
    assignedTo: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [developers, setDevelopers] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    const loadDevelopers = async () => {
      try {
        const result = await getDeveloperUsers();
        if (result.success) {
          setDevelopers(result.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch developers:', err);
      }
    };
    loadDevelopers();
  }, [getDeveloperUsers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePriorityChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      priority: value,
    }));
  };

  const handleAssignDeveloperChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      assignedTo: value,
    }));
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task._id);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority || 'medium',
      xp: task.xp || '',
      deadline: task.deadline ? task.deadline.split('T')[0] : '',
      assignedTo: task.assignedTo || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      xp: '',
      deadline: '',
      assignedTo: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    if (!formData.xp || isNaN(Number(formData.xp))) {
      toast.error('Valid XP value is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const taskPayload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        xp: Number(formData.xp),
        deadline: formData.deadline || undefined,
        ...(formData.assignedTo && { assignedTo: formData.assignedTo }),
      };

      if (editingTaskId) {
        await updateTask(editingTaskId, taskPayload);
        toast.success('Task updated successfully');
        handleCancelEdit();
      } else {
        await createTask(taskPayload);
        toast.success('Task created successfully');
        setFormData({
          title: '',
          description: '',
          priority: 'medium',
          xp: '',
          deadline: '',
          assignedTo: '',
        });
      }
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        toast.success('Task deleted successfully');
      } catch (err) {
        toast.error(err.message || 'Failed to delete task');
      }
    }
  };

  const sortedTasks = [...tasks].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned':
        return 'bg-blue-900 text-blue-100';
      case 'accepted':
        return 'bg-purple-900 text-purple-100';
      case 'in_progress':
        return 'bg-yellow-900 text-yellow-100';
      case 'review':
        return 'bg-orange-900 text-orange-100';
      case 'done':
        return 'bg-green-900 text-green-100';
      default:
        return 'bg-gray-700 text-gray-100';
    }
  };

  const getDeveloperName = (developerId) => {
    const developer = developers.find((d) => d._id === developerId);
    return developer ? developer.name : 'Unassigned';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster theme="dark" />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-white">Task Management</h1>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* LEFT SIDE: CREATE/EDIT TASK FORM */}
          <div>
            <Card className="bg-gray-900 border-gray-800">
              <div className="p-6">
                <h2 className="mb-6 text-xl font-semibold text-white">
                  {editingTaskId ? 'Edit Task' : 'Create New Task'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Title Field */}
                  <div>
                    <Label htmlFor="title" className="text-gray-200">
                      Task Title *
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter task title"
                      className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Description Field */}
                  <div>
                    <Label htmlFor="description" className="text-gray-200">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter task description (optional)"
                      className="mt-1 min-h-24 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Priority Field */}
                  <div>
                    <Label htmlFor="priority" className="text-gray-200">
                      Priority
                    </Label>
                    <Select
                      value={formData.priority}
                      onValueChange={handlePriorityChange}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="mt-1 bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="low" className="text-white hover:bg-gray-700">
                          Low
                        </SelectItem>
                        <SelectItem value="medium" className="text-white hover:bg-gray-700">
                          Medium
                        </SelectItem>
                        <SelectItem value="high" className="text-white hover:bg-gray-700">
                          High
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* XP Field */}
                  <div>
                    <Label htmlFor="xp" className="text-gray-200">
                      XP Points *
                    </Label>
                    <Input
                      id="xp"
                      name="xp"
                      type="number"
                      value={formData.xp}
                      onChange={handleInputChange}
                      placeholder="Enter XP value"
                      className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      disabled={isSubmitting}
                      min="1"
                    />
                  </div>

                  {/* Deadline Field */}
                  <div>
                    <Label htmlFor="deadline" className="text-gray-200">
                      Deadline
                    </Label>
                    <Input
                      id="deadline"
                      name="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      className="mt-1 bg-gray-800 border-gray-700 text-white"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="assignedTo" className="text-gray-200">
                      Assign Developer
                    </Label>
                    <Select
                      value={formData.assignedTo}
                      onValueChange={handleAssignDeveloperChange}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="mt-1 bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select a developer (optional)" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {developers.map((dev) => (
                          <SelectItem
                            key={dev._id}
                            value={dev._id}
                            className="text-white hover:bg-gray-700"
                          >
                            {dev.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      type="submit"
                      className="flex-1 bg-white text-black hover:bg-gray-200"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? editingTaskId
                          ? 'Updating...'
                          : 'Creating...'
                        : editingTaskId
                        ? 'Update Task'
                        : 'Create Task'}
                    </Button>
                    {editingTaskId && (
                      <Button
                        type="button"
                        className="flex-1 bg-gray-700 text-white hover:bg-gray-600"
                        onClick={handleCancelEdit}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            </Card>
          </div>

          {/* RIGHT SIDE: TASK LIST */}
          <div>
            <Card className="bg-gray-900 border-gray-800">
              <div className="p-6">
                <h2 className="mb-6 text-xl font-semibold text-white">
                  Tasks ({sortedTasks.length})
                </h2>

                {error && (
                  <div className="mb-4 rounded-lg bg-red-900 p-4 text-red-100">
                    <p>{error}</p>
                  </div>
                )}

                {loading && (
                  <div className="flex justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-white"></div>
                  </div>
                )}

                {!loading && sortedTasks.length === 0 && !error && (
                  <div className="py-12 text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="rounded-full bg-gray-800 p-3">
                        <svg className="h-8 w-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-lg font-medium text-gray-300">No tasks available</p>
                    <p className="mt-1 text-sm text-gray-500">Create a new task to get started</p>
                  </div>
                )}

                {!loading && sortedTasks.length > 0 && (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {sortedTasks.map((task) => (
                      <div
                        key={task._id}
                        className="rounded-lg border border-gray-700 bg-gray-800 p-4 hover:bg-gray-750 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white truncate">
                              {task.title}
                            </h3>

                            <div className="mt-2 flex flex-wrap items-center gap-3">
                              <span className="text-sm text-gray-400">
                                {formatDate(task.createdAt)}
                              </span>

                              <span
                                className={`text-xs px-2 py-1 rounded font-medium ${getStatusColor(
                                  task.status
                                )}`}
                              >
                                {task.status}
                              </span>

                              {task.xp && (
                                <span className="text-xs px-2 py-1 rounded bg-indigo-900 text-indigo-100 font-medium">
                                  {task.xp} XP
                                </span>
                              )}

                              {task.assignedTo && (
                                <span className="text-xs px-2 py-1 rounded bg-cyan-900 text-cyan-100 font-medium">
                                  {getDeveloperName(task.assignedTo)}
                                </span>
                              )}
                            </div>

                            {task.description && (
                              <p className="mt-2 text-sm text-gray-300 line-clamp-2">
                                {task.description}
                              </p>
                            )}
                          </div>

                          <div className="flex gap-2 flex-shrink-0">
                            <Button
                              size="sm"
                              className="bg-blue-600 text-white hover:bg-blue-700"
                              onClick={() => handleEditTask(task)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              className="bg-red-600 text-white hover:bg-red-700"
                              onClick={() => handleDeleteTask(task._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
