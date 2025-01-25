import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Play, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SavedItems = () => {
    const [activeTab, setActiveTab] = useState('artworks');
    const [savedArtworks, setSavedArtworks] = useState([]);
    const [savedArtblogs, setSavedArtblogs] = useState([]);
    const [savedAnnouncements, setSavedAnnouncements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchSavedItems = async () => {
        try {
          setIsLoading(true);
          setError(null);
  
          const fetchOptions = {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
          };
  
          const [artworksRes, artblogsRes, announcementsRes] = await Promise.all([
            fetch('https://openart.onrender.com/openart/api/users/get-saved-artworks', fetchOptions),
            fetch('https://openart.onrender.com/openart/api/users/get-saved-artblogs', fetchOptions),
            fetch('https://openart.onrender.com/openart/api/users/get-saved-announcements', fetchOptions)
          ]);
  
          if (!artworksRes.ok || !artblogsRes.ok || !announcementsRes.ok) {
            const errorData = await artworksRes.json();
            throw new Error(errorData.message || 'Failed to fetch saved items');
          }
  
          const [artworksData, artblogsData, announcementsData] = await Promise.all([
            artworksRes.json(),
            artblogsRes.json(),
            announcementsRes.json()
          ]);
  
          setSavedArtworks(artworksData.data?.savedArtworks?.map(item => item.artwork) || []);
          // Extract artblog data from the nested structure
          setSavedArtblogs(artblogsData.data?.savedArtblogs?.map(item => item.artblog) || []);
          // Extract announcement data from the nested structure
          setSavedAnnouncements(announcementsData.data?.savedAnnouncements?.map(item => item.announcement) || []);
        } catch (error) {
          console.error('Error fetching saved items:', error);
          setError(error.message || 'Failed to fetch saved items');
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchSavedItems();
    }, [navigate]);

    const handleArtworkClick = (artworkId) => {
      navigate(`/artwork/${artworkId}`);
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

    const renderArtblogs = (artblogs) => (
      <div className="space-y-4">
        {artblogs.map((blog) => (
          <Card key={blog._id} className="bg-gray-900 border-0">
            <CardContent className="p-4">
              <h5 className="font-semibold">{blog.title}</h5>
              <p className="text-gray-400 text-sm mt-2 line-clamp-3">{blog.content}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                {blog.category && <span>{blog.category}</span>}
              </div>
            </CardContent>
          </Card>
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
      <div className="min-h-screen bg-black text-white">
        <Card className="h-full min-h-screen bg-black border-0">
          <CardHeader className="sticky top-0 bg-black z-10 flex flex-row justify-between items-center">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-800 rounded-full"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h2 className="text-2xl font-bold">Saved Items</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-400">Loading saved items...</p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-red-400">{error}</p>
              </div>
            ) : (
              <>
                <div className="border-t border-gray-800">
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
                  {activeTab === 'artworks' && renderArtworkGrid(savedArtworks)}
                  {activeTab === 'artblogs' && renderArtblogs(savedArtblogs)}
                  {activeTab === 'announcements' && renderAnnouncements(savedAnnouncements)}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
};

export default SavedItems;

// import React, { useState, useEffect } from 'react';
// import { Card, CardHeader, CardContent } from '@/components/ui/card';
// import { Play, ArrowLeft } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const SavedItems = () => {
//     const [activeTab, setActiveTab] = useState('artworks');
//     const [savedArtworks, setSavedArtworks] = useState([]);
//     const [savedArtblogs, setSavedArtblogs] = useState([]);
//     const [savedAnnouncements, setSavedAnnouncements] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const navigate = useNavigate();
  
//     useEffect(() => {
//       const fetchSavedItems = async () => {
//         try {
//           setIsLoading(true);
//           setError(null);
  
//           const fetchOptions = {
//             credentials: 'include', // This ensures cookies are sent with the request
//             headers: {
//               'Content-Type': 'application/json'
//             }
//           };
  
//           const [artworksRes, artblogsRes, announcementsRes] = await Promise.all([
//             fetch('https://openart.onrender.com/openart/api/users/get-saved-artworks', fetchOptions),
//             fetch('https://openart.onrender.com/openart/api/users/get-saved-artblogs', fetchOptions),
//             fetch('https://openart.onrender.com/openart/api/users/get-saved-announcements', fetchOptions)
//           ]);
  
//           // Check responses
//           if (!artworksRes.ok || !artblogsRes.ok || !announcementsRes.ok) {
//             const errorData = await artworksRes.json();
//             throw new Error(errorData.message || 'Failed to fetch saved items');
//           }
  
//           const [artworksData, artblogsData, announcementsData] = await Promise.all([
//             artworksRes.json(),
//             artblogsRes.json(),
//             announcementsRes.json()
//           ]);
  
//           // Handle the nested structure of the response based on your API
//           setSavedArtworks(artworksData.data?.savedArtworks?.map(item => item.artwork) || []);
//           setSavedArtblogs(artblogsData.data?.savedArtblogs || []);
//           setSavedAnnouncements(announcementsData.data?.savedAnnouncements || []);
//         } catch (error) {
//           console.error('Error fetching saved items:', error);
//           setError(error.message || 'Failed to fetch saved items');
//         } finally {
//           setIsLoading(false);
//         }
//       };
  
//       fetchSavedItems();
//     }, [navigate]);

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
//     <div className="min-h-screen bg-black text-white">
//       <Card className="h-full min-h-screen bg-black border-0">
//         <CardHeader className="sticky top-0 bg-black z-10 flex flex-row justify-between items-center">
//           <div className="flex items-center gap-4">
//             <button 
//               onClick={() => navigate(-1)}
//               className="p-2 hover:bg-gray-800 rounded-full"
//             >
//               <ArrowLeft className="h-6 w-6" />
//             </button>
//             <h2 className="text-2xl font-bold">Saved Items</h2>
//           </div>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           {isLoading ? (
//             <div className="flex items-center justify-center h-64">
//               <p className="text-gray-400">Loading saved items...</p>
//             </div>
//           ) : error ? (
//             <div className="flex items-center justify-center h-64">
//               <p className="text-red-400">{error}</p>
//             </div>
//           ) : (
//             <>
//               <div className="border-t border-gray-800">
//                 <div className="flex gap-6 px-6 -mb-px">
//                   {['artworks', 'artblogs', 'announcements'].map((tab) => (
//                     <button
//                       key={tab}
//                       onClick={() => setActiveTab(tab)}
//                       className={`py-4 font-medium capitalize ${
//                         activeTab === tab
//                           ? 'text-white border-b-2 border-white'
//                           : 'text-gray-400 hover:text-gray-300'
//                       }`}
//                     >
//                       {tab}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="px-6">
//                 {activeTab === 'artworks' && renderArtworkGrid(savedArtworks)}
                
//                 {activeTab === 'artblogs' && (
//                   <div className="space-y-4">
//                     {savedArtblogs.map((blog) => (
//                       <Card key={blog._id} className="bg-gray-900 border-0">
//                         <CardContent className="p-4">
//                           <h5 className="font-semibold">{blog.title}</h5>
//                           <p className="text-gray-400 text-sm mt-2 line-clamp-3">{blog.content}</p>
//                         </CardContent>
//                       </Card>
//                     ))}
//                   </div>
//                 )}
                
//                 {activeTab === 'announcements' && renderAnnouncements(savedAnnouncements)}
//               </div>
//             </>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default SavedItems;