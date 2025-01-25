import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Heart, Share2, Trash2, Bookmark } from 'lucide-react';
import UserProfile from './UserProfile';

const ArtversePage = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [activeCommentAnnouncement, setActiveCommentAnnouncement] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState({});

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://openart.onrender.com/openart/api/announcements/get_announcements_by_content_choice', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch announcements');
        }
        
        const data = await response.json();
        setAnnouncements(data.data.announcements);
        setError(null);
      } catch (err) {
        setError(err.message);
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const fetchComments = async (announcementId) => {
    try {
      const response = await fetch(
        `https://openart.onrender.com/openart/api/comments/get_comments_of_announcement/${announcementId}`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      setComments(prev => ({
        ...prev,
        [announcementId]: data.data.comments
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async (announcementId) => {
    try {
      const announcement = announcements.find(a => a._id === announcementId);
      const isLiked = announcement.isLiked;
      
      const url = isLiked
        ? `https://openart.onrender.com/openart/api/likes/unlike_announcement/${announcementId}`
        : `https://openart.onrender.com/openart/api/likes/add_like_to_announcement/${announcementId}`;
      
      const response = await fetch(url, {
        method: isLiked ? 'DELETE' : 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to toggle like');

      setAnnouncements(prev => prev.map(announcement => {
        if (announcement._id === announcementId) {
          return {
            ...announcement,
            isLiked: !isLiked,
            likesCount: isLiked ? announcement.likesCount - 1 : announcement.likesCount + 1
          };
        }
        return announcement;
      }));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleSave = async (announcementId) => {
    try {
      const announcement = announcements.find(a => a._id === announcementId);
      const isSaved = announcement.isSaved;
      
      const url = isSaved
        ? `https://openart.onrender.com/openart/api/savedannouncements/unsave_announcement/${announcementId}`
        : `https://openart.onrender.com/openart/api/savedannouncements/save_announcement/${announcementId}`;
      
      const response = await fetch(url, {
        method: isSaved ? 'DELETE' : 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to toggle save');

      setAnnouncements(prev => prev.map(announcement => {
        if (announcement._id === announcementId) {
          return {
            ...announcement,
            isSaved: !isSaved
          };
        }
        return announcement;
      }));
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  const handleAddComment = async (announcementId) => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(
        `https://openart.onrender.com/openart/api/comments/add_comment_to_announcement/${announcementId}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ content: newComment })
        }
      );

      if (!response.ok) throw new Error('Failed to add comment');

      setNewComment('');
      fetchComments(announcementId);
      setAnnouncements(prev => prev.map(announcement => {
        if (announcement._id === announcementId) {
          return {
            ...announcement,
            commentsCount: announcement.commentsCount + 1
          };
        }
        return announcement;
      }));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (announcementId, commentId) => {
    try {
      const response = await fetch(
        `https://openart.onrender.com/openart/api/comments/delete_comment/${commentId}`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error('Failed to delete comment');

      fetchComments(announcementId);
      setAnnouncements(prev => prev.map(announcement => {
        if (announcement._id === announcementId) {
          return {
            ...announcement,
            commentsCount: announcement.commentsCount - 1
          };
        }
        return announcement;
      }));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleShare = async (announcement) => {
    const shareData = {
      title: announcement.title,
      text: announcement.description.substring(0, 100) + '...',
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleProfileNavigation = (profileId) => {
    navigate(`/profile/${profileId}`);
  };

    return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6">
        <div className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>OpenArt</div>
        <div className="flex items-center gap-8">
          <a href="/artworks" className="hover:text-gray-300">Artworks</a>
          <a href="/artblogs" className="hover:text-gray-300">Artblogs</a>
          <a href="https://artsandculture.google.com/category/artist" className="hover:text-gray-300">Artists</a>
          <a href="https://artsocietyofindia.org" className="hover:text-gray-300">Community</a>
          <a href="/createannouncement" className="hover:text-gray-300">Create Announcement</a>
          
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
        <h1 className="text-6xl font-bold mb-6">Artverse</h1>
        <p className="text-xl max-w-2xl mx-auto">
          Discover exciting opportunities and announcements from artists around the world. Connect, collaborate, and create together in this vibrant artistic community.
        </p>
      </div>

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
            {announcements.map((announcement) => (
              <Card key={announcement._id} className="bg-transparent border border-gray-800 hover:border-gray-700 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={announcement.owner?.avatar || '/api/placeholder/40/40'}
                      alt={announcement.owner?.username}
                      className="w-12 h-12 rounded-full object-cover cursor-pointer"
                      onClick={() => handleProfileNavigation(announcement.owner?._id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{announcement.owner?.fullName}</span>
                        <span className="text-gray-500">@{announcement.owner?.username}</span>
                        <span className="text-gray-500">·</span>
                        <span className="text-gray-500">{formatDate(announcement.createdAt)}</span>
                      </div>
                      <div className="mt-2">
                        <span className="px-2 py-1 bg-gray-800 rounded-full text-sm">{announcement.category}</span>
                      </div>
                      <h3 className="text-xl font-semibold mt-2">{announcement.title}</h3>
                      <p className="mt-2 text-gray-300 whitespace-pre-wrap">{announcement.description}</p>
                      {announcement.image && (
                        <img 
                          src={announcement.image} 
                          alt={announcement.title}
                          className="mt-4 rounded-lg w-full object-cover max-h-96"
                        />
                      )}
                      
                      <div className="flex items-center gap-6 mt-4 text-gray-400">
                        <button 
                          onClick={() => handleLike(announcement._id)}
                          className={`flex items-center gap-2 transition-colors ${
                            announcement.isLiked ? 'text-red-500' : 'hover:text-red-500'
                          }`}
                        >
                          <Heart size={20} fill={announcement.isLiked ? "currentColor" : "none"} />
                          <span>{announcement.likesCount}</span>
                        </button>
                        
                        <button 
                          onClick={() => {
                            if (activeCommentAnnouncement === announcement._id) {
                              setActiveCommentAnnouncement(null);
                            } else {
                              setActiveCommentAnnouncement(announcement._id);
                              fetchComments(announcement._id);
                            }
                          }}
                          className="flex items-center gap-2 hover:text-blue-500 transition-colors"
                        >
                          <MessageCircle size={20} />
                          <span>{announcement.commentsCount}</span>
                        </button>

                        <button
                          onClick={() => handleSave(announcement._id)}
                          className={`flex items-center gap-2 ${
                            announcement.isSaved ? 'text-yellow-500' : 'text-white/80'
                          } hover:text-yellow-500 transition-colors`}
                        >
                          <Bookmark size={20} fill={announcement.isSaved ? "currentColor" : "none"} />
                          <span>Save</span>
                        </button>
                        
                        <button 
                          onClick={() => handleShare(announcement)}
                          className="flex items-center gap-2 hover:text-green-500 transition-colors"
                        >
                          <Share2 size={20} />
                          <span>Share</span>
                        </button>
                      </div>

                      {activeCommentAnnouncement === announcement._id && (
                        <div className="mt-4 space-y-4">
                          <form 
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleAddComment(announcement._id);
                            }}
                            className="flex gap-2"
                          >
                            <input
                              type="text"
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Add a comment..."
                              className="flex-1 bg-transparent border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-500"
                            />
                            <button
                              type="submit"
                              disabled={!newComment.trim()}
                              className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                            >
                              Post
                            </button>
                          </form>

                          <div className="space-y-3 max-h-60 overflow-y-auto">
                            {comments[announcement._id]?.map((comment) => (
                              <div key={comment._id} className="flex items-start justify-between bg-gray-900 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                  <img
                                    src={comment.owner.avatar}
                                    alt={comment.owner.username}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                  <div>
                                    <p className="font-semibold text-sm">{comment.owner.username}</p>
                                    <p className="text-sm text-gray-300">{comment.content}</p>
                                  </div>
                                </div>
                                {comment.deletionFlag && (
                                  <button
                                    onClick={() => handleDeleteComment(announcement._id, comment._id)}
                                    className="text-gray-500 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
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

export default ArtversePage;

  



// import React, { useState, useEffect } from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { useNavigate } from 'react-router-dom';
//  import { MessageCircle, Heart, Share2 } from 'lucide-react';
//  import UserProfile from './UserProfile';

// const ArtversePage = () => {
//   const navigate = useNavigate();
//   const [announcements, setAnnouncements] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [userData, setUserData] = useState(null);
//   const [loadingProfile, setLoadingProfile] = useState(false);

//   useEffect(() => {
//     const fetchAnnouncements = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch('http://localhost:8000/openart/api/announcements/get_announcements_by_content_choice', {
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         });
        
//         if (!response.ok) {
//           throw new Error('Failed to fetch announcements');
//         }
        
//         const data = await response.json();
//         setAnnouncements(data.data.announcements);
//         setError(null);
//       } catch (err) {
//         setError(err.message);
//         setAnnouncements([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAnnouncements();
//   }, []);

//   const fetchUserProfile = async () => {
//     try {
//       setLoadingProfile(true);
//       const response = await fetch('http://localhost:8000/openart/api/users/get-account-details', {
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
//           <a href="/artblogs" className="hover:text-gray-300">Artblogs</a>
//           <a href="#artists" className="hover:text-gray-300">Artists</a>
//           <a href="#community" className="hover:text-gray-300">Community</a>
//           <a href="/createannouncement" className="hover:text-gray-300">Create Announcement</a>
          
//           {/* Profile Avatar Button */}
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

//       {/* User Profile Modal */}
//       {userData && (
//         <UserProfile
//           isOpen={isProfileOpen}
//           onClose={() => setIsProfileOpen(false)}
//           userData={userData}
//         />
//       )}

//       {/* Hero Section */}
//       <div className="text-center py-20">
//         <h1 className="text-6xl font-bold mb-6">Artverse</h1>
//         <p className="text-xl max-w-2xl mx-auto">
//           Discover exciting opportunities and announcements from artists around the world. Connect, collaborate, and create together in this vibrant artistic community.
//         </p>
//       </div>

//       {/* Announcements Feed */}
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
//             {announcements.map((announcement) => (
//               <Card key={announcement._id} className="bg-transparent border border-gray-800 hover:border-gray-700 transition-colors">
//                 <CardContent className="p-6">
//                   <div className="flex items-start gap-4">
//                     <img
//                       src={announcement.owner?.avatar || '/api/placeholder/40/40'}
//                       alt={announcement.owner?.username}
//                       className="w-12 h-12 rounded-full object-cover"
//                     />
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2">
//                         <span className="font-semibold">{announcement.owner?.fullName}</span>
//                         <span className="text-gray-500">@{announcement.owner?.username}</span>
//                         <span className="text-gray-500">·</span>
//                         <span className="text-gray-500">{formatDate(announcement.createdAt)}</span>
//                       </div>
//                       <div className="mt-2">
//                         <span className="px-2 py-1 bg-gray-800 rounded-full text-sm">{announcement.category}</span>
//                       </div>
//                       <h3 className="text-xl font-semibold mt-2">{announcement.title}</h3>
//                       <p className="mt-2 text-gray-300 whitespace-pre-wrap">{announcement.description}</p>
//                       {announcement.image && (
//                         <img 
//                           src={announcement.image} 
//                           alt={announcement.title}
//                           className="mt-4 rounded-lg w-full object-cover max-h-96"
//                         />
//                       )}
//                       <div className="flex items-center gap-6 mt-4 text-gray-400">
//                         <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
//                           <Heart size={20} />
//                           <span>{announcement.likesCount}</span>
//                         </button>
//                         <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
//                           <MessageCircle size={20} />
//                           <span>{announcement.commentsCount}</span>
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

// export default ArtversePage;