import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import "../styles/UpdateProfileDetails.css";

const UpdateProfile = ({ userId, onClose }) => {
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
    profilePicture: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/v1/userdetails/getuserdetails/${userId}`)
      .then((res) => {
        setUser(res.data);
        setPreview(`http://localhost:8000${res.data.profilePicture}`); // Correcting Image Path
      })
      .catch((err) => console.error("Error fetching user details:", err));
  }, [userId]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // Show preview before upload
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) return null; // No new image selected

    const formData = new FormData();
    formData.append("profilePicture", selectedFile);

    try {
      const res = await axios.post("http://localhost:8000/api/v1/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data.imageUrls[0]; // Backend should return the uploaded image URL
    } catch (err) {
      console.error("Error uploading image:", err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const imageUrl = await uploadImage(); // Upload new image if selected
    if (imageUrl) {
      setUser((prevUser) => ({ ...prevUser, profilePicture: imageUrl })); // Update only frontend state
      alert("Profile picture updated successfully!");
    }
  };

  return (
    <div className="update-profile-container">
      <h2>Update Profile</h2>
      
      <label>Profile Picture:</label>
      <div className="profile-pic-container">
        <img src={preview || "default-avatar.jpg"} alt="Profile" className="profile-picture" />
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      <form onSubmit={handleSubmit}>
        {[
          { label: "Email", name: "email", type: "email" },
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
              <input type={field.type} name={field.name} value={user[field.name] ?? ""} onChange={handleChange} required />
              <FaEdit className="edit-icon" />
            </div>
          </div>
        ))}

        <label>Bio:</label>
        <textarea name="bio" value={user.bio ?? ""} onChange={handleChange} />

        <label>Date of Birth:</label>
        <input type="date" name="dateOfBirth" value={user.dateOfBirth ?? ""} onChange={handleChange} />

        <label>Gender:</label>
        <select name="gender" value={user.gender ?? ""} onChange={handleChange}>
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefernottosay">Prefer not to say</option>
        </select>

        <div className="button-container">
          <button type="submit" className="save-btn">Update Profile</button>
          <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
