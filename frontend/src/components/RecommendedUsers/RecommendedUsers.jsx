import { useState } from "react";
import InviteModal from "../InviteModal/InviteModal";
import { Link } from "react-router-dom";
import "./RecommendedUsers.css";

const RecommendedUsers = ({ users, myProjects, currentUser }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleInviteClick = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  if (!users || users.length === 0) {
    return (
      <div className="section mt-48">
        <h2 className="section-title">Recommended Teammates</h2>
        <div className="empty-state">
          <p>No teammates found with similar skills yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section mt-48">
      <h2 className="section-title">Recommended Teammates</h2>
      <div className="recommended-users-grid">
        {users.map((profile) => (
          <div key={profile._id} className="card user-card">
            <div className="card-header-row">
              <div className="user-avatar-placeholder">
                {profile.user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="card-title">{profile.user.username}</h3>
                <span className="text-muted text-sm">Skills match yours</span>
              </div>
            </div>

            <p className="user-bio">
              {profile.bio
                ? profile.bio.substring(0, 80) +
                  (profile.bio.length > 80 ? "..." : "")
                : "No bio provided"}
            </p>

            <div className="tags">
              {profile.skills.slice(0, 3).map((skill) => (
                <span key={skill} className="tag tag-blue">
                  {skill}
                </span>
              ))}
              {profile.skills.length > 3 && (
                <span className="tag text-xs">
                  +{profile.skills.length - 3} more
                </span>
              )}
            </div>

            <div className="card-actions mt-auto">
              <Link
                to={`/profile/${profile.user.username}`}
                className="btn btn-sm btn-secondary"
              >
                View
              </Link>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => handleInviteClick(profile.user)}
              >
                Invite
              </button>
            </div>
          </div>
        ))}
      </div>

      <InviteModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        targetUser={selectedUser}
        myProjects={myProjects}
        currentUser={currentUser}
      />
    </div>
  );
};

export default RecommendedUsers;
