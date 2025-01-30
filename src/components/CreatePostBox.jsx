import React, {useState} from "react";
import axios from "axios";
import "../styles/CreatePostBox.css";

const NewPostModal =({ userDetails, onClose})=>{
  const [tags,setTags] = useState([]);
  const [postType, setPostType] = useState("farmUpdate");
  const [content, setContent] = useState("");
  const [videos, setVideos] = useState([]);
  const [isShortFormVideo, setIsShortFormVideo] = useState(false);
  const [isRepostable, setIsRepostable] = useState(true);

  const [images,setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

  const handleTagChange=(e)=>{
    const tag=e.target.value;
    if(tag && !tags.includes(tag)){
      setTags([...tags,tag]);
    }
  };

  const handleFileChange=(e)=>{
    const file=e.target.files[0];
    if(file){
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePostSubmit =async ()=>{
    try{

      if(!selectedFile){
        setUploadMessage("Please select an image first.");
        return;
      }

      const formData=new FormData();
      formData.append("image",selectedFile);

      const imageResponse=await axios.post(
        "https://farmers-social-media-backend.onrender.com/upload",
        formData,
        { headers:{"Content-Type":"multipart/form-data"},
      });

      const uploadedImageUrl = `https://farmers-social-media-backend.onrender.com${imageResponse.data.imageUrl}`;
      setImages((prevImages)=>{
        const updatedImages=[...prevImages,uploadedImageUrl];

      const newPost ={
        userId:userDetails.userId,
        username:userDetails.username,
        tags,
        postType,
        content,
        images:updatedImages,
        videos,
        isShortFormVideo,
        isRepostable
      };

      axios.post(
        "https://farmers-social-media-backend.onrender.com/api/createpost",
        newPost
      )
      .then((response)=>{
        setUploadMessage("Post created successfully");
        console.log("Post created successfully: ",response.data);
        onClose();
      }).catch((err)=>{
        console.error("Error: ",err);
        alert("Failed to create post!");
      })
      return updatedImages;
    });
  
    }catch(err){
      console.error("Error:", err);
      alert("Failed to create post!");
    }
  }


  return (
    <div className="modal-overlay show">
      <div className="modal-content">
        <h2>Create New Post</h2>

        <label>Tags (comma separated)</label>
        <input type="text" onChange={handleTagChange} />

        <label>Post Type</label>
        <select value={postType} onChange={(e)=>setPostType(e.target.value)}>
          <option value="farmUpdate">Farm Update</option>
          <option value="diseaseQuestion">Disease Question</option>
        </select>

        <label>Content</label>
        <textarea 
          value={content}
          onChange={(e)=>setContent(e.target.value)}
        />


        <label>Upload Image</label>
        <input type="file" accept="image/*" onChange={handleFileChange}/>
        {imagePreview && <img src={imagePreview} alt="Priview" />}

        <label>Videos (comma separated URLs)</label>
        <input type="text" onChange={(e)=> setVideos(e.target.value.split(","))}/>

        <label>Short From Video?
          <input 
            type="checkbox" 
            checked={isShortFormVideo} 
            onChange={(e)=>setIsShortFormVideo(e.target.checked)} 
          />
        </label>

        <label>Is Repostable?
          <input 
            type="checkbox" 
            checked={isRepostable} 
            onChange={(e)=>setIsRepostable(e.target.checked)} 
          />
        </label>

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button className="submit" onClick={handlePostSubmit}>
            Submit
          </button>
        </div>
        {uploadMessage && <p>{uploadMessage}</p>}  

      </div>
    </div>

  )
}


const CreatePostBox=({userDetails, onClose})=>{

  return(
    <div>
      <NewPostModal  userDetails={userDetails} onClose={onClose}/>
    </div>
  )
}

export default CreatePostBox;
"ee630ac3-9a27-4ced-ad09-81987bd0c74f"
