import { useState } from "react";
import api from "../../services/api";
import "./InviteModal.css";

const InviteModal = ({ isOpen, onClose, targetUser, myProjects, currentUser }) => {
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    // Filter projects where I am the owner
    const ownedProjects = myProjects.filter(
        (p) => (p.owner._id || p.owner) === (currentUser?._id || currentUser?.id)
    );

    const handleSend = async () => {
        if (!selectedProjectId) {
            setError("Please select a project.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await api.post("/api/collaboration/invite", {
                userId: targetUser._id,
                projectId: selectedProjectId,
                message,
            });
            onClose();
            alert("Invitation sent successfully!");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send invitation.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Invite {targetUser?.username} to your project</h3>

                {error && <p className="error-msg">{error}</p>}

                {ownedProjects.length === 0 ? (
                    <p>You don't have any projects to invite users to.</p>
                ) : (
                    <div className="form-group">
                        <label>Select Project:</label>
                        <select
                            value={selectedProjectId}
                            onChange={(e) => setSelectedProjectId(e.target.value)}
                            className="form-control"
                        >
                            <option value="">-- Select Project --</option>
                            {ownedProjects.map((p) => (
                                <option key={p._id} value={p._id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="form-group">
                    <label>Message (Optional):</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="form-control"
                        placeholder="Hey, join my project!"
                    />
                </div>

                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleSend}
                        disabled={loading || ownedProjects.length === 0}
                    >
                        {loading ? "Sending..." : "Send Invite"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InviteModal;
