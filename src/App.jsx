import Login from './components/Login';
import Signup from './components/SignUp';
import Navbar from './Navbar'
import './Navbar.css'
import '../src/styles/Base.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return (
    <>
      {localStorage.getItem('isAuth') && <Navbar />}
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />}/>
        </Routes>
      </Router>
    </>
  )
}

export default App;
