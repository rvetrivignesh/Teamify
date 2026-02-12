import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import PageLoader from "../../components/PageLoader/PageLoader.jsx";
import "../Collaboration/collaboration.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get("/api/notifications");
        setNotifications(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      setNotifications(
        notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleNotificationClick = (notif) => {
    if (!notif.isRead) markAsRead(notif._id);

    if (notif.type === "request") {
      navigate(`/requests/${notif.relatedId}`);
    } else if ((notif.type === "task_review" || notif.type === "info" || notif.type === "task_rejected") && notif.relatedId) {
      navigate(`/projects/${notif.relatedId}`);
    }
  };

  if (loading) return <PageLoader message="Loading Notifications..." />;

  return (
    <div className="container container-sm">
      <h1 className="section-title">Notifications</h1>

      {notifications.length === 0 ? (
        <div className="card card-centered text-muted">
          No notifications yet.
        </div>
      ) : (
        <div className="stack-col">
          {notifications.map((notif) => (
            notif.type === "task_rejected" ? (
              <div
                key={notif._id}
                className={`card received-request-card ${notif.isRead ? "read" : "unread"}`}
                onClick={() => handleNotificationClick(notif)}
                style={{ borderLeft: "4px solid #ef4444" }}
              >
                <div>
                  <p className="request-title" style={{ color: "#ef4444", fontWeight: "bold" }}>
                    Task Rejected
                  </p>
                  <p className="notif-msg" style={{ marginBottom: "8px" }}>
                    {notif.message}
                  </p>
                  {notif.reason && (
                    <p className="request-message" style={{ background: "var(--bg-secondary)", padding: "8px", borderRadius: "4px" }}>
                      Reason: "{notif.reason}"
                    </p>
                  )}
                  <span className="small text-muted">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>
                {!notif.isRead && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notif._id);
                    }}
                    className="btn btn-sm btn-secondary"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            ) : (
              <div
                key={notif._id}
                className={`card notif-item ${notif.isRead ? "read" : "unread"}`}
                onClick={() => handleNotificationClick(notif)}
              >
                <div>
                  <p className="notif-msg">
                    {notif.message}
                  </p>
                  <span className="small text-muted">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>
                {!notif.isRead && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notif._id);
                    }}
                    className="btn btn-sm btn-secondary"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
