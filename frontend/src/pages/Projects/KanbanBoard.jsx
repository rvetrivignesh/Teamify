
import { useState } from "react";
import api from "../../services/api";
import "./projects.css";

const KanbanBoard = ({ project, currentUser, onProjectUpdate }) => {
    const [loadingAction, setLoadingAction] = useState(null);

    const isOwner =
        currentUser &&
        project.owner &&
        (project.owner._id?.toString() === currentUser._id?.toString() ||
            project.owner.toString() === currentUser._id?.toString());

    // Helper to check if user has active task
    const userActiveTask = project.tasks.find(
        (t) =>
            t.assignedTo &&
            (t.assignedTo._id?.toString() === currentUser._id?.toString() ||
                t.assignedTo.toString() === currentUser._id?.toString()) &&
            (t.status === "Doing" || t.status === "Review"),
    );

    const handleAssign = async (taskId) => {
        if (userActiveTask) {
            alert("You already have an active task. Please complete it first.");
            return;
        }
        setLoadingAction(taskId);
        try {
            const { data } = await api.post(
                `/api/projects/${project._id}/tasks/${taskId}/assign`,
            );
            onProjectUpdate(data);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to assign task");
        } finally {
            setLoadingAction(null);
        }
    };

    const handleReview = async (taskId) => {
        setLoadingAction(taskId);
        try {
            const { data } = await api.post(
                `/api/projects/${project._id}/tasks/${taskId}/review`,
            );
            onProjectUpdate(data);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to mark for review");
        } finally {
            setLoadingAction(null);
        }
    };

    const handleApprove = async (taskId) => {
        if (!isOwner) return;
        setLoadingAction(taskId);
        try {
            const { data } = await api.post(
                `/api/projects/${project._id}/tasks/${taskId}/approve`,
            );
            onProjectUpdate(data);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to approve task");
        } finally {
            setLoadingAction(null);
        }
    };

    const pendingTasks = project.tasks.filter((t) => t.status === "Pending");
    const doingTasks = project.tasks.filter(
        (t) => t.status === "Doing" || t.status === "Review",
    );
    const doneTasks = project.tasks.filter(
        (t) => t.status === "Done" || t.status === "Completed",
    );

    /* Unassign Task Handler */
    const handleUnassign = async (taskId) => {
        if (!window.confirm("Are you sure you want to remove this task?")) return;
        setLoadingAction(taskId);
        try {
            const { data } = await api.post(
                `/api/projects/${project._id}/tasks/${taskId}/unassign`,
            );
            onProjectUpdate(data);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to unassign task");
        } finally {
            setLoadingAction(null);
        }
    };


    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [taskToReject, setTaskToReject] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");

    const handleReject = (taskId) => {
        if (!isOwner) return;
        setTaskToReject(taskId);
        setRejectModalOpen(true);
    };

    const confirmReject = async () => {
        if (!taskToReject) return;
        setLoadingAction(taskToReject);
        try {
            const { data } = await api.post(
                `/api/projects/${project._id}/tasks/${taskToReject}/reject`,
                { reason: rejectionReason }
            );
            onProjectUpdate(data);
            setRejectModalOpen(false);
            setRejectionReason("");
            setTaskToReject(null);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to reject task");
        } finally {
            setLoadingAction(null);
        }
    };

    const renderTaskCard = (task) => {
        const isAssignedToMe =
            task.assignedTo &&
            (task.assignedTo._id?.toString() === currentUser._id?.toString() ||
                task.assignedTo.toString() === currentUser._id?.toString());

        return (
            <div key={task._id} className="kanban-task-card">
                <div className="task-card-title">{task.title}</div>

                {task.status === "Review" && (
                    <div className="status-badge status-review">In Review</div>
                )}

                {task.assignedTo && (
                    <div className="task-card-assignee">
                        <div className="assignee-avatar-small">
                            {task.assignedTo.username
                                ? task.assignedTo.username[0].toUpperCase()
                                : "?"}
                        </div>
                        <span>{task.assignedTo.username}</span>
                    </div>
                )}

                {/* Actions */}
                {task.status === "Pending" && !userActiveTask && (
                    <button
                        onClick={() => handleAssign(task._id)}
                        className="kanban-action-btn btn-assign"
                        disabled={loadingAction === task._id}
                    >
                        {loadingAction === task._id ? "Assigning..." : "Assign to Me"}
                    </button>
                )}

                {task.status === "Doing" && isAssignedToMe && (
                    <>
                        <button
                            onClick={() => handleReview(task._id)}
                            className="kanban-action-btn btn-review"
                            disabled={loadingAction === task._id}
                        >
                            {loadingAction === task._id ? "Processing..." : "Mark for Review"}
                        </button>
                        <button
                            onClick={() => handleUnassign(task._id)}
                            className="kanban-action-btn btn-remove-task"
                            disabled={loadingAction === task._id}
                        >
                            Remove Task
                        </button>
                    </>
                )}

                {task.status === "Review" && isOwner && (
                    <div className="kanban-review-actions">
                        <button
                            onClick={() => handleApprove(task._id)}
                            className="btn btn-sm btn-approve"
                            disabled={loadingAction === task._id}
                        >
                            {loadingAction === task._id ? "..." : "Approve"}
                        </button>
                        <button
                            onClick={() => handleReject(task._id)}
                            className="btn btn-sm btn-danger"
                            disabled={loadingAction === task._id}
                        >
                            {loadingAction === task._id ? "..." : "Reject"}
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="kanban-board">
            {/* Pending Column */}
            <div className="kanban-column">
                <div className="kanban-header">
                    <span className="kanban-title">Pending</span>
                    <span className="kanban-count">{pendingTasks.length}</span>
                </div>
                <div className="kanban-tasks">
                    {pendingTasks.map(renderTaskCard)}
                    {pendingTasks.length === 0 && (
                        <div className="text-secondary text-center text-sm">
                            No pending tasks
                        </div>
                    )}
                </div>
            </div>

            {/* Doing Column */}
            <div className="kanban-column">
                <div className="kanban-header">
                    <span className="kanban-title">Doing</span>
                    <span className="kanban-count">{doingTasks.length}</span>
                </div>
                <div className="kanban-tasks">
                    {doingTasks.map(renderTaskCard)}
                    {doingTasks.length === 0 && (
                        <div className="text-secondary text-center text-sm">
                            No active tasks
                        </div>
                    )}
                </div>
            </div>

            {/* Done Column */}
            <div className="kanban-column">
                <div className="kanban-header">
                    <span className="kanban-title">Done</span>
                    <span className="kanban-count">{doneTasks.length}</span>
                </div>
                <div className="kanban-tasks">
                    {doneTasks.map(renderTaskCard)}
                    {doneTasks.length === 0 && (
                        <div className="text-secondary text-center text-sm">
                            No completed tasks
                        </div>
                    )}
                </div>
            </div>
            {rejectModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="modal-title">Reject Task</h3>
                        <div className="modal-body">
                            <p style={{ marginBottom: "8px", color: "var(--text-secondary)" }}>
                                Please provide a reason for rejecting this task.
                            </p>
                            <textarea
                                className="modal-textarea"
                                placeholder="Enter rejection reason..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                            />
                        </div>
                        <div className="modal-actions">
                            <button
                                className="btn btn-secondary"
                                onClick={() => {
                                    setRejectModalOpen(false);
                                    setRejectionReason("");
                                    setTaskToReject(null);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={confirmReject}
                                disabled={!rejectionReason.trim()}
                            >
                                Confirm Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KanbanBoard;
