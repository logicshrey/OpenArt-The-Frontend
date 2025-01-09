import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home'
import RegistrationForm from './pages/Register'
import LoginForm from './pages/Login'
import ArtworksPage from './pages/Artworks';
import ArtblogsPage from './pages/Artblogs';
import ArtversePage from './pages/Artverse';


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegistrationForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/artworks" element={<ArtworksPage />} />
      <Route path="/artblogs" element={<ArtblogsPage />} />
      <Route path="/artverse" element={<ArtversePage />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
