import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";

const UpdateProfile = ({ userId }) => {
  const [user, setUser] = useState({
    email: "",
    username: "",
    phone: "",
    name: "",
    location: "",
    bio: "",
    dateOfBirth: "",
    gender: "",
    website: "",
    facebook: "",
    instagram: "",
    twitter: "",
    whatsapp: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/users/${userId}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, [userId]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/api/users/${userId}`, user)
      .then(() => alert("Profile updated successfully!"))
      .catch((err) => console.error(err));
  };

  return (
    <div className="container">
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        {[
          { label: "Email", name: "email", type: "email" },
          { label: "Username", name: "username", type: "text" },
          { label: "Phone", name: "phone", type: "text" },
          { label: "Name", name: "name", type: "text" },
          { label: "Location", name: "location", type: "text" },
          { label: "Website", name: "website", type: "text" },
          { label: "Facebook", name: "facebook", type: "text" },
          { label: "Instagram", name: "instagram", type: "text" },
          { label: "Twitter", name: "twitter", type: "text" },
          { label: "WhatsApp", name: "whatsapp", type: "text" },
        ].map((field, index) => (
          <div className="input-container" key={index}>
            <label>{field.label}:</label>
            <div className="input-wrapper">
              <input
                type={field.type}
                name={field.name}
                value={user[field.name]}
                onChange={handleChange}
                required
              />
              <FaEdit className="edit-icon" />
            </div>
          </div>
        ))}

        <label>Bio:</label>
        <div className="input-wrapper">
          <textarea name="bio" value={user.bio} onChange={handleChange} />
          <FaEdit className="edit-icon" />
        </div>

        <label>Date of Birth:</label>
        <div className="input-wrapper">
          <input
            type="date"
            name="dateOfBirth"
            value={user.dateOfBirth}
            onChange={handleChange}
          />
          <FaEdit className="edit-icon" />
        </div>

        <label>Gender:</label>
        <div className="input-wrapper">
          <select name="gender" value={user.gender} onChange={handleChange}>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefernottosay">Prefer not to say</option>
          </select>
          <FaEdit className="edit-icon" />
        </div>

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default UpdateProfile;
