import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import PageLoader from "../../components/PageLoader/PageLoader.jsx";
import "./Profile.css";

const UserProfile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/api/profile/u/${username}`);
        setProfile(data);
        if (data.user && data.user._id) {
          const projectsRes = await api.get(
            `/api/projects/user/${data.user._id}`,
          );
          setProjects(projectsRes.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (loading) return <PageLoader message="Loading Profile..." />;
  if (!profile)
    return <div className="container text-center">Profile not found.</div>;

  return (
    <div className="container container-sm">
      <div className="card card-centered">
        <div className="avatar-large">
          {profile.user.username[0].toUpperCase()}
        </div>
        <h1 className="profile-title">{profile.user.username}</h1>
        <p className="profile-bio">{profile.bio || "No bio available."}</p>

        <div className="profile-section">
          <h4 className="profile-section-title">Skills</h4>
          <div>
            {profile.skills.map((skill) => (
              <span key={skill} className="tag">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="profile-section">
          <h4 className="profile-section-title">Achievements</h4>
          <ul className="list-no-style">
            {profile.achievements.map((ach, i) => (
              <li key={i} className="text-muted">
                🏆 {ach}
              </li>
            ))}
          </ul>
        </div>

        <div className="profile-section">
          <h4 className="profile-section-title">Projects</h4>
          {projects.length > 0 ? (
            <div className="project-grid">
              {projects.map((project) => (
                <Link
                  to={`/projects/${project._id}`}
                  className="project-title-link"
                >
                  <div key={project._id} className="project-card-small">
                    {project.name}
                    <p className="project-description-tiny">
                      {project.description.substring(0, 60)}...
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted">No projects created.</p>
          )}
        </div>

        <a href={`mailto:${profile.user.email}`} className="btn btn-primary">
          Contact
        </a>
      </div>
    </div>
  );
};

export default UserProfile;
