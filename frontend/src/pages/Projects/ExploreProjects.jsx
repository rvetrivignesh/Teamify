import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import PageLoader from "../../components/PageLoader/PageLoader.jsx";
import "./projects.css";

const ExploreProjects = () => {
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Read params from URL
  const query = searchParams.get("q") || "";

  useEffect(() => {
    const handleSearch = async () => {
      setLoading(true);
      try {
        if (!query) {
          // Default Explore View: Projects only
          const { data } = await api.get("/api/projects");
          setProjects(data);
          setUsers([]);
        } else {
          // Combined Search View
          const { data } = await api.get(`/api/search?q=${query}`);
          setProjects(data.projects || []);
          setUsers(data.users || []);
        }
      } catch (error) {
        console.error(error);
        setProjects([]);
        setUsers([]);
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    handleSearch();
  }, [query]);

  return (
    <div className="container">
      <h1 className="section-title">
        {query ? `Results for "${query}"` : "Explore Projects"}
      </h1>

      {loading ? (
        <PageLoader message="Searching..." />
      ) : (
        <>
          {/* Projects Section */}
          {projects.length > 0 && (
            <div className="explore-projects-section">
              <h2 className="explore-section-title">Projects</h2>
              <div className="grid-responsive">
                {projects.map((item) => (
                  <div key={item._id} className="card project-card">
                    <h3 className="project-title">{item.name}</h3>
                    <p className="project-desc">{item.description}</p>
                    <div className="tags">
                      {item.skillsRequired?.slice(0, 3).map((skill) => (
                        <span key={skill} className="tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="project-footer">
                      <div className="owner-info">
                        <span>by {item.owner?.username || "Unknown"}</span>
                      </div>
                      <div className="project-actions">
                        <Link
                          to={`/projects/${item._id}`}
                          className="btn btn-sm btn-secondary"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* People Section */}
          {users.length > 0 && (
            <div className="explore-projects-section">
              <h2 className="explore-section-title">People</h2>
              <div className="grid-responsive">
                {users.map((item) => (
                  <div key={item._id} className="card project-card people-card">
                    <div className="people-avatar">
                      {item.username[0].toUpperCase()}
                    </div>
                    <h3>{item.username}</h3>
                    <p className="people-email">{item.email}</p>
                    <Link
                      to={`/profile/${item.username}`}
                      className="btn btn-sm btn-secondary"
                    >
                      View Profile
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Data Found */}
          {!initialLoad && projects.length === 0 && users.length === 0 && (
            <p className="explore-empty-state">No data found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default ExploreProjects;
