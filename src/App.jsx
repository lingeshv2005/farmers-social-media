import Login from './components/Login';
import Signup from './components/SignUp';
import Navbar from './Navbar';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Post from './components/Post';
import ProfileDashboard from './components/ProfileDashboard';
import AllChats from './components/AllChats';
import ChatApp from './components/ChatApp';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useState } from 'react';

const CLIENT_ID = "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";

function App() {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Router>
        <Navbar />
        
        <header>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Post />} />
            <Route path="/profile-dashboard" element={<ProfileDashboard />} />
            <Route 
              path="/chat" 
              element={
                selectedChat ? (
                  <ChatApp selectedChat={selectedChat} userId="8318933e-4ae2-4630-afe2-5213bb9bdfb6" closeChat={() => setSelectedChat(null)} />
                ) : (
                  <AllChats userId="8318933e-4ae2-4630-afe2-5213bb9bdfb6" openChat={setSelectedChat} />
                )
              } 
            />
          </Routes>
        </header>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
