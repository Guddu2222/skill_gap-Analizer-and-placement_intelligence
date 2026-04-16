°
import React from 'react'
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Workouts from './pages/Workouts.jsx'
import Meals from './pages/Meals.jsx'
import Goals from './pages/Goals.jsx'
import Friends from './pages/Friends.jsx'
import Feed from './pages/Feed.jsx'
import Layout from './components/Layout.jsx'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<PrivateRoute><Dashboard/></PrivateRoute>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/workouts" element={<PrivateRoute><Workouts/></PrivateRoute>} />
        <Route path="/meals" element={<PrivateRoute><Meals/></PrivateRoute>} />
        <Route path="/goals" element={<PrivateRoute><Goals/></PrivateRoute>} />
        <Route path="/friends" element={<PrivateRoute><Friends/></PrivateRoute>} />
        <Route path="/feed" element={<PrivateRoute><Feed/></PrivateRoute>} />
      </Routes>
    </Layout>
  )
}
°
"(9a00d8ca6dec79e38fef643b915ca14be63f2f582Cfile:///d:/project/Fittness%20tracking%20website/client/src/App.jsx:0file:///d:/project/Fittness%20tracking%20website