import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import PageLoader from "../../components/PageLoader/PageLoader.jsx";
import "./profile.css"; // We will create this file for specific styles if needed, or use inline/global

const SetupProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bio: "",
    skills: [],
    achievements: [],
  });

  const [skillInput, setSkillInput] = useState("");
  const [achievementInput, setAchievementInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/api/profile/me");
        setFormData({
          bio: data.bio || "",
          skills: data.skills || [],
          achievements: data.achievements || [],
        });
      } catch (error) {
        // If 404, it means no profile yet, which is fine
        if (error.response && error.response.status !== 404) {
          console.error("Error fetching profile:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddItem = (field, value, setInput) => {
    const v = value.trim();
    if (v) {
      const normalized = field === "skills" ? v.toLowerCase() : v;
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], normalized],
      }));
      setInput("");
    }
  };

  const handleRemoveItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    try {
      const { data } = await api.post("/api/profile", formData);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      navigate("/dashboard"); // Redirect to dashboard after saving, or you can choose to stay on the page
      // Optionally redirect or stay
    } catch (error) {
      console.error("Error saving profile:", error);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || "Failed to update profile.";
      setMessage({ type: "error", text: errorMsg });
    }
  };

  if (loading) return <PageLoader message="Loading Profile..." />;

  return (
    <div className="setup-profile-container">
      <div className="setup-profile-card">
        <h2>Setup Your Profile</h2>
        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}
        <form onSubmit={handleSubmit}>
          {/* Bio Section */}
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              rows="4"
              maxLength={300}
            />
          </div>

          {/* Skills Section */}
          <div className="form-group">
            <label>Skills/Interests</label>
            <div className="input-group">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                maxLength={25}
                placeholder="Enter a skill"
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  (e.preventDefault(),
                    handleAddItem("skills", skillInput, setSkillInput))
                }
              />
              <button
                type="button"
                className="add-btn"
                onClick={() =>
                  handleAddItem("skills", skillInput, setSkillInput)
                }
              >
                Add
              </button>
            </div>
            <ul className="item-list">
              {formData.skills.map((skill, index) => (
                <li key={index}>
                  {skill}
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => handleRemoveItem("skills", index)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Achievements Section */}
          <div className="form-group">
            <label>Achievements</label>
            <div className="input-group">
              <input
                type="text"
                value={achievementInput}
                onChange={(e) => setAchievementInput(e.target.value)}
                maxLength={50}
                placeholder="Enter an achievement"
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  (e.preventDefault(),
                    handleAddItem(
                      "achievements",
                      achievementInput,
                      setAchievementInput,
                    ))
                }
              />
              <button
                type="button"
                className="add-btn"
                onClick={() =>
                  handleAddItem(
                    "achievements",
                    achievementInput,
                    setAchievementInput,
                  )
                }
              >
                Add
              </button>
            </div>
            <ul className="item-list">
              {formData.achievements.map((achievement, index) => (
                <li key={index}>
                  {achievement}
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => handleRemoveItem("achievements", index)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <button type="submit" className="submit-btn">
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupProfile;
