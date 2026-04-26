import React from 'react'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom"
import { useSelector } from 'react-redux'
import Home from './pages/Home.jsx'
import UseGetCurrentUser from './hooks/UseGetCurrentUser.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Generate from './pages/Generate.jsx'
import Editor from './pages/Editor.jsx'
import LiveSite from './pages/LiveSite.jsx'
import Pricing from './pages/Pricing.jsx'
export const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000"

function App() {
  UseGetCurrentUser()
  const {userData} = useSelector(state => state.user)
  
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/dashboard' element={userData ? <Dashboard/> : <Home/>}/>
          <Route path='/generate' element={userData ? <Generate/> : <Home/>}/>
          <Route path='/editor/:id' element={userData?<Editor/> :<Home></Home>}/>
          <Route path='/site/:slug' element={<LiveSite/>}/>
          <Route path='/pricing' element={<Pricing/>}/> 
        </Routes>
    </BrowserRouter>
  )
}

export default App