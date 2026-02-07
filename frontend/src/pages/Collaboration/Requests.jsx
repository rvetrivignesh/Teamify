import { useEffect, useState } from "react";
import api from "../../services/api";
import PageLoader from "../../components/PageLoader/PageLoader.jsx";
import "./collaboration.css";

const Requests = () => {
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("received"); // 'received' or 'sent'

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await api.get("/api/collaboration");
        setSent(data.sent);
        setReceived(data.received);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleResponse = async (id, status) => {
    try {
      await api.put(`/api/collaboration/${id}`, { status });
      // Update UI
      setReceived(
        received.map((req) => {
          if (req._id === id) {
            return { ...req, status };
          }
          return req;
        }),
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    }
  };

  if (loading) return <PageLoader message="Loading requests..." />;

  return (
    <div className="container requests-container">
      <h1 className="section-title">Collaboration Requests</h1>

      <div className="requests-tabs">
        <button
          className={`btn ${activeTab === "received" ? "btn-primary" : "btn-secondary"} requests-tab-button`}
          onClick={() => setActiveTab("received")}
        >
          Received ({received.filter((r) => r.status === "pending").length})
        </button>
        <button
          className={`btn ${activeTab === "sent" ? "btn-primary" : "btn-secondary"} requests-tab-button`}
          onClick={() => setActiveTab("sent")}
        >
          Sent ({sent.length})
        </button>
      </div>

      <div className="requests-list">
        {activeTab === "received" ? (
          received.length === 0 ? (
            <p className="empty-state">No received requests.</p>
          ) : (
            received.map((req) => (
              <div key={req._id} className="card received-request-card">
                <div>
                  <p className="request-title">
                    <b>{req.sender.username}</b> wants to join{" "}
                    <b>{req.project.name}</b>
                  </p>
                  <p className="request-message">"{req.message}"</p>
                  <p className="request-status">
                    Status: <b className="request-status-text">{req.status}</b>
                  </p>
                </div>
                {req.status === "pending" && (
                  <div className="request-actions">
                    <button
                      onClick={() => handleResponse(req._id, "accepted")}
                      className="btn btn-sm request-action-accept"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleResponse(req._id, "rejected")}
                      className="btn btn-sm btn-danger"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )
        ) : sent.length === 0 ? (
          <p className="empty-state">No sent requests.</p>
        ) : (
          sent.map((req) => (
            <div key={req._id} className="card sent-request-card">
              <p className="request-title">
                You requested to join{" "}
                <b>{req.project?.name || "Unknown Project"}</b>
              </p>
              <p className="request-message">"{req.message}"</p>
              <p className="request-status">
                To: <b>{req.receiver?.username || "Unknown"}</b> • Status:{" "}
                <b
                  className={`request-status-colored ${req.status === "accepted" ? "request-status-accepted" : req.status === "rejected" ? "request-status-rejected" : "request-status-pending"}`}
                >
                  {req.status}
                </b>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Requests;
