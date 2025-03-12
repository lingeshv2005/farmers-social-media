import Login from './components/Login';
import Signup from './components/SignUp';
import Navbar from './Navbar';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Post from './components/Post';
import ProfileDashboard from './components/ProfileDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreatePostBox from './components/CreatePostBox';

const CLIENT_ID = "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";

function App() {
  const isAuthenticated = localStorage.getItem('isAuth') === 'true';

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <Navbar />
        <main className="app-main">
          <Routes>
            {/* Default route redirect */}
            <Route 
              path="/" 
              element={isAuthenticated ? <Navigate to="/posts" replace /> : <Navigate to="/login" replace />} 
            />
            
            {/* Auth routes */}
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/posts" replace /> : <Login />} 
            />
            <Route 
              path="/signup" 
              element={isAuthenticated ? <Navigate to="/posts" replace /> : <Signup />} 
            />
            
            {/* Protected routes */}
            <Route
              path="/posts"
              element={
                <ProtectedRoute>
                  <Post />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile-dashboard"
              element={
                <ProtectedRoute>
                  <ProfileDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-post"
              element={
                <ProtectedRoute>
                  <CreatePostBox />
                </ProtectedRoute>
              }
            />

            {/* Catch all route - redirect to posts if authenticated, login if not */}
            <Route 
              path="*" 
              element={isAuthenticated ? <Navigate to="/posts" replace /> : <Navigate to="/login" replace />} 
            />
          </Routes>
        </main>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
