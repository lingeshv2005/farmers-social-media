import Login from './components/Login';
import Signup from './components/SignUp';
import Navbar from './Navbar'
import './Navbar.css'
import '../src/styles/Base.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Post from './components/Post';
import ProfileDashboard from './components/ProfileDashboard';


function App() {
  return (
    <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />}/>
          <Route path="/home" element={<Post/>} />
          <Route path="/profile-dashboard" element={<ProfileDashboard />} />
        </Routes>
      </Router>
  )
}

export default App;
