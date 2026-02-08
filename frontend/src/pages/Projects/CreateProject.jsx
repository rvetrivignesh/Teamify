import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "./projects.css";

const CreateProject = () => {
  const navigate = useNavigate();
  const { id } = useParams();
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

  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      const fetchProject = async () => {
        try {
          const { data } = await api.get(`/api/projects/${id}`);
          setFormData({
            name: data.name || "",
            description: data.description || "",
            domain: data.domain || "",
            repositoryLink: data.repositoryLink || "",
            skillsRequired: data.skillsRequired?.join(", ") || "",
            tasks: data.tasks?.map((t) => t.title).join("\n") || "",
          });
        } catch (err) {
          setError("Failed to load project details");
          console.error(err);
        }
      };
      fetchProject();
    }
  }, [id, isEditMode]);

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

      if (isEditMode) {
        await api.put(`/api/projects/${id}`, payload);
      } else {
        await api.post("/api/projects", payload);
      }
      navigate(isEditMode ? `/projects/${id}` : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container create-project-container">
      <h1 className="section-title">
        {isEditMode ? "Edit Project" : "Start a New Project"}
      </h1>
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
              maxLength={20}
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
              maxLength={20}
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
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update Project"
                  : "Launch Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
