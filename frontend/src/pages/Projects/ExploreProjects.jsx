import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import PageLoader from "../../components/PageLoader/PageLoader.jsx";
import "./projects.css";

const ExploreProjects = () => {
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Read params from URL
  const query = searchParams.get("q") || "";

  // Fetch unique domains on mount
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const { data } = await api.get("/api/projects/domains");
        setDomains(data);
      } catch (error) {
        console.error("Failed to fetch domains", error);
      }
    };
    fetchDomains();
  }, []);

  useEffect(() => {
    const handleSearch = async () => {
      setLoading(true);
      try {
        if (!query) {
          // Default Explore View: Projects only with optional domain filtering
          const url = selectedDomain ? `/api/projects?domain=${selectedDomain}` : "/api/projects";
          const { data } = await api.get(url);
          setProjects(data);
          setUsers([]);
        } else {
          // Combined Search View (Search might not support domain filter in same endpoint, but we keep it consistent)
          const { data } = await api.get(`/api/search?q=${query}`);
          let filteredProjects = data.projects || [];
          if (selectedDomain) {
            filteredProjects = filteredProjects.filter(p => p.domain === selectedDomain);
          }
          setProjects(filteredProjects);
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
  }, [query, selectedDomain]);

  return (
    <div className="container">
      <div className="explore-header-row">
        <h1 className="section-title explore-select-header">
          {query ? `Results for "${query}"` : "Explore Projects"}
        </h1>

        {!query && domains.length > 0 && (
          <div className="domain-filter-group">
            <label htmlFor="domain-select" className="domain-label">
              Filter by Domain:
            </label>
            <select
              id="domain-select"
              className="domain-select"
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
            >
              <option value="">All Domains</option>
              {domains.map((domain) => (
                <option key={domain} value={domain}>
                  {domain.charAt(0).toUpperCase() + domain.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

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
                    <div className="project-domain-container">
                      <span className="domain-tag">{item.domain}</span>
                    </div>
                    <div className="project-card-header">
                      <h3 className="project-title">{item.name}</h3>
                    </div>
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
