import Login from './components/Login';
import Signup from './components/SignUp';
import Navbar from './Navbar'
import './Navbar.css'
import '../src/styles/Base.css'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />}/>
        </Routes>
      </Router>
    </>
  )
}

export default App;
