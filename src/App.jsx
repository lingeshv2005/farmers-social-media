import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Navbar from "./Navbar";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import Post from "./components/Post";
import ProfileDashboard from "./components/ProfileDashboard";
import AllChats from "./components/AllChats";
import ChatApp from "./components/ChatApp";

const CLIENT_ID = "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";

function App() {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Post />} />
          <Route path="/profile-dashboard" element={<ProfileDashboard />} />
          <Route path="/chat" element={<AllChats />} />
          <Route path="/chat/:chatUserId" element={<ChatApp />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
