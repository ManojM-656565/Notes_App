// import React from 'react'
  import Home from './pages/Home/Home'
  import Login from './pages/Login/Login'
  import SignUp from './pages/Signup/SignUp'
  import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/dashboard" exact element={<Home />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/signup" exact element={<SignUp />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
