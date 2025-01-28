import React, {useState} from "react";
import axios from "axios";
import "../styles/HealthPost.css";

const NewPostModal =({onClose, userDetails})=>{
  const [tags,setTags] = useState([]);
  const [postType, setPostType] = useState("farmUpdate");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isShortFormVideo, setIsShortFormVideo] = useState(false);
  const [isRepostable, setIsRepostable] = useState(true);

  const handleTagChange=(e)=>{
    const tag=e.target.value;
    if(tag && !tags.includes(tag)){
      setTags([...tags,tag]);
    }
  };

  const handlePostSubmit =async ()=>{
    try{
      const newPost ={
        userId:userDetails.userId,
        username:userDetails.username,
        tags,
        postType,
        content,
        images,
        videos,
        isShortFormVideo,
        isRepostable
      };

      const response =await axios.post(
        "https://farmers-social-media-backend.onrender.com/api/createpost",
        newPost
      );

      console.log("Post created successfully: ",response.data);
      onClose();
    }catch(err){
      console.error(err);
      alert("Failed to create post!"+err+userDetails);
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


        <label>Images (comma separated URLs)</label>
        <input type="text" onChange={(e)=> setImages(e.target.value.split(","))}/>

        <label>Videos (comma separated URLs)</label>
        <input type="text" onChange={(e)=> setVideos(e.target.value.split(","))}/>

        <label>Short From Video?
          <input 
            type="checkbox" 
            checked={isShortFormVideo} 
            onChange={(e)=>setIsShortFormVideo(e.target.checked)} 
          />
        </label>

        <label>Short From Video?
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

      </div>
    </div>

  )
}


const HealthPost=({userDetails})=>{
  const [showModal, setShowModal]=useState(false);

  const toggleModal=()=>{
    setShowModal(!showModal);
  }

  return(
    <div>
      <button onClick={toggleModal}>New Post</button>

      {showModal && <NewPostModal onClose={toggleModal} userDetails={userDetails}/>}
    </div>
  )
}

export default HealthPost;
"ee630ac3-9a27-4ced-ad09-81987bd0c74f"
