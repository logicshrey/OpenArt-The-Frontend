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
import CreateArtwork from './pages/CreateArtwork';
import CreateArtblog from './pages/CreateArtblog';
import CreateAnnouncement from './pages/CreateAnnouncement';
import ArtworkDetailPage from './pages/ArtworkDetailPage';
import SavedItems from './pages/SavedItems';
import UpdateProfile from './pages/UpdateProfile';


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
      <Route path="/createartwork" element={<CreateArtwork />} />
      <Route path="/createartblog" element={<CreateArtblog />} />
      <Route path="/createannouncement" element={<CreateAnnouncement />} />
      <Route path="/artwork/:artworkId" element={<ArtworkDetailPage />} />
      <Route path="/saved-items" element={<SavedItems />} />
      <Route path="/update-profile" element={<UpdateProfile />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
