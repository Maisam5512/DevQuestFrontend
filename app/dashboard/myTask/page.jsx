"use client"

import { useEffect, useState } from "react"
import { useTask } from "@/hooks/useTask"
import TaskCard from "@/components/cards/taskCard"
import userAPI from "@/hooks/userAPI";
const MyTaskPage = () => {
  const { tasks, loading, error, fetchTasksByDeveloper, updateTask,  } = useTask()
  const {getPmUsers} = userAPI()
  const [userId, setUserId] = useState(null)
  const [ PM , setPM] = useState([]);

  useEffect(() => {
    // Get user ID from token
    const token = localStorage.getItem("devQuestUserToken")
    if (token) {
      try {
        // Decode JWT token to get user ID
        const payload = JSON.parse(atob(token.split(".")[1]))
        const id = payload.userId || payload.id || payload._id
        setUserId(id)

        if (id) {
          fetchTasksByDeveloper(id)
        }
      } catch (err) {
        console.error("[v0] Error decoding token:", err)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(()=>{
    const fetchPM = async () =>{
        const result = await getPmUsers();
        if(result.success){
            setPM(result.data);
        }
    };
    fetchPM();
  },[getPmUsers])

  const handleAccept = async (taskId) => {
    try {
      await updateTask(taskId, { status: "accepted" })
    } catch (err) {
      console.error("[v0] Error accepting task:", err)
    }
  }

  const handleIgnore = async (taskId) => {
    try {
      await updateTask(taskId, { status: "ignore" })
    } catch (err) {
      console.error("[v0] Error ignoring task:", err)
    }
  }

  const getPmName = (pmId) => {
     console.log("The PMs are:", PM);
    const pm = PM.find((d) => d._id === pmId);
     console.log("The PMId:", pmId);
     console.log("The pm:", pm);
     console.log("the pm name is: ", pm?.name);
    return pm ? pm.name : "N/A";
  };


  // Filter out ignored tasks
const visibleTasks = tasks.filter((task) => {
  if (task.status === "ignore") return false;
  
  const assigned = task.assignedTo?._id || task.assignedTo;
  return assigned?.toString() === userId;
});

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading tasks...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-app-bg p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">My Tasks</h1>

        {visibleTasks.length === 0 ? (
          <div className="text-gray-400 text-center py-12">No tasks assigned to you yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleTasks.map((task) => (
              <TaskCard key={task._id} pm={getPmName(task.createdBy._id)} task={task} onAccept={handleAccept} onIgnore={handleIgnore} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyTaskPage
