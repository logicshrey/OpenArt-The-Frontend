import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Play, Menu, X } from 'lucide-react';
import UserProfile from './UserProfile';

const ArtworksPage = () => {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://openart.onrender.com/openart/api/artworks/get_artworks_by_content_choice', {
          credentials: 'include',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch artworks');
        }
        
        const data = await response.json();
        setArtworks(data.data.artworks);
        setError(null);
      } catch (err) {
        setError(err.message);
        setArtworks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoadingProfile(true);
      const response = await fetch('https://openart.onrender.com/openart/api/users/get-account-details', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      setUserData(data.data);
      setIsProfileOpen(true);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const response = await fetch('https://openart.onrender.com/openart/api/users/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        window.location.href = '/login';
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to logout. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleArtworkClick = (artworkId) => {
    navigate(`/artwork/${artworkId}`);
  };

  const isVideoFile = (url) => {
    const videoExtensions = ['.mp4', '.webm', '.mov'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  const renderContent = (artwork) => {
    const isVideo = isVideoFile(artwork.contentFile);

    return (
      <div className="relative aspect-square bg-gray-900">
        {isVideo ? (
          <div className="relative w-full h-full">
            <video
              src={artwork.contentFile}
              className="object-cover w-full h-full rounded-lg transition-transform duration-300 group-hover:scale-105"
              loop
              muted
              playsInline
              onMouseOver={(e) => e.target.play()}
              onMouseOut={(e) => e.target.pause()}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="w-12 h-12 text-white opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ) : (
          <img
            src={artwork.contentFile}
            alt={artwork.title}
            className="object-cover w-full h-full rounded-lg transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <h3 className="text-white font-semibold">{artwork.title}</h3>
          <div className="flex items-center gap-4 mt-2 text-sm text-white/80">
            <span>Likes: {artwork.likesCount}</span>
            <span>Comments: {artwork.commentsCount}</span>
          </div>
          <p className="text-white/80 text-sm mt-1">
            By: {artwork.owner?.username || 'Unknown Artist'}
          </p>
        </div>
      </div>
    );
  };

  const MobileNavMenu = () => (
    <div className={`fixed inset-0 z-50 bg-black ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
      <div className="flex justify-between items-center p-6">
        <div className="text-2xl font-bold">OpenArt</div>
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="text-white"
        >
          <X className="w-8 h-8" />
        </button>
      </div>
      <div className="flex flex-col items-center space-y-6 mt-12">
        <a href="/artblogs" className="text-xl" onClick={() => setIsMobileMenuOpen(false)}>Artblogs</a>
        <a href="/artverse" className="text-xl" onClick={() => setIsMobileMenuOpen(false)}>Artverse</a>
        <a href="https://artsandculture.google.com/category/artist" className="text-xl" onClick={() => setIsMobileMenuOpen(false)}>Artists</a>
        <a href="https://artsocietyofindia.org" className="text-xl" onClick={() => setIsMobileMenuOpen(false)}>Community</a>
        <a href="/createartwork" className="text-xl" onClick={() => setIsMobileMenuOpen(false)}>Create Artwork</a>
        
        <button
          onClick={() => {
            fetchUserProfile();
            setIsMobileMenuOpen(false);
          }}
          disabled={loadingProfile}
          className="w-16 h-16 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-white hover:opacity-80 transition-opacity"
        >
          {userData?.avatar ? (
            <img
              src={userData.avatar}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-600 flex items-center justify-center">
              <span className="text-white text-sm">
                {loadingProfile ? '...' : 'P'}
              </span>
            </div>
          )}
        </button>
        
        <button 
          onClick={() => {
            handleLogout();
            setIsMobileMenuOpen(false);
          }}
          disabled={isLoggingOut}
          className="rounded-full border border-white px-6 py-2 hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6">
        <div className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>OpenArt</div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a href="/artblogs" className="hover:text-gray-300">Artblogs</a>
          <a href="/artverse" className="hover:text-gray-300">Artverse</a>
          <a href="https://artsandculture.google.com/category/artist" className="hover:text-gray-300">Artists</a>
          <a href="https://artsocietyofindia.org" className="hover:text-gray-300">Community</a>
          <a href="/createartwork" className="hover:text-gray-300">Create Artwork</a>
          
          <button
            onClick={fetchUserProfile}
            disabled={loadingProfile}
            className="w-12 h-12 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-white hover:opacity-80 transition-opacity"
          >
            {userData?.avatar ? (
              <img
                src={userData.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                <span className="text-white text-sm">
                  {loadingProfile ? '...' : 'P'}
                </span>
              </div>
            )}
          </button>
          
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="rounded-full border border-white px-6 py-2 hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>

        {/* Mobile Navigation Hamburger */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-white"
          >
            <Menu className="w-8 h-8" />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <MobileNavMenu />

      {userData && (
        <UserProfile
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          userData={userData}
        />
      )}

      <div className="text-center py-20">
        <h1 className="text-6xl font-bold mb-6">Artworks</h1>
        <p className="text-xl max-w-2xl mx-auto px-4">
          Welcome to the world of art. Here, you'll discover artists and artworks of all forms, each telling a unique story. Explore and immerse yourself in this vibrant artistic journey.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artworks.map((artwork) => (
              <Card 
                key={artwork._id} 
                className="bg-transparent border-0 overflow-hidden group cursor-pointer"
                onClick={() => handleArtworkClick(artwork._id)}
              >
                <CardContent className="p-0">
                  {renderContent(artwork)}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtworksPage;


// import React, { useState, useEffect } from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { useNavigate } from 'react-router-dom';
// import { Play } from 'lucide-react';
// import UserProfile from './UserProfile';

// const ArtworksPage = () => {
//   const navigate = useNavigate();
//   const [artworks, setArtworks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [userData, setUserData] = useState(null);
//   const [loadingProfile, setLoadingProfile] = useState(false);

//   useEffect(() => {
//     const fetchArtworks = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch('https://openart.onrender.com/openart/api/artworks/get_artworks_by_content_choice', {
//           credentials: 'include',
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         });
        
//         if (!response.ok) {
//           throw new Error('Failed to fetch artworks');
//         }
        
//         const data = await response.json();
//         setArtworks(data.data.artworks);
//         setError(null);
//       } catch (err) {
//         setError(err.message);
//         setArtworks([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchArtworks();
//   }, []);

//   const fetchUserProfile = async () => {
//     try {
//       setLoadingProfile(true);
//       const response = await fetch('https://openart.onrender.com/openart/api/users/get-account-details', {
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch user profile');
//       }

//       const data = await response.json();
//       setUserData(data.data);
//       setIsProfileOpen(true);
//     } catch (error) {
//       console.error('Error fetching profile:', error);
//     } finally {
//       setLoadingProfile(false);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       setIsLoggingOut(true);
//       const response = await fetch('https://openart.onrender.com/openart/api/users/logout', {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.ok) {
//         window.location.href = '/login';
//       } else {
//         throw new Error('Logout failed');
//       }
//     } catch (error) {
//       console.error('Logout error:', error);
//       setError('Failed to logout. Please try again.');
//     } finally {
//       setIsLoggingOut(false);
//     }
//   };

//   const handleArtworkClick = (artworkId) => {
//     navigate(`/artwork/${artworkId}`);
//   };

//   const isVideoFile = (url) => {
//     const videoExtensions = ['.mp4', '.webm', '.mov'];
//     return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
//   };

//   const renderContent = (artwork) => {
//     const isVideo = isVideoFile(artwork.contentFile);

//     return (
//       <div className="relative aspect-square bg-gray-900">
//         {isVideo ? (
//           <div className="relative w-full h-full">
//             <video
//               src={artwork.contentFile}
//               className="object-cover w-full h-full rounded-lg transition-transform duration-300 group-hover:scale-105"
//               loop
//               muted
//               playsInline
//               onMouseOver={(e) => e.target.play()}
//               onMouseOut={(e) => e.target.pause()}
//             />
//             <div className="absolute inset-0 flex items-center justify-center">
//               <Play className="w-12 h-12 text-white opacity-50 group-hover:opacity-100 transition-opacity" />
//             </div>
//           </div>
//         ) : (
//           <img
//             src={artwork.contentFile}
//             alt={artwork.title}
//             className="object-cover w-full h-full rounded-lg transition-transform duration-300 group-hover:scale-105"
//           />
//         )}
//         <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
//           <h3 className="text-white font-semibold">{artwork.title}</h3>
//           <div className="flex items-center gap-4 mt-2 text-sm text-white/80">
//             <span>Likes: {artwork.likesCount}</span>
//             <span>Comments: {artwork.commentsCount}</span>
//           </div>
//           <p className="text-white/80 text-sm mt-1">
//             By: {artwork.owner?.username || 'Unknown Artist'}
//           </p>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-black text-white">
//       {/* Navigation */}
//       <nav className="flex items-center justify-between p-6">
//         <div className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>OpenArt</div>
//         <div className="flex items-center gap-8">
//           <a href="/artblogs" className="hover:text-gray-300">Artblogs</a>
//           <a href="/artverse" className="hover:text-gray-300">Artverse</a>
//           <a href="https://artsandculture.google.com/category/artist" className="hover:text-gray-300">Artists</a>
//           <a href="https://artsocietyofindia.org" className="hover:text-gray-300">Community</a>
//           <a href="/createartwork" className="hover:text-gray-300">Create Artwork</a>
          
//           <button
//             onClick={fetchUserProfile}
//             disabled={loadingProfile}
//             className="w-12 h-12 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-white hover:opacity-80 transition-opacity"
//           >
//             {userData?.avatar ? (
//               <img
//                 src={userData.avatar}
//                 alt="Profile"
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <div className="w-full h-full bg-gray-600 flex items-center justify-center">
//                 <span className="text-white text-sm">
//                   {loadingProfile ? '...' : 'P'}
//                 </span>
//               </div>
//             )}
//           </button>
          
//           <button 
//             onClick={handleLogout}
//             disabled={isLoggingOut}
//             className="rounded-full border border-white px-6 py-2 hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isLoggingOut ? 'Logging out...' : 'Logout'}
//           </button>
//         </div>
//       </nav>

//       {userData && (
//         <UserProfile
//           isOpen={isProfileOpen}
//           onClose={() => setIsProfileOpen(false)}
//           userData={userData}
//         />
//       )}

//       <div className="text-center py-20">
//         <h1 className="text-6xl font-bold mb-6">Artworks</h1>
//         <p className="text-xl max-w-2xl mx-auto">
//           Welcome to the world of art. Here, you'll discover artists and artworks of all forms, each telling a unique story. Explore and immerse yourself in this vibrant artistic journey.
//         </p>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 pb-20">
//         {loading ? (
//           <div className="text-center py-12">
//             <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
//           </div>
//         ) : error ? (
//           <div className="text-center py-12 text-red-500">
//             {error}
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {artworks.map((artwork) => (
//               <Card 
//                 key={artwork._id} 
//                 className="bg-transparent border-0 overflow-hidden group cursor-pointer"
//                 onClick={() => handleArtworkClick(artwork._id)}
//               >
//                 <CardContent className="p-0">
//                   {renderContent(artwork)}
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ArtworksPage;