import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import PageLoader from "../../components/PageLoader/PageLoader.jsx";
import ProjectSection from "../../components/ProjectSection/ProjectSection.jsx";
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
    return <PageLoader message="Loading your dashboard..." />;
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

      <ProjectSection
        title="Your Projects"
        projects={myProjects}
        emptyMessage="You haven't joined or created any projects yet."
        emptyLinkTo="/projects/create"
        emptyLinkText="Create one now"
        user={user}
        showOwnerInfo="collaborator"
      />

      <div className="section mt-48">
        <ProjectSection
          title="Recommended For You:"
          projects={recommendedProjects}
          emptyMessage="No recommendations found based on your skills."
          emptyLinkTo="/setup-profile"
          emptyLinkText="Update your skills"
          user={user}
          showOwnerInfo="username"
        />
      </div>
    </div>
  );
};

export default Dashboard;
