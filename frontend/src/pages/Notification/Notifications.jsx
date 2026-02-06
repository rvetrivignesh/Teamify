import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="loading loading-center">Loading...</div>;

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
            <div
              key={notif._id}
              className={`card notif-item ${notif.isRead ? "read" : "unread"}`}
            >
              <div>
                <p className="notif-msg">
                  {notif.type === "request" ? (
                    <Link
                      to={`/requests/${notif.relatedId}`}
                      onClick={() => !notif.isRead && markAsRead(notif._id)}
                      className="no-underline"
                    >
                      {notif.message}
                    </Link>
                  ) : (
                    notif.message
                  )}
                </p>
                <span className="small text-muted">
                  {new Date(notif.createdAt).toLocaleString()}
                </span>
              </div>
              {!notif.isRead && (
                <button
                  onClick={() => markAsRead(notif._id)}
                  className="btn btn-sm btn-secondary"
                >
                  Mark as read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
