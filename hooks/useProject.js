import { useState, useCallback } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const useProject = () => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Helper to make API calls
  const apiCall = useCallback(async (endpoint, method = 'GET', data = null) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const token = localStorage.getItem('devQuestUserToken');
      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const options = {
        method,
        headers,
      };

      if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // CREATE PROJECT
  const createProject = useCallback(async (projectData) => {
    try {
      const result = await apiCall('/project/create', 'POST', projectData);
      setCurrentProject(result.project);
      setSuccess(result.message);
      return result.project;
    } catch (err) {
      throw err;
    }
  }, [apiCall]);

  // ASSIGN PM
  const assignPM = useCallback(async (projectId, pmId) => {
    try {
      const result = await apiCall(
        `/project/${projectId}/assign-pm`,
        'PUT',
        { pmId }
      );
      setCurrentProject(result.project);
      setSuccess(result.message);
      return result.project;
    } catch (err) {
      throw err;
    }
  }, [apiCall]);

  // ACCEPT PROJECT
  const acceptProject = useCallback(async (projectId) => {
    try {
      const result = await apiCall(
        `/project/${projectId}/accept`,
        'PUT'
      );
      setCurrentProject(result.project);
      setSuccess(result.message);
      return result.project;
    } catch (err) {
      throw err;
    }
  }, [apiCall]);

  // START WORKING
  const startWorking = useCallback(async (projectId) => {
    try {
      const result = await apiCall(
        `/project/${projectId}/start`,
        'PUT'
      );
      setCurrentProject(result.project);
      setSuccess(result.message);
      return result.project;
    } catch (err) {
      throw err;
    }
  }, [apiCall]);

  // CANCEL PROJECT
  const cancelProject = useCallback(async (projectId) => {
    try {
      const result = await apiCall(
        `/project/${projectId}/cancel`,
        'PUT'
      );
      setCurrentProject(result.project);
      setSuccess(result.message);
      return result.project;
    } catch (err) {
      throw err;
    }
  }, [apiCall]);

  // COMPLETE PROJECT
  const completeProject = useCallback(async (projectId) => {
    try {
      const result = await apiCall(
        `/project/${projectId}/complete`,
        'PUT'
      );
      setCurrentProject(result.project);
      setSuccess(result.message);
      return result.project;
    } catch (err) {
      throw err;
    }
  }, [apiCall]);

  // GET ALL PROJECTS
  const getAllProjects = useCallback(async () => {
    try {
      const result = await apiCall('/project/all', 'GET');
      setProjects(result);
      return result;
    } catch (err) {
      throw err;
    }
  }, [apiCall]);

  // GET PROJECT BY ID
  const getProjectById = useCallback(async (projectId) => {
    try {
      const result = await apiCall(`/project/${projectId}`, 'GET');
      setCurrentProject(result);
      return result;
    } catch (err) {
      throw err;
    }
  }, [apiCall]);

  // GET PROJECTS BY USER
  const getProjectsByUser = useCallback(async () => {
    try {
      const result = await apiCall('/project/', 'GET');
     // console.log("this is the api call result", result);
      setProjects(result);
     // console.log("Theses are the logged in user's project" , projects);
      return result;
    } catch (err) {
      throw err;
    }
  }, [apiCall]);

  // CLEAR STATES
  const clearError = useCallback(() => setError(null), []);
  const clearSuccess = useCallback(() => setSuccess(null), []);
  const reset = useCallback(() => {
    setProjects([]);
    setCurrentProject(null);
    setError(null);
    setSuccess(null);
  }, []);

  return {
    // State
    projects,
    currentProject,
    loading,
    error,
    success,

    // Actions
    createProject,
    assignPM,
    acceptProject,
    startWorking,
    cancelProject,
    completeProject,
    getAllProjects,
    getProjectById,
    getProjectsByUser,

    // Utilities
    clearError,
    clearSuccess,
    reset,
  };
};

export default useProject;
