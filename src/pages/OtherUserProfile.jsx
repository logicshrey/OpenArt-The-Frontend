import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Play, X } from 'lucide-react';

const OtherUserProfile = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('artworks');
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, [profileId]);

  const fetchUserProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!profileId) {
        throw new Error('Profile ID is missing');
      }

      const response = await axios.get(`http://localhost:8000/openart/api/profiles/get_profile_details/${profileId}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      const profileData = response.data.data;

      if (!profileData || !profileData._id) {
        throw new Error('Invalid or empty profile data');
      }

      setUserData({
        ...profileData,
        createdArtworks: profileData.createdArtworks || [],
        createdArtblogs: profileData.createdArtblogs || [],
        createdAnnouncements: profileData.createdAnnouncements || []
      });

      setIsFollowing(profileData.isFollowing || false);
      setLoading(false);

    } catch (error) {
      console.error('Profile fetch error:', error);
      
      const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'Failed to fetch profile';
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    try {
      // Use POST method for both follow and unfollow
      const endpoint = isFollowing 
        ? `http://localhost:8000/openart/api/follows/remove_follower/${profileId}`
        : `http://localhost:8000/openart/api/follows/add_follower/${profileId}`;
      
      // Send an empty object as body and use withCredentials
      await axios.post(endpoint, {}, { withCredentials: true });
      
      // Toggle follow state and update followers count
      setIsFollowing(!isFollowing);
      setUserData(prev => ({
        ...prev,
        followersCount: isFollowing 
          ? (prev.followersCount - 1) 
          : (prev.followersCount + 1)
      }));
    } catch (error) {
      console.error('Follow toggle error:', error);
      // Optionally show an error toast or message
    }
  };

  const handleArtworkClick = (artworkId) => {
    navigate(`/artwork/${artworkId}`);
  };

  const renderArtworkGrid = (artworks) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {artworks.map((artwork) => (
        <div 
          key={artwork._id} 
          className="relative group cursor-pointer transform transition-transform hover:scale-105"
          onClick={() => handleArtworkClick(artwork._id)}
        >
          {artwork.contentType?.includes('video') ? (
            <div className="relative w-full aspect-square bg-gray-800 rounded-lg flex items-center justify-center">
              <Play className="w-8 h-8 text-white absolute z-10" />
              <video 
                src={artwork.contentFile}
                className="absolute inset-0 w-full h-full object-cover rounded-lg opacity-50"
              />
            </div>
          ) : (
            <img
              src={artwork.contentFile}
              alt={artwork.title}
              className="w-full aspect-square object-cover rounded-lg"
            />
          )}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <div className="text-white text-center">
              <p className="font-semibold text-lg">{artwork.title}</p>
              <p className="text-sm">{artwork.category}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderArtblogs = (artblogs) => (
    <div className="space-y-4">
      {artblogs.map((blog) => (
        <div 
          key={blog._id} 
          className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors"
        >
          <h5 className="font-semibold text-lg mb-2">{blog.title}</h5>
          <p className="text-gray-400 text-sm line-clamp-3">{blog.content}</p>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-xs text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAnnouncements = (announcements) => (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <div 
          key={announcement._id} 
          className="bg-gray-900 rounded-lg overflow-hidden flex"
        >
          {announcement.image && (
            <div className="w-32 h-32 flex-shrink-0">
              <img
                src={announcement.image}
                alt={announcement.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-4 flex-1">
            <h5 className="font-semibold text-lg mb-2">{announcement.title}</h5>
            <p className="text-gray-400 text-sm mb-2">{announcement.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{announcement.category}</span>
              <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
        <div className="bg-red-600 p-8 rounded-lg text-center">
          <p className="text-2xl mb-4">Profile Not Found</p>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="bg-white text-black px-6 py-3 rounded-full hover:bg-gray-200 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
        <p className="text-white text-2xl">No Profile Available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-full z-10"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Profile Header */}
        <div className="relative mb-8">
          <div className="h-64 bg-gray-900 rounded-lg overflow-hidden">
            <img
              src={userData.coverImage}
              alt="Cover"
              className="w-full h-full object-cover opacity-70"
            />
          </div>
          
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <img
              src={userData.avatar}
              alt={userData.fullName}
              className="w-32 h-32 rounded-full border-4 border-black object-cover"
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="text-center mt-20 space-y-4">
          <div>
            <h3 className="text-3xl font-bold">{userData.fullName}</h3>
            <p className="text-gray-400 text-lg">@{userData.username}</p>
          </div>

          <button 
            onClick={handleFollowToggle}
            className="px-6 py-2 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-colors"
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>

          <p className="text-gray-300 max-w-xl mx-auto">{userData.bio}</p>

          <div className="flex justify-center gap-8">
            <div>
              <span className="text-2xl font-bold block">{userData.followersCount}</span>
              <span className="text-gray-400">Followers</span>
            </div>
            <div>
              <span className="text-2xl font-bold block">{userData.followingsCount}</span>
              <span className="text-gray-400">Following</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {userData.contentChoice?.map((choice) => (
              <span 
                key={choice} 
                className="px-4 py-1 bg-gray-800 rounded-full text-sm"
              >
                {choice}
              </span>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-800 mt-8">
          <div className="flex justify-center space-x-8 -mb-px">
            {['artworks', 'artblogs', 'announcements'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 font-medium capitalize ${
                  activeTab === tab
                    ? 'text-white border-b-2 border-white'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="mt-8">
          {activeTab === 'artworks' && renderArtworkGrid(userData.createdArtworks)}
          {activeTab === 'artblogs' && renderArtblogs(userData.createdArtblogs)}
          {activeTab === 'announcements' && renderAnnouncements(userData.createdAnnouncements)}
        </div>
      </div>
    </div>
  );
};

export default OtherUserProfile;

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Play, Settings, Bookmark, X } from 'lucide-react';
// import { Card, CardHeader, CardContent } from '@/components/ui/card';

// const OtherUserProfile = () => {
//   const { profileId } = useParams();
//   const navigate = useNavigate();
//   const [userData, setUserData] = useState(null);
//   const [activeTab, setActiveTab] = useState('artworks');
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     console.log(profileId);
    
//     fetchUserProfile();
//   }, [profileId]);

//   const fetchUserProfile = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       console.log('Fetching profile for ID:', profileId);

//       if (!profileId) {
//         throw new Error('Profile ID is missing');
//       }

//       const response = await axios.get(`http://localhost:8000/openart/api/profiles/get_profile_details/${profileId}`, {
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         withCredentials: true
//       });

//       console.log('Full API response:', response.data.data);

//       const profileData = response.data.data;

//       if (!profileData || !profileData._id) {
//         throw new Error('Invalid or empty profile data');
//       }

//       setUserData({
//         ...profileData,
//         createdArtworks: profileData.createdArtworks || [],
//         createdArtblogs: profileData.createdArtblogs || [],
//         createdAnnouncements: profileData.createdAnnouncements || []
//       });

//       setIsFollowing(profileData.isFollowing || false);
//       setLoading(false);

//     } catch (error) {
//       console.error('Profile fetch error:', error);
      
//       const errorMessage = error.response?.data?.message || 
//                            error.message || 
//                            'Failed to fetch profile';
      
//       setError(errorMessage);
//       setLoading(false);
//     }
//   };

//   const handleFollowToggle = async () => {
//     try {
//       const endpoint = isFollowing 
//         ? `http://localhost:8000/openart/api/follows/remove_follower/${profileId}`
//         : `http://localhost:8000/openart/api/follows/add_follower/${profileId}`;
      
//       await axios.post(endpoint, {}, { withCredentials: true });
      
//       setIsFollowing(!isFollowing);
//       setUserData(prev => ({
//         ...prev,
//         followersCount: isFollowing 
//           ? (prev.followersCount - 1) 
//           : (prev.followersCount + 1)
//       }));
//     } catch (error) {
//       console.error('Follow toggle error:', error);
//     }
//   };

//   const handleArtworkClick = (artworkId) => {
//     navigate(`/artwork/${artworkId}`);
//   };

//   const renderArtworkGrid = (artworks) => (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//       {artworks.map((artwork) => (
//         <div 
//           key={artwork._id} 
//           className="relative group cursor-pointer"
//           onClick={() => handleArtworkClick(artwork._id)}
//         >
//           {artwork.contentType?.includes('video') ? (
//             <div className="relative w-full h-32 bg-gray-800 rounded-lg flex items-center justify-center">
//               <Play className="w-8 h-8 text-white" />
//               <video 
//                 src={artwork.contentFile}
//                 className="hidden"
//               />
//             </div>
//           ) : (
//             <img
//               src={artwork.contentFile}
//               alt={artwork.title}
//               className="w-full h-32 object-cover rounded-lg"
//             />
//           )}
//           <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
//             <div className="p-2 text-white">
//               <p className="font-semibold">{artwork.title}</p>
//               <p className="text-sm">{artwork.category}</p>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );

//   const renderAnnouncements = (announcements) => (
//     <div className="space-y-4">
//       {announcements.map((announcement) => (
//         <Card key={announcement._id} className="bg-gray-900 border-0 overflow-hidden">
//           <CardContent className="p-4">
//             <div className="flex gap-4">
//               {announcement.image && (
//                 <div className="w-24 h-24 flex-shrink-0">
//                   <img
//                     src={announcement.image}
//                     alt={announcement.title}
//                     className="w-full h-full object-cover rounded-lg"
//                   />
//                 </div>
//               )}
//               <div className="flex-1">
//                 <h5 className="font-semibold text-lg mb-2">{announcement.title}</h5>
//                 <p className="text-gray-400 text-sm mb-2">{announcement.description}</p>
//                 <div className="flex items-center gap-4 text-sm text-gray-500">
//                   <span>{announcement.category}</span>
//                   <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-white"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
//         <div className="bg-red-600 p-6 rounded-lg text-white">
//           <p className="text-xl mb-4">Profile Not Found</p>
//           <p>{error}</p>
//           <button 
//             onClick={() => navigate(-1)} 
//             className="mt-4 bg-white text-black px-4 py-2 rounded"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!userData) {
//     return (
//       <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
//         <p className="text-white text-2xl">No Profile Available</p>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
//       <div className="w-full max-w-2xl bg-black text-white h-full overflow-y-auto">
//         <Card className="h-full bg-black border-0">
//           <CardHeader className="sticky top-0 bg-black z-10 flex flex-row justify-between items-center">
//             <h2 className="text-2xl font-bold">Artist Profile</h2>
//             <button 
//               onClick={() => navigate(-1)} 
//               className="p-2 hover:bg-gray-800 rounded-full"
//             >
//               <X className="h-6 w-6" />
//             </button>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="relative h-48 bg-gradient-to-b from-gray-800 to-black">
//               <img
//                 src={userData.coverImage}
//                 alt="Cover"
//                 className="w-full h-full object-cover opacity-80"
//               />
//             </div>

//             <div className="relative px-6">
//               <div className="absolute -top-20 left-0 w-32 h-32">
//                 <img
//                   src={userData.avatar}
//                   alt={userData.fullName}
//                   className="w-full h-full rounded-full border-4 border-black object-cover"
//                 />
//               </div>

//               <div className="pt-16 space-y-4">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h3 className="text-3xl font-bold">{userData.fullName}</h3>
//                     <p className="text-gray-400 text-lg">@{userData.username}</p>
//                   </div>
//                   <button 
//                     onClick={handleFollowToggle}
//                     className="px-4 py-2 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-colors"
//                   >
//                     {isFollowing ? 'Following' : 'Follow'}
//                   </button>
//                 </div>
                
//                 <p className="text-gray-300 text-lg">{userData.bio}</p>

//                 <div className="flex gap-6">
//                   <div className="flex items-center gap-1">
//                     <span className="font-bold text-xl">{userData.followersCount}</span>
//                     <span className="text-gray-400">Followers</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <span className="font-bold text-xl">{userData.followingsCount}</span>
//                     <span className="text-gray-400">Following</span>
//                   </div>
//                 </div>

//                 <div className="flex flex-wrap gap-2 mt-4">
//                   {userData.contentChoice?.map((choice) => (
//                     <span 
//                       key={choice} 
//                       className="px-4 py-2 bg-gray-800 rounded-full text-sm font-medium"
//                     >
//                       {choice}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="border-t border-gray-800 mt-8">
//               <div className="flex gap-6 px-6 -mb-px">
//                 {['artworks', 'artblogs', 'announcements'].map((tab) => (
//                   <button
//                     key={tab}
//                     onClick={() => setActiveTab(tab)}
//                     className={`py-4 font-medium capitalize ${
//                       activeTab === tab
//                         ? 'text-white border-b-2 border-white'
//                         : 'text-gray-400 hover:text-gray-300'
//                     }`}
//                   >
//                     {tab}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="px-6">
//               {activeTab === 'artworks' && renderArtworkGrid(userData.createdArtworks)}
              
//               {activeTab === 'artblogs' && (
//                 <div className="space-y-4">
//                   {userData.createdArtblogs.map((blog) => (
//                     <Card key={blog._id} className="bg-gray-900 border-0">
//                       <CardContent className="p-4">
//                         <h5 className="font-semibold">{blog.title}</h5>
//                         <p className="text-gray-400 text-sm mt-2 line-clamp-3">{blog.content}</p>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               )}
              
//               {activeTab === 'announcements' && renderAnnouncements(userData.createdAnnouncements)}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default OtherUserProfile;



// // import { useParams, useNavigate } from 'react-router-dom';
// // import axios from 'axios';
// // import { Play, Settings, Bookmark, X } from 'lucide-react';
// // import { Card, CardHeader, CardContent } from '@/components/ui/card';

// // const OtherUserProfile = () => {
// //   const { profileId } = useParams();
// //   const navigate = useNavigate();
// //   const [userData, setUserData] = useState(null);
// //   const [activeTab, setActiveTab] = useState('artworks');
// //   const [isFollowing, setIsFollowing] = useState(false);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     fetchUserProfile();
// //   }, [profileId]);

// //   const fetchUserProfile = async () => {
// //     try {
// //       const response = await axios.get(`/openart/api/users/artist-profile/${profileId}`);
// //       setUserData(response.data.data);
// //       setIsFollowing(response.data.data.isFollowing);
// //       setLoading(false);
// //     } catch (error) {
// //       console.error('Error fetching profile:', error);
// //       setLoading(false);
// //     }
// //   };

// //   const handleFollowToggle = async () => {
// //     try {
// //       const endpoint = isFollowing 
// //         ? `/openart/api/follows/remove_follower/${profileId}`
// //         : `/openart/api/follows/add_follower/${profileId}`;
      
// //       await axios.post(endpoint);
// //       setIsFollowing(!isFollowing);
      
// //       // Optimistically update follower count
// //       setUserData(prev => ({
// //         ...prev,
// //         followersCount: isFollowing 
// //           ? prev.followersCount - 1 
// //           : prev.followersCount + 1
// //       }));
// //     } catch (error) {
// //       console.error('Error toggling follow:', error);
// //     }
// //   };

// //   const handleArtworkClick = (artworkId) => {
// //     navigate(`/artwork/${artworkId}`);
// //   };

// //   const renderArtworkGrid = (artworks) => (
// //     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
// //       {artworks.map((artwork) => (
// //         <div 
// //           key={artwork._id} 
// //           className="relative group cursor-pointer"
// //           onClick={() => handleArtworkClick(artwork._id)}
// //         >
// //           {artwork.contentType?.includes('video') ? (
// //             <div className="relative w-full h-32 bg-gray-800 rounded-lg flex items-center justify-center">
// //               <Play className="w-8 h-8 text-white" />
// //               <video 
// //                 src={artwork.contentFile}
// //                 className="hidden"
// //               />
// //             </div>
// //           ) : (
// //             <img
// //               src={artwork.contentFile}
// //               alt={artwork.title}
// //               className="w-full h-32 object-cover rounded-lg"
// //             />
// //           )}
// //           <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
// //             <div className="p-2 text-white">
// //               <p className="font-semibold">{artwork.title}</p>
// //               <p className="text-sm">{artwork.category}</p>
// //             </div>
// //           </div>
// //         </div>
// //       ))}
// //     </div>
// //   );

// //   const renderAnnouncements = (announcements) => (
// //     <div className="space-y-4">
// //       {announcements.map((announcement) => (
// //         <Card key={announcement._id} className="bg-gray-900 border-0 overflow-hidden">
// //           <CardContent className="p-4">
// //             <div className="flex gap-4">
// //               {announcement.image && (
// //                 <div className="w-24 h-24 flex-shrink-0">
// //                   <img
// //                     src={announcement.image}
// //                     alt={announcement.title}
// //                     className="w-full h-full object-cover rounded-lg"
// //                   />
// //                 </div>
// //               )}
// //               <div className="flex-1">
// //                 <h5 className="font-semibold text-lg mb-2">{announcement.title}</h5>
// //                 <p className="text-gray-400 text-sm mb-2">{announcement.description}</p>
// //                 <div className="flex items-center gap-4 text-sm text-gray-500">
// //                   <span>{announcement.category}</span>
// //                   <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
// //                 </div>
// //               </div>
// //             </div>
// //           </CardContent>
// //         </Card>
// //       ))}
// //     </div>
// //   );

// //   if (loading) {
// //     return (
// //       <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
// //         <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-white"></div>
// //       </div>
// //     );
// //   }

// //   if (!userData) {
// //     return (
// //       <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
// //         <p className="text-white text-2xl">Profile not found</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
// //       <div className="w-full max-w-2xl bg-black text-white h-full overflow-y-auto">
// //         <Card className="h-full bg-black border-0">
// //           <CardHeader className="sticky top-0 bg-black z-10 flex flex-row justify-between items-center">
// //             <h2 className="text-2xl font-bold">Artist Profile</h2>
// //             <button 
// //               onClick={() => navigate(-1)} 
// //               className="p-2 hover:bg-gray-800 rounded-full"
// //             >
// //               <X className="h-6 w-6" />
// //             </button>
// //           </CardHeader>
// //           <CardContent className="space-y-6">
// //             {/* Cover Image */}
// //             <div className="relative h-48 bg-gradient-to-b from-gray-800 to-black">
// //               <img
// //                 src={userData.coverImage}
// //                 alt="Cover"
// //                 className="w-full h-full object-cover opacity-80"
// //               />
// //             </div>

// //             {/* Profile Section */}
// //             <div className="relative px-6">
// //               <div className="absolute -top-20 left-0 w-32 h-32">
// //                 <img
// //                   src={userData.avatar}
// //                   alt={userData.fullName}
// //                   className="w-full h-full rounded-full border-4 border-black object-cover"
// //                 />
// //               </div>

// //               <div className="pt-16 space-y-4">
// //                 <div className="flex justify-between items-start">
// //                   <div>
// //                     <h3 className="text-3xl font-bold">{userData.fullName}</h3>
// //                     <p className="text-gray-400 text-lg">@{userData.username}</p>
// //                   </div>
// //                   <button 
// //                     onClick={handleFollowToggle}
// //                     className="px-4 py-2 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-colors"
// //                   >
// //                     {isFollowing ? 'Following' : 'Follow'}
// //                   </button>
// //                 </div>
                
// //                 <p className="text-gray-300 text-lg">{userData.bio}</p>

// //                 <div className="flex gap-6">
// //                   <div className="flex items-center gap-1">
// //                     <span className="font-bold text-xl">{userData.followersCount}</span>
// //                     <span className="text-gray-400">Followers</span>
// //                   </div>
// //                   <div className="flex items-center gap-1">
// //                     <span className="font-bold text-xl">{userData.followingsCount}</span>
// //                     <span className="text-gray-400">Following</span>
// //                   </div>
// //                 </div>

// //                 <div className="flex flex-wrap gap-2 mt-4">
// //                   {userData.contentChoice?.map((choice) => (
// //                     <span 
// //                       key={choice} 
// //                       className="px-4 py-2 bg-gray-800 rounded-full text-sm font-medium"
// //                     >
// //                       {choice}
// //                     </span>
// //                   ))}
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="border-t border-gray-800 mt-8">
// //               <div className="flex gap-6 px-6 -mb-px">
// //                 {['artworks', 'artblogs', 'announcements'].map((tab) => (
// //                   <button
// //                     key={tab}
// //                     onClick={() => setActiveTab(tab)}
// //                     className={`py-4 font-medium capitalize ${
// //                       activeTab === tab
// //                         ? 'text-white border-b-2 border-white'
// //                         : 'text-gray-400 hover:text-gray-300'
// //                     }`}
// //                   >
// //                     {tab}
// //                   </button>
// //                 ))}
// //               </div>
// //             </div>

// //             <div className="px-6">
// //               {activeTab === 'artworks' && renderArtworkGrid(userData.createdArtworks)}
              
// //               {activeTab === 'artblogs' && (
// //                 <div className="space-y-4">
// //                   {userData.createdArtblogs.map((blog) => (
// //                     <Card key={blog._id} className="bg-gray-900 border-0">
// //                       <CardContent className="p-4">
// //                         <h5 className="font-semibold">{blog.title}</h5>
// //                         <p className="text-gray-400 text-sm mt-2 line-clamp-3">{blog.content}</p>
// //                       </CardContent>
// //                     </Card>
// //                   ))}
// //                 </div>
// //               )}
              
// //               {activeTab === 'announcements' && renderAnnouncements(userData.createdAnnouncements)}
// //             </div>
// //           </CardContent>
// //         </Card>
// //       </div>
// //     </div>
// //   );
// // };

// // export default OtherUserProfile;