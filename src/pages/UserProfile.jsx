import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { X, Play, Bookmark, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserProfile = ({ isOpen, onClose, userData }) => {
  const [activeTab, setActiveTab] = useState('artworks');
  const navigate = useNavigate();
  
  if (!isOpen) return null;

  const handleArtworkClick = (artworkId) => {
    navigate(`/artwork/${artworkId}`);
  };

  const handleSavedItemsClick = () => {
    navigate('/saved-items');
  };

  const handleUpdateClick = () => {
    navigate('/update-profile');
  };

  const renderArtworkGrid = (artworks) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {artworks.map((artwork) => (
        <div 
          key={artwork._id} 
          className="relative group cursor-pointer"
          onClick={() => handleArtworkClick(artwork._id)}
        >
          {artwork.contentType?.includes('video') ? (
            <div className="relative w-full h-32 bg-gray-800 rounded-lg flex items-center justify-center">
              <Play className="w-8 h-8 text-white" />
              <video 
                src={artwork.contentFile}
                className="hidden"
              />
            </div>
          ) : (
            <img
              src={artwork.contentFile}
              alt={artwork.title}
              className="w-full h-32 object-cover rounded-lg"
            />
          )}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
            <div className="p-2 text-white">
              <p className="font-semibold">{artwork.title}</p>
              <p className="text-sm">{artwork.category}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAnnouncements = (announcements) => (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <Card key={announcement._id} className="bg-gray-900 border-0 overflow-hidden">
          <CardContent className="p-4">
            <div className="flex gap-4">
              {announcement.image && (
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src={announcement.image}
                    alt={announcement.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="flex-1">
                <h5 className="font-semibold text-lg mb-2">{announcement.title}</h5>
                <p className="text-gray-400 text-sm mb-2">{announcement.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{announcement.category}</span>
                  <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="w-full max-w-2xl bg-black text-white h-full overflow-y-auto">
        <Card className="h-full bg-black border-0">
          <CardHeader className="sticky top-0 bg-black z-10 flex flex-row justify-between items-center">
            <h2 className="text-2xl font-bold">Profile</h2>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleUpdateClick}
                className="p-2 hover:bg-gray-800 rounded-full"
                title="Update Profile"
              >
                <Settings className="h-6 w-6" />
              </button>
              <button 
                onClick={handleSavedItemsClick}
                className="p-2 hover:bg-gray-800 rounded-full"
              >
                <Bookmark className="h-6 w-6" />
              </button>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-gray-800 rounded-full"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Cover Image */}
            <div className="relative h-48 bg-gradient-to-b from-gray-800 to-black">
              <img
                src={userData.coverImage}
                alt="Cover"
                className="w-full h-full object-cover opacity-80"
              />
            </div>

            {/* Profile Section */}
            <div className="relative px-6">
              <div className="absolute -top-20 left-0 w-32 h-32">
                <img
                  src={userData.avatar}
                  alt={userData.fullName}
                  className="w-full h-full rounded-full border-4 border-black object-cover"
                />
              </div>

              <div className="pt-16 space-y-4">
                <div>
                  <h3 className="text-3xl font-bold">{userData.fullName}</h3>
                  <p className="text-gray-400 text-lg">@{userData.username}</p>
                </div>
                <p className="text-gray-300 text-lg">{userData.bio}</p>

                <div className="flex gap-6">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-xl">{userData.followersCount}</span>
                    <span className="text-gray-400">Followers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-xl">{userData.followingCount}</span>
                    <span className="text-gray-400">Following</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {userData.contentChoice.map((choice) => (
                    <span 
                      key={choice} 
                      className="px-4 py-2 bg-gray-800 rounded-full text-sm font-medium"
                    >
                      {choice}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8">
              <div className="flex gap-6 px-6 -mb-px">
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

            <div className="px-6">
              {activeTab === 'artworks' && renderArtworkGrid(userData.createdArtworks)}
              
              {activeTab === 'artblogs' && (
                <div className="space-y-4">
                  {userData.createdArtblogs.map((blog) => (
                    <Card key={blog._id} className="bg-gray-900 border-0">
                      <CardContent className="p-4">
                        <h5 className="font-semibold">{blog.title}</h5>
                        <p className="text-gray-400 text-sm mt-2 line-clamp-3">{blog.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              {activeTab === 'announcements' && renderAnnouncements(userData.createdAnnouncements)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;


// import React, { useState } from 'react';
// import { Card, CardHeader, CardContent } from '@/components/ui/card';
// import { X, Play, Bookmark } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const UserProfile = ({ isOpen, onClose, userData }) => {
//   const [activeTab, setActiveTab] = useState('artworks');
//   const navigate = useNavigate();
  
//   if (!isOpen) return null;

//   const handleArtworkClick = (artworkId) => {
//     navigate(`/artwork/${artworkId}`);
//   };

//   const handleSavedItemsClick = () => {
//     navigate('/saved-items');
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

//   return (
//     <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
//       <div className="w-full max-w-2xl bg-black text-white h-full overflow-y-auto">
//         <Card className="h-full bg-black border-0">
//           <CardHeader className="sticky top-0 bg-black z-10 flex flex-row justify-between items-center">
//             <h2 className="text-2xl font-bold">Profile</h2>
//             <div className="flex items-center gap-4">
//               <button 
//                 onClick={handleSavedItemsClick}
//                 className="p-2 hover:bg-gray-800 rounded-full"
//               >
//                 <Bookmark className="h-6 w-6" />
//               </button>
//               <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full">
//                 <X className="h-6 w-6" />
//               </button>
//             </div>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             {/* Cover Image */}
//             <div className="relative h-48 bg-gradient-to-b from-gray-800 to-black">
//               <img
//                 src={userData.coverImage}
//                 alt="Cover"
//                 className="w-full h-full object-cover opacity-80"
//               />
//             </div>

//             {/* Profile Section */}
//             <div className="relative px-6">
//               <div className="absolute -top-20 left-0 w-32 h-32">
//                 <img
//                   src={userData.avatar}
//                   alt={userData.fullName}
//                   className="w-full h-full rounded-full border-4 border-black object-cover"
//                 />
//               </div>

//               <div className="pt-16 space-y-4">
//                 <div>
//                   <h3 className="text-3xl font-bold">{userData.fullName}</h3>
//                   <p className="text-gray-400 text-lg">@{userData.username}</p>
//                 </div>
//                 <p className="text-gray-300 text-lg">{userData.bio}</p>

//                 <div className="flex gap-6">
//                   <div className="flex items-center gap-1">
//                     <span className="font-bold text-xl">{userData.followersCount}</span>
//                     <span className="text-gray-400">Followers</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <span className="font-bold text-xl">{userData.followingCount}</span>
//                     <span className="text-gray-400">Following</span>
//                   </div>
//                 </div>

//                 <div className="flex flex-wrap gap-2 mt-4">
//                   {userData.contentChoice.map((choice) => (
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

// export default UserProfile;

