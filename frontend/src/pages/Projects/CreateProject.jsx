import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./projects.css";

const CreateProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    domain: "",
    repositoryLink: "",
    skillsRequired: "",
    tasks: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const skillsArray = formData.skillsRequired
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
      const tasksArray = formData.tasks
        .split("\n")
        .map((t) => ({ title: t.trim() }))
        .filter((t) => t.title);

      const payload = {
        name: formData.name,
        description: formData.description,
        domain: formData.domain.trim().toLowerCase(),
        repositoryLink: formData.repositoryLink.trim(),
        skillsRequired: skillsArray,
        tasks: tasksArray,
      };

      await api.post("/api/projects", payload);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container create-project-container">
      <h1 className="section-title">Start a New Project</h1>
      <div className="card">
        {error && <div className="create-project-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Project Name</label>
            <input
              name="name"
              className="input-field"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. AI Content Generator"
            />
          </div>

          <div className="input-group">
            <label className="input-label">
              Domain (e.g., IoT, Software, AI)
            </label>
            <input
              name="domain"
              className="input-field"
              value={formData.domain}
              onChange={handleChange}
              required
              placeholder="e.g. software"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Repository Link (Optional)</label>
            <input
              name="repositoryLink"
              className="input-field"
              value={formData.repositoryLink}
              onChange={handleChange}
              placeholder="https://github.com/your-repo"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Description</label>
            <textarea
              name="description"
              className="input-field create-project-textarea"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe your project goal..."
            />
          </div>

          <div className="input-group">
            <label className="input-label">
              Required Skills (comma separated)
            </label>
            <input
              name="skillsRequired"
              className="input-field"
              value={formData.skillsRequired}
              onChange={handleChange}
              required
              placeholder="React, Python, Design..."
            />
          </div>

          <div className="input-group">
            <label className="input-label">Initial Tasks (one per line)</label>
            <textarea
              name="tasks"
              className="input-field"
              rows="4"
              value={formData.tasks}
              onChange={handleChange}
              required
              placeholder="Setup repository&#10;Design database schema"
            />
          </div>

          <div className="create-project-button-group">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Launch Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
