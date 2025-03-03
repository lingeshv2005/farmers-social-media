import Login from './components/Login';
import Signup from './components/SignUp';
import Navbar from './Navbar';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Post from './components/Post';
import ProfileDashboard from './components/ProfileDashboard';
import { GoogleOAuthProvider } from "@react-oauth/google";

const CLIENT_ID = "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";

function App() {
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
          </Routes>
        </header>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
