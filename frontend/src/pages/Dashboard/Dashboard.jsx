import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./Dashboard.css";

const Dashboard = ({ user }) => {
  const [myProjects, setMyProjects] = useState([]);
  const [recommendedProjects, setRecommendedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [myRes, recRes] = await Promise.all([
          api.get("/api/projects/my-projects"),
          api.get("/api/projects/recommended"),
        ]);
        setMyProjects(myRes.data);
        setRecommendedProjects(recRes.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container loading-center">
        <div className="loading">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.username}!</h1>
          <p className="text-muted">Ready to collaborate?</p>
        </div>
        <div className="action-buttons">
          <Link to="/explore" className="btn explore-btn">
            Explore Projects
          </Link>
          <Link to="/projects/create" className="btn btn-primary">
            + New Project
          </Link>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Your Projects</h2>
        </div>

        {myProjects.length === 0 ? (
          <div className="empty-state">
            <p>You haven't joined or created any projects yet.</p>
            <Link to="/projects/create" className="link-accent no-underline">
              Create one now
            </Link>
          </div>
        ) : (
          <div className="grid-responsive">
            {myProjects.map((project) => (
              <div key={project._id} className="card project-card">
                <h3>{project.name}</h3>
                <p className="project-desc">{project.description}</p>
                <div className="tags">
                  {project.skillsRequired.slice(0, 3).map((skill) => (
                    <span key={skill} className="tag">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="project-footer">
                  <div className="owner-info">
                    <span>
                      {project.owner._id === user._id
                        ? "Owner"
                        : "Collaborator"}
                    </span>
                  </div>
                  <Link
                    to={`/projects/${project._id}`}
                    className="btn btn-sm btn-secondary"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="section mt-48">
        <div className="section-header">
          <h2 className="section-title">Recommended For You:</h2>
        </div>

        {recommendedProjects.length === 0 ? (
          <div className="empty-state">
            <p>No recommendations found based on your skills.</p>
            <Link to="/setup-profile" style={{ color: "var(--accent-color)" }}>
              Update your skills
            </Link>
          </div>
        ) : (
          <div className="grid-responsive">
            {recommendedProjects.map((project) => (
              <div key={project._id} className="card project-card">
                <h3>{project.name}</h3>
                <p className="project-desc">{project.description}</p>
                <div className="tags">
                  {project.skillsRequired.slice(0, 3).map((skill) => (
                    <span key={skill} className="tag">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="project-footer">
                  <div className="owner-info">
                    <span>by {project.owner.username}</span>
                  </div>
                  <Link
                    to={`/projects/${project._id}`}
                    className="btn btn-sm btn-secondary"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
