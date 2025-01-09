import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Heart, Share2 } from 'lucide-react';
import UserProfile from './UserProfile';

const ArtblogsPage = () => {
  const navigate = useNavigate();
  const [artblogs, setArtblogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    const fetchArtblogs = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/openart/api/artblogs/get_artblogs_by_content_choice', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch artblogs');
        }
        
        const data = await response.json();
        setArtblogs(data.data.artblogs);
        setError(null);
      } catch (err) {
        setError(err.message);
        setArtblogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArtblogs();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoadingProfile(true);
      const response = await fetch('http://localhost:8000/openart/api/users/get-account-details', {
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
      const response = await fetch('http://localhost:8000/openart/api/users/logout', {
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6">
        <div className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>OpenArt</div>
        <div className="flex items-center gap-8">
          <a href="/artworks" className="hover:text-gray-300">Artworks</a>
          <a href="/artverse" className="hover:text-gray-300">Artverse</a>
          <a href="#artists" className="hover:text-gray-300">Artists</a>
          <a href="#community" className="hover:text-gray-300">Community</a>
          <a href="#createartblog" className="hover:text-gray-300">Create Artblog</a>
          
          {/* Profile Avatar Button */}
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
      </nav>

      {/* User Profile Modal */}
      {userData && (
        <UserProfile
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          userData={userData}
        />
      )}

      {/* Hero Section */}
      <div className="text-center py-20">
        <h1 className="text-6xl font-bold mb-6">Artblogs</h1>
        <p className="text-xl max-w-2xl mx-auto">
          Discover the written expression of art. Here, artists share their thoughts, stories, and inspirations through words. Join the conversation and immerse yourself in their creative narratives.
        </p>
      </div>

      {/* Artblogs Feed */}
      <div className="max-w-3xl mx-auto px-6 pb-20">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            {error}
          </div>
        ) : (
          <div className="space-y-6">
            {artblogs.map((blog) => (
              <Card key={blog._id} className="bg-transparent border border-gray-800 hover:border-gray-700 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={blog.owner?.avatar || '/api/placeholder/40/40'}
                      alt={blog.owner?.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{blog.owner?.fullName}</span>
                        <span className="text-gray-500">@{blog.owner?.username}</span>
                        <span className="text-gray-500">·</span>
                        <span className="text-gray-500">{formatDate(blog.createdAt)}</span>
                      </div>
                      <h3 className="text-xl font-semibold mt-2">{blog.title}</h3>
                      <p className="mt-2 text-gray-300 whitespace-pre-wrap">{blog.content}</p>
                      <div className="flex items-center gap-6 mt-4 text-gray-400">
                        <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
                          <Heart size={20} />
                          <span>{blog.likesCount}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                          <MessageCircle size={20} />
                          <span>{blog.commentsCount}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-green-500 transition-colors">
                          <Share2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtblogsPage;


// import React, { useState, useEffect } from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { useNavigate } from 'react-router-dom';
// import { MessageCircle, Heart, Share2 } from 'lucide-react';

// const ArtblogsPage = () => {
//   const navigate = useNavigate();
//   const [artblogs, setArtblogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isLoggingOut, setIsLoggingOut] = useState(false);

//   useEffect(() => {
//     const fetchArtblogs = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch('http://localhost:8000/openart/api/artblogs/get_artblogs_by_content_choice', {
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         });
        
//         if (!response.ok) {
//           throw new Error('Failed to fetch artblogs');
//         }
        
//         const data = await response.json();
//         setArtblogs(data.data.artblogs);
//         setError(null);
//       } catch (err) {
//         setError(err.message);
//         setArtblogs([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchArtblogs();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       setIsLoggingOut(true);
//       const response = await fetch('http://localhost:8000/openart/api/users/logout', {
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

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   return (
//     <div className="min-h-screen bg-black text-white">
//       {/* Navigation */}
//       <nav className="flex items-center justify-between p-6">
//         <div className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>OpenArt</div>
//         <div className="flex items-center gap-8">
//           <a href="/artworks" className="hover:text-gray-300">Artworks</a>
//           <a href="#artists" className="hover:text-gray-300">Artists</a>
//           <a href="#artverse" className="hover:text-gray-300">Artverse</a>
//           <a href="#community" className="hover:text-gray-300">Community</a>
//           {/* <a href="#more" className="hover:text-gray-300">More</a> */}
//           <a href="#createartblog" className="hover:text-gray-300">Create Artblog</a> 
//           <button 
//             onClick={handleLogout}
//             disabled={isLoggingOut}
//             className="rounded-full border border-white px-6 py-2 hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isLoggingOut ? 'Logging out...' : 'Logout'}
//           </button>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <div className="text-center py-20">
//         <h1 className="text-6xl font-bold mb-6">Artblogs</h1>
//         <p className="text-xl max-w-2xl mx-auto">
//           Discover the written expression of art. Here, artists share their thoughts, stories, and inspirations through words. Join the conversation and immerse yourself in their creative narratives.
//         </p>
//       </div>

//       {/* Artblogs Feed */}
//       <div className="max-w-3xl mx-auto px-6 pb-20">
//         {loading ? (
//           <div className="text-center py-12">
//             <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
//           </div>
//         ) : error ? (
//           <div className="text-center py-12 text-red-500">
//             {error}
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {artblogs.map((blog) => (
//               <Card key={blog._id} className="bg-transparent border border-gray-800 hover:border-gray-700 transition-colors">
//                 <CardContent className="p-6">
//                   <div className="flex items-start gap-4">
//                     <img
//                       src={blog.owner?.avatar || '/api/placeholder/40/40'}
//                       alt={blog.owner?.username}
//                       className="w-12 h-12 rounded-full object-cover"
//                     />
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2">
//                         <span className="font-semibold">{blog.owner?.fullName}</span>
//                         <span className="text-gray-500">@{blog.owner?.username}</span>
//                         <span className="text-gray-500">·</span>
//                         <span className="text-gray-500">{formatDate(blog.createdAt)}</span>
//                       </div>
//                       <h3 className="text-xl font-semibold mt-2">{blog.title}</h3>
//                       <p className="mt-2 text-gray-300 whitespace-pre-wrap">{blog.content}</p>
//                       <div className="flex items-center gap-6 mt-4 text-gray-400">
//                         <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
//                           <Heart size={20} />
//                           <span>{blog.likesCount}</span>
//                         </button>
//                         <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
//                           <MessageCircle size={20} />
//                           <span>{blog.commentsCount}</span>
//                         </button>
//                         <button className="flex items-center gap-2 hover:text-green-500 transition-colors">
//                           <Share2 size={20} />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ArtblogsPage;