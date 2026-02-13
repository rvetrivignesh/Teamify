import { Link } from "react-router-dom";

const ProjectSection = ({
  title,
  projects,
  emptyMessage,
  emptyLinkTo,
  emptyLinkText,
  user,
  showOwnerInfo,
}) => {
  return (
    <div className="section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <p>{emptyMessage}</p>
          <Link to={emptyLinkTo} className="link-accent no-underline">
            {emptyLinkText}
          </Link>
        </div>
      ) : (
        <div className="grid-responsive">
          {projects.map((project) => (
            <div key={project._id} className="card project-card">
              <div className="project-domain-container">
                <span className="domain-tag">{project.domain}</span>
              </div>
              <div className="project-card-header">
                <h3 className="project-title">{project.name}</h3>
              </div>
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
                    {showOwnerInfo === "collaborator" ? (
                      (project.owner?._id || project.owner) ===
                        (user?._id || user?.id) ? (
                        "Owner"
                      ) : (
                        "Collaborator"
                      )
                    ) : (
                      <>by {project.owner?.username || "Unknown"}</>
                    )}
                  </span>
                </div>
                <div className="project-actions">
                  <Link
                    to={`/projects/${project._id}`}
                    className="btn btn-sm btn-secondary"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectSection;
