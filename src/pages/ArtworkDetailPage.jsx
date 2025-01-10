import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, MessageCircle, Share2, Bookmark, ArrowLeft, Trash2 } from 'lucide-react';

const ArtworkDetailPage = () => {
  const { artworkId } = useParams();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchArtworkDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/openart/api/artworks/get_artwork/${artworkId}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch artwork details');
        }

        const data = await response.json();
        setArtwork(data.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setArtwork(null);
      } finally {
        setLoading(false);
      }
    };

    if (artworkId) {
      fetchArtworkDetails();
    }
  }, [artworkId]);

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/openart/api/comments/get_comments_of_artwork/${artworkId}`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      setComments(data.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    try {
      const url = artwork.isLiked
        ? `http://localhost:8000/openart/api/likes/unlike_artwork/${artworkId}`
        : `http://localhost:8000/openart/api/likes/add_like_to_artwork/${artworkId}`;
      
      const response = await fetch(url, {
        method: artwork.isLiked ? 'DELETE' : 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to toggle like');

      setArtwork(prev => ({
        ...prev,
        isLiked: !prev.isLiked,
        likesCount: prev.isLiked ? prev.likesCount - 1 : prev.likesCount + 1
      }));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleSave = async () => {
    try {
      const url = artwork.isSaved
        ? `http://localhost:8000/openart/api/savedartworks/unsave_artwork/${artworkId}`
        : `http://localhost:8000/openart/api/savedartworks/save_artwork/${artworkId}`;
      
      const response = await fetch(url, {
        method: artwork.isSaved ? 'DELETE' : 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to toggle save');

      setArtwork(prev => ({
        ...prev,
        isSaved: !prev.isSaved
      }));
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetch(
        `http://localhost:8000/openart/api/comments/add_comment_to_artwork/${artworkId}`,
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
      fetchComments();
      setArtwork(prev => ({
        ...prev,
        commentsCount: prev.commentsCount + 1
      }));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/openart/api/comments/delete_comment/${commentId}`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error('Failed to delete comment');

      fetchComments();
      setArtwork(prev => ({
        ...prev,
        commentsCount: prev.commentsCount - 1
      }));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: artwork.title,
        text: artwork.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Artworks</span>
        </button>

        {artwork && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="relative">
              <Card className="bg-transparent border-0 overflow-hidden">
                <CardContent className="p-0">
                  <img
                    src={artwork.contentFile}
                    alt={artwork.title}
                    className="w-full h-auto rounded-lg object-cover"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold mb-4">{artwork.title}</h1>
                <div className="flex items-center gap-4 text-white/80">
                  <img
                    src={artwork.owner.avatar}
                    alt={artwork.owner.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{artwork.owner.fullName}</p>
                    <p className="text-sm">@{artwork.owner.username}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Description</h2>
                <p className="text-white/80 leading-relaxed">{artwork.description}</p>
                <p className="text-white/60">Category: {artwork.category}</p>
              </div>

              <div className="flex items-center gap-6">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 ${
                    artwork.isLiked ? 'text-red-500' : 'text-white/80'
                  } hover:text-red-500 transition-colors`}
                >
                  <Heart size={24} fill={artwork.isLiked ? "currentColor" : "none"} />
                  <span>{artwork.likesCount}</span>
                </button>
                
                <button 
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <MessageCircle size={24} />
                  <span>{artwork.commentsCount}</span>
                </button>

                <button
                  onClick={handleSave}
                  className={`flex items-center gap-2 ${
                    artwork.isSaved ? 'text-yellow-500' : 'text-white/80'
                  } hover:text-yellow-500 transition-colors`}
                >
                  <Bookmark size={24} fill={artwork.isSaved ? "currentColor" : "none"} />
                  <span>Save</span>
                </button>

                <button 
                  onClick={handleShare}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <Share2 size={24} />
                  <span>Share</span>
                </button>
              </div>

              {/* Comments Section */}
              {showComments && (
                <div className="space-y-4 border-t border-white/20 pt-6">
                  <h3 className="text-lg font-semibold">Comments</h3>
                  
                  {/* Comment List */}
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {comments.map((comment) => (
                      <div key={comment._id} className="flex items-start justify-between bg-white/5 p-4 rounded-lg">
                        <div className="flex items-start gap-3">
                          <img
                            src={comment.owner.avatar}
                            alt={comment.owner.username}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-semibold text-sm">{comment.owner.username}</p>
                            <p className="text-white/80 text-sm mt-1">{comment.content}</p>
                          </div>
                        </div>
                        {comment.deletionFlag && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-white/60 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Comment Form */}
                  <form onSubmit={handleAddComment} className="flex gap-3">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 bg-white/5 text-white border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-white/20"
                    />
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Post
                    </button>
                  </form>
                </div>
              )}

              <div className="border-t border-white/20 pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/60">Created</p>
                    <p>{new Date(artwork.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-white/60">Last Updated</p>
                    <p>{new Date(artwork.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtworkDetailPage;


// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Card, CardContent } from '@/components/ui/card';
// import { Heart, MessageCircle, Share2, Bookmark, ArrowLeft } from 'lucide-react';

// const ArtworkDetailPage = () => {
//   const { artworkId } = useParams();
//   const navigate = useNavigate();
//   const [artwork, setArtwork] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchArtworkDetails = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`http://localhost:8000/openart/api/artworks/get_artwork/${artworkId}`, {
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         });

//         if (!response.ok) {
//           throw new Error('Failed to fetch artwork details');
//         }

//         const data = await response.json();
//         setArtwork(data.data);
//         setError(null);
//       } catch (err) {
//         setError(err.message);
//         setArtwork(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (artworkId) {
//       fetchArtworkDetails();
//     }
//   }, [artworkId]);

//   const handleLike = async () => {
//     // Implement like functionality
//   };

//   const handleSave = async () => {
//     // Implement save functionality
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-black text-white flex items-center justify-center">
//         <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-black text-white flex items-center justify-center">
//         <div className="text-red-500">{error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black text-white">
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Back Button */}
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
//         >
//           <ArrowLeft size={20} />
//           <span>Back to Artworks</span>
//         </button>

//         {artwork && (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//             {/* Artwork Image */}
//             <div className="relative">
//               <Card className="bg-transparent border-0 overflow-hidden">
//                 <CardContent className="p-0">
//                   <img
//                     src={artwork.contentFile}
//                     alt={artwork.title}
//                     className="w-full h-auto rounded-lg object-cover"
//                   />
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Artwork Details */}
//             <div className="space-y-8">
//               <div>
//                 <h1 className="text-4xl font-bold mb-4">{artwork.title}</h1>
//                 <div className="flex items-center gap-4 text-white/80">
//                   <img
//                     src={artwork.owner.avatar}
//                     alt={artwork.owner.username}
//                     className="w-12 h-12 rounded-full object-cover"
//                   />
//                   <div>
//                     <p className="font-semibold">{artwork.owner.fullName}</p>
//                     <p className="text-sm">@{artwork.owner.username}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <h2 className="text-xl font-semibold">Description</h2>
//                 <p className="text-white/80 leading-relaxed">{artwork.description}</p>
//                 <p className="text-white/60">Category: {artwork.category}</p>
//               </div>

//               {/* Interaction Buttons */}
//               <div className="flex items-center gap-6">
//                 <button
//                   onClick={handleLike}
//                   className={`flex items-center gap-2 ${
//                     artwork.isLiked ? 'text-red-500' : 'text-white/80'
//                   } hover:text-red-500 transition-colors`}
//                 >
//                   <Heart size={24} fill={artwork.isLiked ? "currentColor" : "none"} />
//                   <span>{artwork.likesCount}</span>
//                 </button>
                
//                 <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
//                   <MessageCircle size={24} />
//                   <span>{artwork.commentsCount}</span>
//                 </button>

//                 <button
//                   onClick={handleSave}
//                   className={`flex items-center gap-2 ${
//                     artwork.isSaved ? 'text-yellow-500' : 'text-white/80'
//                   } hover:text-yellow-500 transition-colors`}
//                 >
//                   <Bookmark size={24} fill={artwork.isSaved ? "currentColor" : "none"} />
//                   <span>Save</span>
//                 </button>

//                 <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
//                   <Share2 size={24} />
//                   <span>Share</span>
//                 </button>
//               </div>

//               {/* Additional Details */}
//               <div className="border-t border-white/20 pt-6 space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-white/60">Created</p>
//                     <p>{new Date(artwork.createdAt).toLocaleDateString()}</p>
//                   </div>
//                   <div>
//                     <p className="text-white/60">Last Updated</p>
//                     <p>{new Date(artwork.updatedAt).toLocaleDateString()}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ArtworkDetailPage;