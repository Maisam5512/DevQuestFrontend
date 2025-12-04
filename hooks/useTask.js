import { useState, useEffect, useCallback } from "react";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:4000/api";

export const useTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("devQuestUserToken");

  const parseResponse = async (response) => {
    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      throw new Error(
        `Expected JSON but received HTML/text. Status: ${
          response.status
        }. Response: ${text.substring(0, 100)}`
      );
    }

    return response.json();
  };

  // ===========================
  // FETCH ALL TASKS
  // ===========================
  const fetchTasks = useCallback(async () => {
    if (!token) {
      setError("Not authenticated");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await parseResponse(response);

      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      setTasks(data.tasks || data || []);
    } catch (err) {
      console.error("[v0] fetchTasks error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ===========================
  // CREATE TASK
  // ===========================
  const createTask = useCallback(
    async (taskData) => {
      if (!token) {
        setError("Not authenticated");
        return;
      }
      console.log("this is the data that has come to submit", taskData);
      try {
        const response = await fetch(`${API_BASE_URL}/tasks/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(taskData),
        });

        const data = await parseResponse(response);

        if (!response.ok) {
          throw new Error(data.message || `Server error: ${response.status}`);
        }

        setTasks((prev) => [...prev, data.task]);
        return { success: true, data: data.task };
      } catch (err) {
        console.error("[v0] createTask error:", err);
        setError(err.message);
        throw err;
      }
    },
    [token]
  );

  // ===========================
  // UPDATE TASK
  // ===========================
  const updateTask = useCallback(
    async (taskId, taskData) => {
      if (!token) {
        setError("Not authenticated");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/tasks/edit/${taskId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(taskData),
        });

        const data = await parseResponse(response);

        if (!response.ok) {
          throw new Error(data.message || `Server error: ${response.status}`);
        }

        setTasks((prev) =>
          prev.map((task) => (task._id === taskId ? data.task : task))
        );
        return { success: true, data: data.task };
      } catch (err) {
        console.error("[v0] updateTask error:", err);
        setError(err.message);
        throw err;
      }
    },
    [token]
  );

  // ===========================
  // DELETE TASK
  // ===========================
  const deleteTask = useCallback(
    async (taskId) => {
      if (!token) {
        setError("Not authenticated");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await parseResponse(response);

        if (!response.ok) {
          throw new Error(data.message || `Server error: ${response.status}`);
        }

        setTasks((prev) => prev.filter((task) => task._id !== taskId));
        return { success: true };
      } catch (err) {
        console.error("[v0] deleteTask error:", err);
        setError(err.message);
        throw err;
      }
    },
    [token]
  );

  // ===========================
  // GET TASKS BY PROJECT MANAGER
  // ===========================
  const fetchTasksByPM = useCallback(
    async (pmId) => {
      if (!token) {
        setError("Not authenticated");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/tasks/pm/${pmId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await parseResponse(response);

        if (!response.ok) {
          throw new Error(data.message || `Server error: ${response.status}`);
        }

        setTasks(data.tasks || []);
        return { success: true, data: data.tasks };
      } catch (err) {
        console.error("[v0] fetchTasksByPM error:", err);
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // ===========================
  // GET TASKS BY DEVELOPER
  // ===========================
  const fetchTasksByDeveloper = useCallback(
    async (devId) => {
      if (!token) {
        setError("Not authenticated");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/tasks/dev/${devId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await parseResponse(response);

        if (!response.ok) {
          throw new Error(data.message || `Server error: ${response.status}`);
        }

        setTasks(data.tasks || []);
        return { success: true, data: data.tasks };
      } catch (err) {
        console.error("[v0] fetchTasksByDeveloper error:", err);
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token, fetchTasks]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    fetchTasksByPM,
    fetchTasksByDeveloper
  };
};






















