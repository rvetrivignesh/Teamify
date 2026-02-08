import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import PageLoader from "../../components/PageLoader/PageLoader.jsx";
import "./projects.css";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joinMessage, setJoinMessage] = useState("");
  const [sendingRequest, setSendingRequest] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null); // 'success', 'error'

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await api.get(`/api/projects/${id}`);
        setProject(data);
      } catch (error) {
        console.error("Failed to load project", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleJoinRequest = async (e) => {
    e.preventDefault();
    setSendingRequest(true);
    try {
      await api.post(`/api/projects/${id}/join`, { message: joinMessage });
      setRequestStatus("success");
      setJoinMessage("");
    } catch (err) {
      setRequestStatus("error");
      alert(err.response?.data?.message || "Failed to send request");
    } finally {
      setSendingRequest(false);
    }
  };

  const handleRemoveCollaborator = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this collaborator?"))
      return;
    try {
      await api.delete(`/api/projects/${id}/collaborators/${userId}`);
      // Update local state
      setProject((prev) => ({
        ...prev,
        collaborators: prev.collaborators.filter((c) => c._id !== userId),
      }));
    } catch (error) {
      console.error(error);
      alert("Failed to remove collaborator");
    }
  };

  if (loading) return <PageLoader message="Loading Project..." />;
  if (!project)
    return (
      <div className="container projects-not-found">Project not found.</div>
    );

  const userId = user?._id || user?.id;

  const isOwner =
    userId &&
    project.owner &&
    (project.owner._id?.toString() === userId.toString() ||
      project.owner.toString() === userId.toString());

  const isCollaborator =
    userId &&
    project.collaborators.some(
      (c) => (c._id?.toString() || c?.toString()) === userId.toString(),
    );
  const canJoin = user && !isOwner && !isCollaborator;

  return (
    <div className="container">
      <button
        onClick={() => navigate(-1)}
        className="btn btn-secondary btn-sm project-back-button"
      >
        &larr; Back
      </button>

      <div className="card project-header-card">
        <div className="project-card-header">
          <h1 className="project-main-title">{project.name}</h1>
          <span className="domain-tag">{project.domain}</span>
        </div>
        <p className="project-description">{project.description}</p>

        {project.repositoryLink && (
          <div className="project-repo-link-group">
            <h4 className="project-repo-title">Repository</h4>
            <a
              href={project.repositoryLink.startsWith('http') ? project.repositoryLink : `https://${project.repositoryLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="project-repo-url"
            >
              {project.repositoryLink}
            </a>
          </div>
        )}

        <div className="project-skills-section">
          <h4 className="project-skills-title">Required Skills</h4>
          <div>
            {project.skillsRequired.map((skill) => (
              <span key={skill} className="tag">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="project-meta">
          <span>
            Owner: <b>{project.owner.username}</b>
          </span>
          <span>•</span>
          <span>
            Created: {new Date(project.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="project-grid">
        <div className="card">
          <h3 className="project-section-title">Tasks</h3>
          {project.tasks.length > 0 ? (
            <ul className="project-tasks-list">
              {project.tasks.map((task) => (
                <li
                  key={task._id}
                  className={`project-task-item ${task.status === "Completed" ? "completed" : ""}`}
                >
                  {task.title}{" "}
                  <span className="project-task-status">({task.status})</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="project-no-tasks">No tasks outlined yet.</p>
          )}
        </div>

        <div className="card">
          <h3 className="project-section-title">Collaborators</h3>
          {project.collaborators.length > 0 ? (
            <div className="project-collaborators-list">
              {project.collaborators.map((collab) => (
                <div key={collab._id} className="project-collaborator-item">
                  <div className="project-collaborator-info">
                    <div className="project-collaborator-avatar">
                      {collab.username[0].toUpperCase()}
                    </div>
                    <Link
                      to={`/profile/${collab._id}`}
                      className="project-collaborator-link"
                    >
                      {collab.username}
                    </Link>
                  </div>
                  {isOwner && (
                    <button
                      onClick={() => handleRemoveCollaborator(collab._id)}
                      className="btn btn-sm btn-danger project-remove-button"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="project-no-collaborators">No collaborators yet.</p>
          )}

          {canJoin && (
            <div className="project-join-section">
              <h4 className="project-join-title">Interested in joining?</h4>
              {requestStatus === "success" ? (
                <div className="project-join-success">
                  Request sent successfully!
                </div>
              ) : (
                <form onSubmit={handleJoinRequest}>
                  <textarea
                    className="input-field project-join-form-textarea"
                    rows="3"
                    placeholder="Tell the owner why you're a good fit..."
                    value={joinMessage}
                    onChange={(e) => setJoinMessage(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="btn btn-primary project-join-submit"
                    disabled={sendingRequest}
                  >
                    {sendingRequest ? "Sending..." : "Send Request"}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
