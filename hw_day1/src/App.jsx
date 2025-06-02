import { Routes, Route, Link } from 'react-router-dom'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home'
import Props from './pages/Props'
import Timer from './pages/Timer'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}> </Route>
      <Route path="/props" element={<Props />}> </Route>
      <Route path="/timer" element={<Timer />}> </Route>
    </Routes>   
  )
}

export default App
