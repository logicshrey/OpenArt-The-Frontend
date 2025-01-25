import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Heart, Share2, Trash2, Bookmark, Menu, X, ArrowRight } from 'lucide-react';
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
  const [activeCommentBlog, setActiveCommentBlog] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // New state for blog expansion and full view
  const [expandedBlogs, setExpandedBlogs] = useState({});
  const [fullViewBlog, setFullViewBlog] = useState(null);

  // New method to handle full blog view
  const handleFullBlogView = (blog) => {
    setFullViewBlog(blog);
    // Optional: you could also use navigation if preferred
    // navigate(`/artblog/${blog._id}`);
  };

   
  useEffect(() => {
    const fetchArtblogs = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://openart.onrender.com/openart/api/artblogs/get_artblogs_by_content_choice', {
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

  const fetchComments = async (blogId) => {
        try {
          const response = await fetch(
            `https://openart.onrender.com/openart/api/comments/get_comments_of_artblog/${blogId}`,
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
            [blogId]: data.data.comments
          }));
        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      };
    
      const handleLike = async (blogId) => {
        try {
          const blog = artblogs.find(b => b._id === blogId);
          const isLiked = blog.isLiked;
          
          const url = isLiked
            ? `https://openart.onrender.com/openart/api/likes/unlike_artblog/${blogId}`
            : `https://openart.onrender.com/openart/api/likes/add_like_to_artblog/${blogId}`;
          
          const response = await fetch(url, {
            method: isLiked ? 'DELETE' : 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
          });
    
          if (!response.ok) throw new Error('Failed to toggle like');
    
          setArtblogs(prev => prev.map(blog => {
            if (blog._id === blogId) {
              return {
                ...blog,
                isLiked: !isLiked,
                likesCount: isLiked ? blog.likesCount - 1 : blog.likesCount + 1
              };
            }
            return blog;
          }));
        } catch (error) {
          console.error('Error toggling like:', error);
        }
      };
    
      const handleSave = async (blogId) => {
        try {
          const blog = artblogs.find(b => b._id === blogId);
          const isSaved = blog.isSaved;
          
          const url = isSaved
            ? `https://openart.onrender.com/openart/api/savedartblogs/unsave_artblog/${blogId}`
            : `https://openart.onrender.com/openart/api/savedartblogs/save_artblog/${blogId}`;
          
          const response = await fetch(url, {
            method: isSaved ? 'DELETE' : 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
          });
    
          if (!response.ok) throw new Error('Failed to toggle save');
    
          setArtblogs(prev => prev.map(blog => {
            if (blog._id === blogId) {
              return {
                ...blog,
                isSaved: !isSaved
              };
            }
            return blog;
          }));
        } catch (error) {
          console.error('Error toggling save:', error);
        }
      };
    
      const handleAddComment = async (blogId) => {
        if (!newComment.trim()) return;
    
        try {
          const response = await fetch(
            `https://openart.onrender.com/openart/api/comments/add_comment_to_artblog/${blogId}`,
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
          fetchComments(blogId);
          setArtblogs(prev => prev.map(blog => {
            if (blog._id === blogId) {
              return {
                ...blog,
                commentsCount: blog.commentsCount + 1
              };
            }
            return blog;
          }));
        } catch (error) {
          console.error('Error adding comment:', error);
        }
      };
    
      const handleDeleteComment = async (blogId, commentId) => {
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
    
          fetchComments(blogId);
          setArtblogs(prev => prev.map(blog => {
            if (blog._id === blogId) {
              return {
                ...blog,
                commentsCount: blog.commentsCount - 1
              };
            }
            return blog;
          }));
        } catch (error) {
          console.error('Error deleting comment:', error);
        }
      };
    
      const handleShare = async (blog) => {
        const shareData = {
          title: blog.title,
          text: blog.content.substring(0, 100) + '...',
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
        <a href="/artworks" className="text-xl" onClick={() => setIsMobileMenuOpen(false)}>Artworks</a>
        <a href="/artverse" className="text-xl" onClick={() => setIsMobileMenuOpen(false)}>Artverse</a>
        <a href="https://artsandculture.google.com/category/artist" className="text-xl" onClick={() => setIsMobileMenuOpen(false)}>Artists</a>
        <a href="https://artsocietyofindia.org" className="text-xl" onClick={() => setIsMobileMenuOpen(false)}>Community</a>
        <a href="/createartblog" className="text-xl" onClick={() => setIsMobileMenuOpen(false)}>Create Artblog</a>
        
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

  // Modify formatDate to include time for full view
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Close full blog view method
  const closeFullBlogView = () => {
    setFullViewBlog(null);
  };

  // Full Blog View Modal Component
  const FullBlogView = ({ blog, onClose }) => {
    if (!blog) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-90 overflow-y-auto">
        <div className="relative max-w-2xl mx-auto my-10 bg-gray-900 rounded-lg p-6">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="flex items-start gap-4 mb-6">
            <img
              src={blog.owner?.avatar || '/api/placeholder/40/40'}
              alt={blog.owner?.username}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold">{blog.owner?.fullName}</span>
                <span className="text-gray-500">@{blog.owner?.username}</span>
              </div>
              <span className="text-gray-500 text-xs">{formatDate(blog.createdAt)}</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4">{blog.title}</h2>
          <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
            {blog.content}
          </p>

          <div className="mt-6 flex items-center gap-4 text-gray-400">
            <button 
              onClick={() => handleLike(blog._id)}
              className={`flex items-center gap-2 transition-colors ${
                blog.isLiked ? 'text-red-500' : 'hover:text-red-500'
              }`}
            >
              <Heart size={18} fill={blog.isLiked ? "currentColor" : "none"} />
              <span>{blog.likesCount}</span>
            </button>
            
            <button
              onClick={() => handleSave(blog._id)}
              className={`flex items-center gap-2 ${
                blog.isSaved ? 'text-yellow-500' : 'text-white/80'
              } hover:text-yellow-500 transition-colors`}
            >
              <Bookmark size={18} fill={blog.isSaved ? "currentColor" : "none"} />
              <span>Save</span>
            </button>
            
            <button 
              onClick={() => handleShare(blog)}
              className="flex items-center gap-2 hover:text-green-500 transition-colors"
            >
              <Share2 size={18} />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
  
      
       <nav className="flex items-center justify-between p-6">
         <div className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>OpenArt</div>
        
       
         <div className="hidden md:flex items-center gap-8">
           <a href="/artworks" className="hover:text-gray-300">Artworks</a>
           <a href="/artverse" className="hover:text-gray-300">Artverse</a>
           <a href="https://artsandculture.google.com/category/artist" className="hover:text-gray-300">Artists</a>
           <a href="https://artsocietyofindia.org" className="hover:text-gray-300">Community</a>
           <a href="/createartblog" className="hover:text-gray-300">Create Artblog</a>
          
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
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Artblogs</h1>
        <p className="text-base md:text-xl max-w-2xl mx-auto px-4 text-center">
          Discover the written expression of art. Here, artists share their thoughts, stories, and inspirations through words. Join the conversation and immerse yourself in their creative narratives.
        </p>
      </div>

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 pb-20">
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
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start gap-3 md:gap-4">
                    <img
                      src={blog.owner?.avatar || '/api/placeholder/40/40'}
                      alt={blog.owner?.username}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover cursor-pointer"
                      onClick={() => handleProfileNavigation(blog.owner?._id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                        <span className="font-semibold truncate">{blog.owner?.fullName}</span>
                        <span className="text-gray-500 truncate">@{blog.owner?.username}</span>
                        <span className="text-gray-500">·</span>
                        <span className="text-gray-500">{formatDate(blog.createdAt)}</span>
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold mt-2">{blog.title}</h3>
                      <p className={`mt-2 text-sm md:text-base text-gray-300 whitespace-pre-wrap ${
                        !expandedBlogs[blog._id] ? 'line-clamp-3' : ''
                      }`}>
                        {blog.content}
                      </p>
                      
                      <div className="flex items-center justify-between mt-4">
                        {blog.content.length > 200 && (
                          <button 
                            onClick={() => setExpandedBlogs(prev => ({
                              ...prev, 
                              [blog._id]: !prev[blog._id]
                            }))}
                            className="text-sm text-blue-400 hover:text-blue-300"
                          >
                            {expandedBlogs[blog._id] ? 'Show Less' : 'Read More'}
                          </button>
                        )}
                        <button
                          onClick={() => handleFullBlogView(blog)}
                          className="text-sm text-blue-500 hover:text-blue-400 flex items-center gap-1"
                        >
                          Full Article <ArrowRight size={16} />
                        </button>
                      </div>

                      <div className="flex items-center gap-4 md:gap-6 mt-4 text-gray-400 text-sm">
                        <button 
                          onClick={() => handleLike(blog._id)}
                          className={`flex items-center gap-2 transition-colors ${
                            blog.isLiked ? 'text-red-500' : 'hover:text-red-500'
                          }`}
                        >
                          <Heart size={18} fill={blog.isLiked ? "currentColor" : "none"} />
                          <span>{blog.likesCount}</span>
                        </button>
                        
                        <button 
                          onClick={() => {
                            if (activeCommentBlog === blog._id) {
                              setActiveCommentBlog(null);
                            } else {
                              setActiveCommentBlog(blog._id);
                              fetchComments(blog._id);
                            }
                          }}
                          className="flex items-center gap-2 hover:text-blue-500 transition-colors"
                        >
                          <MessageCircle size={18} />
                          <span>{blog.commentsCount}</span>
                        </button>

                        <button
                          onClick={() => handleSave(blog._id)}
                          className={`flex items-center gap-2 ${
                            blog.isSaved ? 'text-yellow-500' : 'text-white/80'
                          } hover:text-yellow-500 transition-colors`}
                        >
                          <Bookmark size={18} fill={blog.isSaved ? "currentColor" : "none"} />
                          <span>Save</span>
                        </button>
                        
                        <button 
                          onClick={() => handleShare(blog)}
                          className="flex items-center gap-2 hover:text-green-500 transition-colors"
                        >
                          <Share2 size={18} />
                          <span>Share</span>
                        </button>
                      </div>

                      {activeCommentBlog === blog._id && (
                        <div className="mt-4 space-y-4">
                          {/* Comment Form */}
                          <form 
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleAddComment(blog._id);
                            }}
                            className="flex gap-2"
                          >
                            <input
                              type="text"
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Add a comment..."
                              className="flex-1 bg-transparent border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                            />
                            <button
                              type="submit"
                              disabled={!newComment.trim()}
                              className="px-4 py-2 text-sm bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                            >
                              Post
                            </button>
                          </form>

                          {/* Comments List */}
                          <div className="space-y-3 max-h-60 overflow-y-auto">
                            {comments[blog._id]?.map((comment) => (
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
                                    onClick={() => handleDeleteComment(blog._id, comment._id)}
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

      {/* Full Blog View Modal */}
      {fullViewBlog && (
        <FullBlogView 
          blog={fullViewBlog} 
          onClose={closeFullBlogView} 
        />
      )}
    </div>
  );
};

export default ArtblogsPage;

// import React, { useState, useEffect } from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { useNavigate } from 'react-router-dom';
// import { MessageCircle, Heart, Share2, Trash2, Bookmark, Menu, X } from 'lucide-react';
// import UserProfile from './UserProfile';

// const ArtblogsPage = () => {
//   const navigate = useNavigate();
//   const [artblogs, setArtblogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [userData, setUserData] = useState(null);
//   const [loadingProfile, setLoadingProfile] = useState(false);
//   const [activeCommentBlog, setActiveCommentBlog] = useState(null);
//   const [newComment, setNewComment] = useState('');
//   const [comments, setComments] = useState({});
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   useEffect(() => {
//     const fetchArtblogs = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch('https://openart.onrender.com/openart/api/artblogs/get_artblogs_by_content_choice', {
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

//   const fetchComments = async (blogId) => {
//         try {
//           const response = await fetch(
//             `https://openart.onrender.com/openart/api/comments/get_comments_of_artblog/${blogId}`,
//             {
//               credentials: 'include',
//               headers: {
//                 'Content-Type': 'application/json'
//               }
//             }
//           );
//           if (!response.ok) throw new Error('Failed to fetch comments');
//           const data = await response.json();
//           setComments(prev => ({
//             ...prev,
//             [blogId]: data.data.comments
//           }));
//         } catch (error) {
//           console.error('Error fetching comments:', error);
//         }
//       };
    
//       const handleLike = async (blogId) => {
//         try {
//           const blog = artblogs.find(b => b._id === blogId);
//           const isLiked = blog.isLiked;
          
//           const url = isLiked
//             ? `https://openart.onrender.com/openart/api/likes/unlike_artblog/${blogId}`
//             : `https://openart.onrender.com/openart/api/likes/add_like_to_artblog/${blogId}`;
          
//           const response = await fetch(url, {
//             method: isLiked ? 'DELETE' : 'POST',
//             credentials: 'include',
//             headers: {
//               'Content-Type': 'application/json'
//             }
//           });
    
//           if (!response.ok) throw new Error('Failed to toggle like');
    
//           setArtblogs(prev => prev.map(blog => {
//             if (blog._id === blogId) {
//               return {
//                 ...blog,
//                 isLiked: !isLiked,
//                 likesCount: isLiked ? blog.likesCount - 1 : blog.likesCount + 1
//               };
//             }
//             return blog;
//           }));
//         } catch (error) {
//           console.error('Error toggling like:', error);
//         }
//       };
    
//       const handleSave = async (blogId) => {
//         try {
//           const blog = artblogs.find(b => b._id === blogId);
//           const isSaved = blog.isSaved;
          
//           const url = isSaved
//             ? `https://openart.onrender.com/openart/api/savedartblogs/unsave_artblog/${blogId}`
//             : `https://openart.onrender.com/openart/api/savedartblogs/save_artblog/${blogId}`;
          
//           const response = await fetch(url, {
//             method: isSaved ? 'DELETE' : 'POST',
//             credentials: 'include',
//             headers: {
//               'Content-Type': 'application/json'
//             }
//           });
    
//           if (!response.ok) throw new Error('Failed to toggle save');
    
//           setArtblogs(prev => prev.map(blog => {
//             if (blog._id === blogId) {
//               return {
//                 ...blog,
//                 isSaved: !isSaved
//               };
//             }
//             return blog;
//           }));
//         } catch (error) {
//           console.error('Error toggling save:', error);
//         }
//       };
    
//       const handleAddComment = async (blogId) => {
//         if (!newComment.trim()) return;
    
//         try {
//           const response = await fetch(
//             `https://openart.onrender.com/openart/api/comments/add_comment_to_artblog/${blogId}`,
//             {
//               method: 'POST',
//               credentials: 'include',
//               headers: {
//                 'Content-Type': 'application/json'
//               },
//               body: JSON.stringify({ content: newComment })
//             }
//           );
    
//           if (!response.ok) throw new Error('Failed to add comment');
    
//           setNewComment('');
//           fetchComments(blogId);
//           setArtblogs(prev => prev.map(blog => {
//             if (blog._id === blogId) {
//               return {
//                 ...blog,
//                 commentsCount: blog.commentsCount + 1
//               };
//             }
//             return blog;
//           }));
//         } catch (error) {
//           console.error('Error adding comment:', error);
//         }
//       };
    
//       const handleDeleteComment = async (blogId, commentId) => {
//         try {
//           const response = await fetch(
//             `https://openart.onrender.com/openart/api/comments/delete_comment/${commentId}`,
//             {
//               method: 'DELETE',
//               credentials: 'include',
//               headers: {
//                 'Content-Type': 'application/json'
//               }
//             }
//           );
    
//           if (!response.ok) throw new Error('Failed to delete comment');
    
//           fetchComments(blogId);
//           setArtblogs(prev => prev.map(blog => {
//             if (blog._id === blogId) {
//               return {
//                 ...blog,
//                 commentsCount: blog.commentsCount - 1
//               };
//             }
//             return blog;
//           }));
//         } catch (error) {
//           console.error('Error deleting comment:', error);
//         }
//       };
    
//       const handleShare = async (blog) => {
//         const shareData = {
//           title: blog.title,
//           text: blog.content.substring(0, 100) + '...',
//           url: window.location.href
//         };
    
//         try {
//           if (navigator.share) {
//             await navigator.share(shareData);
//           } else {
//             await navigator.clipboard.writeText(window.location.href);
//           }
//         } catch (error) {
//           console.error('Error sharing:', error);
//         }
//       };
    
//       const fetchUserProfile = async () => {
//         try {
//           setLoadingProfile(true);
//           const response = await fetch('https://openart.onrender.com/openart/api/users/get-account-details', {
//             credentials: 'include',
//             headers: {
//               'Content-Type': 'application/json'
//             }
//           });
    
//           if (!response.ok) {
//             throw new Error('Failed to fetch user profile');
//           }
    
//           const data = await response.json();
//           setUserData(data.data);
//           setIsProfileOpen(true);
//         } catch (error) {
//           console.error('Error fetching profile:', error);
//         } finally {
//           setLoadingProfile(false);
//         }
//       };
    
//       const handleLogout = async () => {
//         try {
//           setIsLoggingOut(true);
//           const response = await fetch('https://openart.onrender.com/openart/api/users/logout', {
//             method: 'POST',
//             credentials: 'include',
//             headers: {
//               'Content-Type': 'application/json'
//             }
//           });
    
//           if (response.ok) {
//             window.location.href = '/login';
//           } else {
//             throw new Error('Logout failed');
//           }
//         } catch (error) {
//           console.error('Logout error:', error);
//           setError('Failed to logout. Please try again.');
//         } finally {
//           setIsLoggingOut(false);
//         }
//       };
    
//       const formatDate = (dateString) => {
//         return new Date(dateString).toLocaleDateString('en-US', {
//           month: 'short',
//           day: 'numeric',
//           year: 'numeric'
//         });
//       };
    
//       const handleProfileNavigation = (profileId) => {
//         navigate(`/profile/${profileId}`);
//       };

//   const MobileNavMenu = () => (
//     <div className={`fixed inset-0 z-50 bg-black ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
//       <div className="flex justify-between items-center p-6">
//         <div className="text-2xl font-bold">OpenArt</div>
//         <button 
//           onClick={() => setIsMobileMenuOpen(false)}
//           className="text-white"
//         >
//           <X className="w-8 h-8" />
//         </button>
//       </div>
//       <div className="flex flex-col items-center space-y-6 mt-12">
//         <a href="/artworks" className="text-xl" onClick={() => setIsMobileMenuOpen(false)}>Artworks</a>
//         <a href="/artverse" className="text-xl" onClick={() => setIsMobileMenuOpen(false)}>Artverse</a>
//         <a href="https://artsandculture.google.com/category/artist" className="text-xl" onClick={() => setIsMobileMenuOpen(false)}>Artists</a>
//         <a href="https://artsocietyofindia.org" className="text-xl" onClick={() => setIsMobileMenuOpen(false)}>Community</a>
//         <a href="/createartblog" className="text-xl" onClick={() => setIsMobileMenuOpen(false)}>Create Artblog</a>
        
//         <button
//           onClick={() => {
//             fetchUserProfile();
//             setIsMobileMenuOpen(false);
//           }}
//           disabled={loadingProfile}
//           className="w-16 h-16 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-white hover:opacity-80 transition-opacity"
//         >
//           {userData?.avatar ? (
//             <img
//               src={userData.avatar}
//               alt="Profile"
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             <div className="w-full h-full bg-gray-600 flex items-center justify-center">
//               <span className="text-white text-sm">
//                 {loadingProfile ? '...' : 'P'}
//               </span>
//             </div>
//           )}
//         </button>
        
//         <button 
//           onClick={() => {
//             handleLogout();
//             setIsMobileMenuOpen(false);
//           }}
//           disabled={isLoggingOut}
//           className="rounded-full border border-white px-6 py-2 hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {isLoggingOut ? 'Logging out...' : 'Logout'}
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-black text-white">
//       {/* Navigation */}
//       <nav className="flex items-center justify-between p-6">
//         <div className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>OpenArt</div>
        
//         {/* Desktop Navigation */}
//         <div className="hidden md:flex items-center gap-8">
//           <a href="/artworks" className="hover:text-gray-300">Artworks</a>
//           <a href="/artverse" className="hover:text-gray-300">Artverse</a>
//           <a href="https://artsandculture.google.com/category/artist" className="hover:text-gray-300">Artists</a>
//           <a href="https://artsocietyofindia.org" className="hover:text-gray-300">Community</a>
//           <a href="/createartblog" className="hover:text-gray-300">Create Artblog</a>
          
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

//         {/* Mobile Navigation Hamburger */}
//         <div className="md:hidden">
//           <button 
//             onClick={() => setIsMobileMenuOpen(true)}
//             className="text-white"
//           >
//             <Menu className="w-8 h-8" />
//           </button>
//         </div>
//       </nav>

//       {/* Mobile Navigation Menu */}
//       <MobileNavMenu />
//       {userData && (
//         <UserProfile
//           isOpen={isProfileOpen}
//           onClose={() => setIsProfileOpen(false)}
//           userData={userData}
//         />
//       )}

      // <div className="text-center py-20">
      //   <h1 className="text-4xl md:text-6xl font-bold mb-6">Artblogs</h1>
      //   <p className="text-base md:text-xl max-w-2xl mx-auto px-4 text-center">
      //     Discover the written expression of art. Here, artists share their thoughts, stories, and inspirations through words. Join the conversation and immerse yourself in their creative narratives.
      //   </p>
      // </div>

//       <div className="max-w-3xl mx-auto px-4 md:px-6 pb-20">
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
//                 <CardContent className="p-4 md:p-6">
//                   <div className="flex items-start gap-3 md:gap-4">
//                     <img
//                       src={blog.owner?.avatar || '/api/placeholder/40/40'}
//                       alt={blog.owner?.username}
//                       className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover cursor-pointer"
//                       onClick={() => handleProfileNavigation(blog.owner?._id)}
//                     />
//                     <div className="flex-1">
//                       <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
//                         <span className="font-semibold truncate">{blog.owner?.fullName}</span>
//                         <span className="text-gray-500 truncate">@{blog.owner?.username}</span>
//                         <span className="text-gray-500">·</span>
//                         <span className="text-gray-500">{formatDate(blog.createdAt)}</span>
//                       </div>
//                       <h3 className="text-lg md:text-xl font-semibold mt-2">{blog.title}</h3>
//                       <p className="mt-2 text-sm md:text-base text-gray-300 whitespace-pre-wrap line-clamp-3">{blog.content}</p>
                      
                      // <div className="flex items-center gap-4 md:gap-6 mt-4 text-gray-400 text-sm">
                      //   <button 
                      //     onClick={() => handleLike(blog._id)}
                      //     className={`flex items-center gap-2 transition-colors ${
                      //       blog.isLiked ? 'text-red-500' : 'hover:text-red-500'
                      //     }`}
                      //   >
                      //     <Heart size={18} fill={blog.isLiked ? "currentColor" : "none"} />
                      //     <span>{blog.likesCount}</span>
                      //   </button>
                        
                      //   <button 
                      //     onClick={() => {
                      //       if (activeCommentBlog === blog._id) {
                      //         setActiveCommentBlog(null);
                      //       } else {
                      //         setActiveCommentBlog(blog._id);
                      //         fetchComments(blog._id);
                      //       }
                      //     }}
                      //     className="flex items-center gap-2 hover:text-blue-500 transition-colors"
                      //   >
                      //     <MessageCircle size={18} />
                      //     <span>{blog.commentsCount}</span>
                      //   </button>

                      //   <button
                      //     onClick={() => handleSave(blog._id)}
                      //     className={`flex items-center gap-2 ${
                      //       blog.isSaved ? 'text-yellow-500' : 'text-white/80'
                      //     } hover:text-yellow-500 transition-colors`}
                      //   >
                      //     <Bookmark size={18} fill={blog.isSaved ? "currentColor" : "none"} />
                      //     <span>Save</span>
                      //   </button>
                        
                      //   <button 
                      //     onClick={() => handleShare(blog)}
                      //     className="flex items-center gap-2 hover:text-green-500 transition-colors"
                      //   >
                      //     <Share2 size={18} />
                      //     <span>Share</span>
                      //   </button>
                      // </div>

                      // {activeCommentBlog === blog._id && (
                      //   <div className="mt-4 space-y-4">
                      //     {/* Comment Form */}
                      //     <form 
                      //       onSubmit={(e) => {
                      //         e.preventDefault();
                      //         handleAddComment(blog._id);
                      //       }}
                      //       className="flex gap-2"
                      //     >
                      //       <input
                      //         type="text"
                      //         value={newComment}
                      //         onChange={(e) => setNewComment(e.target.value)}
                      //         placeholder="Add a comment..."
                      //         className="flex-1 bg-transparent border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                      //       />
                      //       <button
                      //         type="submit"
                      //         disabled={!newComment.trim()}
                      //         className="px-4 py-2 text-sm bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                      //       >
                      //         Post
                      //       </button>
                      //     </form>

                      //     {/* Comments List */}
                      //     <div className="space-y-3 max-h-60 overflow-y-auto">
                      //       {comments[blog._id]?.map((comment) => (
                      //         <div key={comment._id} className="flex items-start justify-between bg-gray-900 rounded-lg p-3">
                      //           <div className="flex items-start gap-2">
                      //             <img
                      //               src={comment.owner.avatar}
                      //               alt={comment.owner.username}
                      //               className="w-8 h-8 rounded-full object-cover"
                      //             />
                      //             <div>
                      //               <p className="font-semibold text-sm">{comment.owner.username}</p>
                      //               <p className="text-sm text-gray-300">{comment.content}</p>
                      //             </div>
                      //           </div>
                      //           {comment.deletionFlag && (
                      //             <button
                      //               onClick={() => handleDeleteComment(blog._id, comment._id)}
                      //               className="text-gray-500 hover:text-red-500 transition-colors"
                      //             >
                      //               <Trash2 size={16} />
                      //             </button>
                      //           )}
                      //         </div>
                      //       ))}
                      //     </div>
                      //   </div>
                      // )}
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


// import React, { useState, useEffect } from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { useNavigate } from 'react-router-dom';
// import { MessageCircle, Heart, Share2, Trash2, Bookmark } from 'lucide-react';
// import UserProfile from './UserProfile';

// const ArtblogsPage = () => {
//   const navigate = useNavigate();
//   const [artblogs, setArtblogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [userData, setUserData] = useState(null);
//   const [loadingProfile, setLoadingProfile] = useState(false);
//   const [activeCommentBlog, setActiveCommentBlog] = useState(null);
//   const [newComment, setNewComment] = useState('');
//   const [comments, setComments] = useState({});

//   useEffect(() => {
//     const fetchArtblogs = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch('https://openart.onrender.com/openart/api/artblogs/get_artblogs_by_content_choice', {
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

//   const fetchComments = async (blogId) => {
//     try {
//       const response = await fetch(
//         `https://openart.onrender.com/openart/api/comments/get_comments_of_artblog/${blogId}`,
//         {
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         }
//       );
//       if (!response.ok) throw new Error('Failed to fetch comments');
//       const data = await response.json();
//       setComments(prev => ({
//         ...prev,
//         [blogId]: data.data.comments
//       }));
//     } catch (error) {
//       console.error('Error fetching comments:', error);
//     }
//   };

//   const handleLike = async (blogId) => {
//     try {
//       const blog = artblogs.find(b => b._id === blogId);
//       const isLiked = blog.isLiked;
      
//       const url = isLiked
//         ? `https://openart.onrender.com/openart/api/likes/unlike_artblog/${blogId}`
//         : `https://openart.onrender.com/openart/api/likes/add_like_to_artblog/${blogId}`;
      
//       const response = await fetch(url, {
//         method: isLiked ? 'DELETE' : 'POST',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) throw new Error('Failed to toggle like');

//       setArtblogs(prev => prev.map(blog => {
//         if (blog._id === blogId) {
//           return {
//             ...blog,
//             isLiked: !isLiked,
//             likesCount: isLiked ? blog.likesCount - 1 : blog.likesCount + 1
//           };
//         }
//         return blog;
//       }));
//     } catch (error) {
//       console.error('Error toggling like:', error);
//     }
//   };

//   const handleSave = async (blogId) => {
//     try {
//       const blog = artblogs.find(b => b._id === blogId);
//       const isSaved = blog.isSaved;
      
//       const url = isSaved
//         ? `https://openart.onrender.com/openart/api/savedartblogs/unsave_artblog/${blogId}`
//         : `https://openart.onrender.com/openart/api/savedartblogs/save_artblog/${blogId}`;
      
//       const response = await fetch(url, {
//         method: isSaved ? 'DELETE' : 'POST',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) throw new Error('Failed to toggle save');

//       setArtblogs(prev => prev.map(blog => {
//         if (blog._id === blogId) {
//           return {
//             ...blog,
//             isSaved: !isSaved
//           };
//         }
//         return blog;
//       }));
//     } catch (error) {
//       console.error('Error toggling save:', error);
//     }
//   };

//   const handleAddComment = async (blogId) => {
//     if (!newComment.trim()) return;

//     try {
//       const response = await fetch(
//         `https://openart.onrender.com/openart/api/comments/add_comment_to_artblog/${blogId}`,
//         {
//           method: 'POST',
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({ content: newComment })
//         }
//       );

//       if (!response.ok) throw new Error('Failed to add comment');

//       setNewComment('');
//       fetchComments(blogId);
//       setArtblogs(prev => prev.map(blog => {
//         if (blog._id === blogId) {
//           return {
//             ...blog,
//             commentsCount: blog.commentsCount + 1
//           };
//         }
//         return blog;
//       }));
//     } catch (error) {
//       console.error('Error adding comment:', error);
//     }
//   };

//   const handleDeleteComment = async (blogId, commentId) => {
//     try {
//       const response = await fetch(
//         `https://openart.onrender.com/openart/api/comments/delete_comment/${commentId}`,
//         {
//           method: 'DELETE',
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (!response.ok) throw new Error('Failed to delete comment');

//       fetchComments(blogId);
//       setArtblogs(prev => prev.map(blog => {
//         if (blog._id === blogId) {
//           return {
//             ...blog,
//             commentsCount: blog.commentsCount - 1
//           };
//         }
//         return blog;
//       }));
//     } catch (error) {
//       console.error('Error deleting comment:', error);
//     }
//   };

//   const handleShare = async (blog) => {
//     const shareData = {
//       title: blog.title,
//       text: blog.content.substring(0, 100) + '...',
//       url: window.location.href
//     };

//     try {
//       if (navigator.share) {
//         await navigator.share(shareData);
//       } else {
//         await navigator.clipboard.writeText(window.location.href);
//       }
//     } catch (error) {
//       console.error('Error sharing:', error);
//     }
//   };

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

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   const handleProfileNavigation = (profileId) => {
//     navigate(`/profile/${profileId}`);
//   };

//   return (
//     <div className="min-h-screen bg-black text-white">
//       <nav className="flex items-center justify-between p-6">
//         <div className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>OpenArt</div>
//         <div className="flex items-center gap-8">
//           <a href="/artworks" className="hover:text-gray-300">Artworks</a>
//           <a href="/artverse" className="hover:text-gray-300">Artverse</a>
//           <a href="https://artsandculture.google.com/category/artist" className="hover:text-gray-300">Artists</a>
//           <a href="https://artsocietyofindia.org" className="hover:text-gray-300">Community</a>
//           <a href="/createartblog" className="hover:text-gray-300">Create Artblog</a>
          
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
//         <h1 className="text-6xl font-bold mb-6">Artblogs</h1>
//         <p className="text-xl max-w-2xl mx-auto">
//           Discover the written expression of art. Here, artists share their thoughts, stories, and inspirations through words. Join the conversation and immerse yourself in their creative narratives.
//         </p>
//       </div>

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
//                       className="w-12 h-12 rounded-full object-cover cursor-pointer"
//                       onClick={() => handleProfileNavigation(blog.owner?._id)}
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
//                         <button 
//                           onClick={() => handleLike(blog._id)}
//                           className={`flex items-center gap-2 transition-colors ${
//                             blog.isLiked ? 'text-red-500' : 'hover:text-red-500'
//                           }`}
//                         >
//                           <Heart size={20} fill={blog.isLiked ? "currentColor" : "none"} />
//                           <span>{blog.likesCount}</span>
//                         </button>
                        
//                         <button 
//                           onClick={() => {
//                             if (activeCommentBlog === blog._id) {
//                               setActiveCommentBlog(null);
//                             } else {
//                               setActiveCommentBlog(blog._id);
//                               fetchComments(blog._id);
//                             }
//                           }}
//                           className="flex items-center gap-2 hover:text-blue-500 transition-colors"
//                         >
//                           <MessageCircle size={20} />
//                           <span>{blog.commentsCount}</span>
//                         </button>

//                         <button
//                           onClick={() => handleSave(blog._id)}
//                           className={`flex items-center gap-2 ${
//                             blog.isSaved ? 'text-yellow-500' : 'text-white/80'
//                           } hover:text-yellow-500 transition-colors`}
//                         >
//                           <Bookmark size={20} fill={blog.isSaved ? "currentColor" : "none"} />
//                           <span>Save</span>
//                         </button>
                        
//                         <button 
//                           onClick={() => handleShare(blog)}
//                           className="flex items-center gap-2 hover:text-green-500 transition-colors"
//                         >
//                           <Share2 size={20} />
//                           <span>Share</span>
//                         </button>
//                       </div>

//                       {activeCommentBlog === blog._id && (
//                         <div className="mt-4 space-y-4">
//                           {/* Comment Form */}
//                           <form 
//                             onSubmit={(e) => {
//                               e.preventDefault();
//                               handleAddComment(blog._id);
//                             }}
//                             className="flex gap-2"
//                           >
//                             <input
//                               type="text"
//                               value={newComment}
//                               onChange={(e) => setNewComment(e.target.value)}
//                               placeholder="Add a comment..."
//                               className="flex-1 bg-transparent border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-500"
//                             />
//                             <button
//                               type="submit"
//                               disabled={!newComment.trim()}
//                               className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
//                             >
//                               Post
//                             </button>
//                           </form>

//                           {/* Comments List */}
//                           <div className="space-y-3 max-h-60 overflow-y-auto">
//                             {comments[blog._id]?.map((comment) => (
//                               <div key={comment._id} className="flex items-start justify-between bg-gray-900 rounded-lg p-3">
//                                 <div className="flex items-start gap-2">
//                                   <img
//                                     src={comment.owner.avatar}
//                                     alt={comment.owner.username}
//                                     className="w-8 h-8 rounded-full object-cover"
//                                   />
//                                   <div>
//                                     <p className="font-semibold text-sm">{comment.owner.username}</p>
//                                     <p className="text-sm text-gray-300">{comment.content}</p>
//                                   </div>
//                                 </div>
//                                 {comment.deletionFlag && (
//                                   <button
//                                     onClick={() => handleDeleteComment(blog._id, comment._id)}
//                                     className="text-gray-500 hover:text-red-500 transition-colors"
//                                   >
//                                     <Trash2 size={16} />
//                                   </button>
//                                 )}
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
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


