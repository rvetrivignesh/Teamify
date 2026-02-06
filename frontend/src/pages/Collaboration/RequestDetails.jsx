import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./collaboration.css";

const RequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionStatus, setActionStatus] = useState(null);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const { data } = await api.get(`/api/collaboration/${id}`);
        setRequest(data);
      } catch (error) {
        console.error("Failed to load request", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  const handleAction = async (status) => {
    try {
      await api.put(`/api/collaboration/${id}`, { status });
      setActionStatus(status);
      setRequest((prev) => ({ ...prev, status }));
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    }
  };

  if (loading)
    return <div className="loading request-loading">Loading Request...</div>;
  if (!request)
    return (
      <div className="container request-not-found">Request not found.</div>
    );

  return (
    <div className="container request-details-container">
      <button
        onClick={() => navigate(-1)}
        className="btn btn-secondary btn-sm request-back-button"
      >
        &larr; Back
      </button>

      <div className="card request-card">
        <h1 className="section-title">Collaboration Request</h1>

        <div className="request-info">
          <p className="request-from">
            From:{" "}
            <Link
              to={`/profile/${request.sender._id}`}
              className="request-sender-link"
            >
              {request.sender.username}
            </Link>
          </p>
          <p className="request-project">
            Wants to join: <b>{request.project.name}</b>
          </p>
        </div>

        <div className="request-message-section">
          <h4 className="request-message-title">Message</h4>
          <p className="request-message-text">"{request.message}"</p>
        </div>

        {request.status === "pending" ? (
          <div className="request-actions">
            <button
              onClick={() => handleAction("accepted")}
              className="btn btn-primary request-action-approve"
            >
              Approve
            </button>
            <button
              onClick={() => handleAction("rejected")}
              className="btn btn-danger request-action-reject"
            >
              Reject
            </button>
          </div>
        ) : (
          <div
            className={`request-status-display ${request.status === "accepted" ? "request-status-accepted" : "request-status-rejected"}`}
          >
            Request {request.status}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestDetails;
