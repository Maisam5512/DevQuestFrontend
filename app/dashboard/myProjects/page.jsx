"use client";

import { useEffect, useState } from "react";
import useProject from "@/hooks/useProject";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import userAPI from "@/hooks/userAPI";
const MyProjectPage = () => {
  const {
    projects,
    loading,
    error,
    getProjectsByUser,
    acceptProject,
    cancelProject,
  } = useProject();
  const [actionLoading, setActionLoading] = useState(null);
  const [clients, setClients] = useState([]);
  const { getClientUsers } = userAPI();
  useEffect(() => {
    getProjectsByUser();
  }, []);
  useEffect(() => {
    const fetchClients = async () => {
      const result = await getClientUsers();
      //console.log("the client users are:", result);

      if (result.success) {
        setClients(result.data);
      }
    };

    fetchClients();
  }, [getClientUsers]);

  const handleAccept = async (projectId) => {
    try {
      setActionLoading(projectId);
      await acceptProject(projectId);
      // Refresh the projects list
      await getProjectsByUser();
    } catch (err) {
      console.error("[v0] Error accepting project:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleIgnore = async (projectId) => {
    try {
      setActionLoading(projectId);
      await cancelProject(projectId);
      // Refresh the projects list
      await getProjectsByUser();
    } catch (err) {
      console.error("[v0] Error ignoring project:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading && projects.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-lg">Loading projects...</p>
      </div>
    );
  }

  const getClientName = (clientId) => {
    // console.log("The clients are:", clients);
    const client = clients.find((d) => d._id === clientId);
    // console.log("The clientId:", clientId);
    // console.log("The client:", client);
    // console.log("the client name is: ", client?.name);
    return client ? client.name : "N/A";
  };

  const visibleProjects = projects.filter(
    (project) => project.status !== "cancelled"
  );

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-white text-3xl font-bold mb-8">My Projects</h1>

        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-400 p-4 rounded-lg mb-6">
            Error: {error}
          </div>
        )}

        {visibleProjects.length === 0 ? (
          <p className="text-gray-400 text-center py-12">No projects found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProjects.map((project) => (
              <Card
                key={project._id || project.id}
                className="bg-gray-900 border-gray-800"
              >
                <CardHeader>
                  <CardTitle className="text-white">
                    {project.title || project.name || "Untitled Project"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Client:</span>
                      <span className="text-white">
                        {getClientName(project.client)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date Assigned:</span>
                      <span className="text-white">
                        {formatDate(project.dateAssigned || project.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-white capitalize">
                        {project.status || "Pending"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={() => handleIgnore(project._id || project.id)}
                      disabled={actionLoading === (project._id || project.id)}
                      variant="outline"
                      className="flex-1 border-gray-700 text-black hover:bg-gray-800 hover:text-white"
                    >
                      {actionLoading === (project._id || project.id)
                        ? "Processing..."
                        : "Ignore"}
                    </Button>
                    <Button
                      onClick={() => handleAccept(project._id || project.id)}
                      disabled={actionLoading === (project._id || project.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      {actionLoading === (project._id || project.id)
                        ? "Processing..."
                        : "Accept"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjectPage;
