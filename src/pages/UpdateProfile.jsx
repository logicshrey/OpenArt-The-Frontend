import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { X, Upload, Lock, User, Briefcase, Tag, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Create axios instance with correct config
const api = axios.create({
    baseURL: 'https://openart.onrender.com/openart/api/users',
    withCredentials: true
});

// API response timeout
const TIMEOUT_DURATION = 30000; // 30 seconds

const UpdateProfile = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('details');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Form states
  const [userDetails, setUserDetails] = useState({
    fullName: '',
    email: '',
    country: '',
    bio: ''
  });
  
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: ''
  });
  
  const [accountType, setAccountType] = useState({
    accountType: '',
    artField: ''
  });
  
  const [contentChoice, setContentChoice] = useState([]);
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);

  // Clear messages after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
      setSuccessMessage('');
    }, 5000);
    return () => clearTimeout(timer);
  }, [error, successMessage]);

  const handleApiCall = async (apiFunction, successMsg) => {
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

      const response = await apiFunction(controller.signal);
      
      clearTimeout(timeoutId);
      setSuccessMessage(successMsg);
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        setError('Request timed out. Please try again.');
      } else if (!navigator.onLine) {
        setError('No internet connection. Please check your network.');
      } else if (error.response) {
        // Server responded with error
        setError(error.response.data?.message || `Error: ${error.response.status}`);
      } else if (error.request) {
        // Request made but no response
        setError('No response from server. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    try {
      await handleApiCall(
        (signal) => api.patch('/update_account_details', userDetails, { signal }),
        'Profile details updated successfully!'
      );
    } catch (error) {
      console.error('Error updating details:', error);
    }
  };

  const handleUpdateAvatar = async (e) => {
    e.preventDefault();
    if (!avatarFile) return;
    
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    
    try {
      await handleApiCall(
        (signal) => api.patch('/update_avatar', formData, {
          signal,
          headers: { 'Content-Type': 'multipart/form-data' }
        }),
        'Avatar updated successfully!'
      );
      setAvatarFile(null);
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };

  const handleUpdateCoverImage = async (e) => {
    e.preventDefault();
    if (!coverImageFile) return;
    
    const formData = new FormData();
    formData.append('coverImage', coverImageFile);
    
    try {
      await handleApiCall(
        (signal) => api.patch('/update_coverimage', formData, {
          signal,
          headers: { 'Content-Type': 'multipart/form-data' }
        }),
        'Cover image updated successfully!'
      );
      setCoverImageFile(null);
    } catch (error) {
      console.error('Error updating cover image:', error);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await handleApiCall(
        (signal) => api.patch('/change-password', passwords, { signal }),
        'Password changed successfully!'
      );
      setPasswords({ oldPassword: '', newPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  const handleChangeAccountType = async (e) => {
    e.preventDefault();
    try {
      await handleApiCall(
        (signal) => api.patch('/change-account-type', accountType, { signal }),
        'Account type updated successfully!'
      );
    } catch (error) {
      console.error('Error changing account type:', error);
    }
  };

  const handleUpdateContentChoice = async (e) => {
    e.preventDefault();
    try {
      await handleApiCall(
        (signal) => api.patch('/update-content-choice', { newContentChoice: contentChoice }, { signal }),
        'Content preferences updated successfully!'
      );
    } catch (error) {
      console.error('Error updating content choice:', error);
    }
  };

  const MobileSectionSelector = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out 
      ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
      <div className="flex justify-between items-center p-6 border-b border-gray-800">
        <h3 className="text-xl font-bold">Sections</h3>
        <button 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="p-2 hover:bg-gray-800 rounded-full"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className="py-4">
        {[
          { id: 'details', icon: User, label: 'Basic Details' },
          { id: 'images', icon: Upload, label: 'Images' },
          { id: 'password', icon: Lock, label: 'Password' },
          { id: 'account', icon: Briefcase, label: 'Account Type' },
          { id: 'content', icon: Tag, label: 'Content Choice' }
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => {
              setActiveSection(id);
              setIsMobileSidebarOpen(false);
            }}
            className={`flex items-center gap-3 w-full px-6 py-4 text-left ${
              activeSection === id
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
            }`}
          >
            <Icon className="h-5 w-5" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      {/* Mobile Section Selector */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out 
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h3 className="text-xl font-bold">Sections</h3>
          <button 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="p-2 hover:bg-gray-800 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="py-4">
          {[
            { id: 'details', icon: User, label: 'Basic Details' },
            { id: 'images', icon: Upload, label: 'Images' },
            { id: 'password', icon: Lock, label: 'Password' },
            { id: 'account', icon: Briefcase, label: 'Account Type' },
            { id: 'content', icon: Tag, label: 'Content Choice' }
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => {
                setActiveSection(id);
                setIsMobileSidebarOpen(false);
              }}
              className={`flex items-center gap-3 w-full px-6 py-4 text-left ${
                activeSection === id
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          ))}
        </div>
      </div>
  
      <Card className="max-w-4xl mx-auto bg-gray-900 border-0">
        <CardHeader className="flex flex-row justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden mr-4"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold">Update Profile</h2>
          </div>
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-gray-800 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </CardHeader>
  
        {error && (
          <Alert variant="destructive" className="mb-4 mx-4 md:mx-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {successMessage && (
          <Alert className="mb-4 mx-4 md:mx-6 bg-green-800 border-green-600">
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}
    
        <CardContent>
          {/* Desktop Section Selector */}
          <div className="hidden md:flex gap-4 mb-6 border-b border-gray-800">
            {[
              { id: 'details', icon: User, label: 'Basic Details' },
              { id: 'images', icon: Upload, label: 'Images' },
              { id: 'password', icon: Lock, label: 'Password' },
              { id: 'account', icon: Briefcase, label: 'Account Type' },
              { id: 'content', icon: Tag, label: 'Content Choice' }
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex items-center gap-2 py-4 px-2 ${
                  activeSection === id
                    ? 'text-white border-b-2 border-white'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            ))}
          </div>
  
          {activeSection === 'details' && (
            <form onSubmit={handleUpdateDetails} className="space-y-4 px-2 md:px-0">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={userDetails.fullName}
                  onChange={(e) => setUserDetails({...userDetails, fullName: e.target.value})}
                  className="w-full bg-gray-800 rounded-lg p-3"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={userDetails.email}
                  onChange={(e) => setUserDetails({...userDetails, email: e.target.value})}
                  className="w-full bg-gray-800 rounded-lg p-3"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Country</label>
                <input
                  type="text"
                  value={userDetails.country}
                  onChange={(e) => setUserDetails({...userDetails, country: e.target.value})}
                  className="w-full bg-gray-800 rounded-lg p-3"
                  placeholder="Enter your country"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  value={userDetails.bio}
                  onChange={(e) => setUserDetails({...userDetails, bio: e.target.value})}
                  className="w-full bg-gray-800 rounded-lg p-3 min-h-[100px]"
                  placeholder="Tell us about yourself"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-100"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Details'}
              </button>
            </form>
          )}
  
          {activeSection === 'images' && (
            <div className="space-y-6 px-2 md:px-0">
              <form onSubmit={handleUpdateAvatar} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Profile Picture</label>
                  <input
                    type="file"
                    onChange={(e) => setAvatarFile(e.target.files[0])}
                    className="w-full bg-gray-800 rounded-lg p-3"
                    accept="image/*"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-100"
                  disabled={isLoading || !avatarFile}
                >
                  {isLoading ? 'Uploading...' : 'Update Avatar'}
                </button>
              </form>
  
              <form onSubmit={handleUpdateCoverImage} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Cover Image</label>
                  <input
                    type="file"
                    onChange={(e) => setCoverImageFile(e.target.files[0])}
                    className="w-full bg-gray-800 rounded-lg p-3"
                    accept="image/*"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-100"
                  disabled={isLoading || !coverImageFile}
                >
                  {isLoading ? 'Uploading...' : 'Update Cover Image'}
                </button>
              </form>
            </div>
          )}
  
          {activeSection === 'password' && (
            <form onSubmit={handleChangePassword} className="space-y-4 px-2 md:px-0">
              <div>
                <label className="block text-sm font-medium mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwords.oldPassword}
                  onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})}
                  className="w-full bg-gray-800 rounded-lg p-3"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                  className="w-full bg-gray-800 rounded-lg p-3"
                  placeholder="Enter new password"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-100"
                disabled={isLoading || !passwords.oldPassword || !passwords.newPassword}
              >
                {isLoading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          )}
  
          {activeSection === 'account' && (
            <form onSubmit={handleChangeAccountType} className="space-y-4 px-2 md:px-0">
              <div>
                <label className="block text-sm font-medium mb-2">Account Type</label>
                <select
                  value={accountType.accountType}
                  onChange={(e) => setAccountType({...accountType, accountType: e.target.value})}
                  className="w-full bg-gray-800 rounded-lg p-3"
                >
                  <option value="">Select Account Type</option>
                  <option value="creator">Creator</option>
                  <option value="collector">Collector</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Art Field</label>
                <input
                  type="text"
                  value={accountType.artField}
                  onChange={(e) => setAccountType({...accountType, artField: e.target.value})}
                  className="w-full bg-gray-800 rounded-lg p-3"
                  placeholder="Enter your art field"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-100"
                disabled={isLoading || !accountType.accountType || !accountType.artField}
              >
                {isLoading ? 'Updating...' : 'Update Account Type'}
              </button>
            </form>
          )}
  
          {activeSection === 'content' && (
            <form onSubmit={handleUpdateContentChoice} className="space-y-4 px-2 md:px-0">
              <div className="space-y-2">
                <label className="block text-sm font-medium mb-2">Content Preferences</label>
                {['Digital Art', 'Traditional Art', 'Photography', 'Sculpture', 'Installation', 'Performance'].map((choice) => (
                  <label key={choice} className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded">
                    <input
                      type="checkbox"
                      checked={contentChoice.includes(choice)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setContentChoice([...contentChoice, choice]);
                        } else {
                          setContentChoice(contentChoice.filter(c => c !== choice));
                        }
                      }}
                      className="rounded bg-gray-800"
                    />
                    {choice}
                  </label>
                ))}
              </div>
              <button 
                type="submit" 
                className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-100"
                disabled={isLoading || contentChoice.length === 0}
              >
                {isLoading ? 'Updating...' : 'Update Content Preferences'}
              </button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default UpdateProfile;



// import React, { useState, useEffect } from 'react';
// import { Card, CardHeader, CardContent } from '@/components/ui/card';
// import { X, Upload, Lock, User, Briefcase, Tag } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Alert, AlertDescription } from '@/components/ui/alert';

// // Create axios instance with correct config
// const api = axios.create({
//     baseURL: 'https://openart.onrender.com/openart/api/users',
//     withCredentials: true
// });

// // API response timeout
// const TIMEOUT_DURATION = 30000; // 30 seconds

// const UpdateProfile = () => {
//   const navigate = useNavigate();
//   const [activeSection, setActiveSection] = useState('details');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
  
//   // Form states remain the same
//   const [userDetails, setUserDetails] = useState({
//     fullName: '',
//     email: '',
//     country: '',
//     bio: ''
//   });
  
//   const [passwords, setPasswords] = useState({
//     oldPassword: '',
//     newPassword: ''
//   });
  
//   const [accountType, setAccountType] = useState({
//     accountType: '',
//     artField: ''
//   });
  
//   const [contentChoice, setContentChoice] = useState([]);
//   const [avatarFile, setAvatarFile] = useState(null);
//   const [coverImageFile, setCoverImageFile] = useState(null);

//   // Clear messages after 5 seconds
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setError('');
//       setSuccessMessage('');
//     }, 5000);
//     return () => clearTimeout(timer);
//   }, [error, successMessage]);

//   const handleApiCall = async (apiFunction, successMsg) => {
//     setIsLoading(true);
//     setError('');
//     setSuccessMessage('');

//     try {
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

//       const response = await apiFunction(controller.signal);
      
//       clearTimeout(timeoutId);
//       setSuccessMessage(successMsg);
//       return response.data;
//     } catch (error) {
//       if (axios.isCancel(error)) {
//         setError('Request timed out. Please try again.');
//       } else if (!navigator.onLine) {
//         setError('No internet connection. Please check your network.');
//       } else if (error.response) {
//         // Server responded with error
//         setError(error.response.data?.message || `Error: ${error.response.status}`);
//       } else if (error.request) {
//         // Request made but no response
//         setError('No response from server. Please try again.');
//       } else {
//         setError('An unexpected error occurred. Please try again.');
//       }
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleUpdateDetails = async (e) => {
//     e.preventDefault();
//     try {
//       await handleApiCall(
//         (signal) => api.patch('/update_account_details', userDetails, { signal }),
//         'Profile details updated successfully!'
//       );
//     } catch (error) {
//       console.error('Error updating details:', error);
//     }
//   };

//   const handleUpdateAvatar = async (e) => {
//     e.preventDefault();
//     if (!avatarFile) return;
    
//     const formData = new FormData();
//     formData.append('avatar', avatarFile);
    
//     try {
//       await handleApiCall(
//         (signal) => api.patch('/update_avatar', formData, {
//           signal,
//           headers: { 'Content-Type': 'multipart/form-data' }
//         }),
//         'Avatar updated successfully!'
//       );
//       setAvatarFile(null);
//     } catch (error) {
//       console.error('Error updating avatar:', error);
//     }
//   };

//   const handleUpdateCoverImage = async (e) => {
//     e.preventDefault();
//     if (!coverImageFile) return;
    
//     const formData = new FormData();
//     formData.append('coverImage', coverImageFile);
    
//     try {
//       await handleApiCall(
//         (signal) => api.patch('/update_coverimage', formData, {
//           signal,
//           headers: { 'Content-Type': 'multipart/form-data' }
//         }),
//         'Cover image updated successfully!'
//       );
//       setCoverImageFile(null);
//     } catch (error) {
//       console.error('Error updating cover image:', error);
//     }
//   };

//   const handleChangePassword = async (e) => {
//     e.preventDefault();
//     try {
//       await handleApiCall(
//         (signal) => api.patch('/change-password', passwords, { signal }),
//         'Password changed successfully!'
//       );
//       setPasswords({ oldPassword: '', newPassword: '' });
//     } catch (error) {
//       console.error('Error changing password:', error);
//     }
//   };

//   const handleChangeAccountType = async (e) => {
//     e.preventDefault();
//     try {
//       await handleApiCall(
//         (signal) => api.patch('/change-account-type', accountType, { signal }),
//         'Account type updated successfully!'
//       );
//     } catch (error) {
//       console.error('Error changing account type:', error);
//     }
//   };

//   const handleUpdateContentChoice = async (e) => {
//     e.preventDefault();
//     try {
//       await handleApiCall(
//         (signal) => api.patch('/update-content-choice', { newContentChoice: contentChoice }, { signal }),
//         'Content preferences updated successfully!'
//       );
//     } catch (error) {
//       console.error('Error updating content choice:', error);
//     }
//   };

//   return (
//         <div className="min-h-screen bg-black text-white p-6">
//           <Card className="max-w-4xl mx-auto bg-gray-900 border-0">
//             <CardHeader className="flex flex-row justify-between items-center">
//               <h2 className="text-2xl font-bold">Update Profile</h2>
//               <button 
//                 onClick={() => navigate(-1)} 
//                 className="p-2 hover:bg-gray-800 rounded-full"
//               >
//                 <X className="h-6 w-6" />
//               </button>
//             </CardHeader>
    
//             {error && (
//               <Alert variant="destructive" className="mb-4 mx-6">
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}
            
//             {successMessage && (
//               <Alert className="mb-4 mx-6 bg-green-800 border-green-600">
//                 <AlertDescription>{successMessage}</AlertDescription>
//               </Alert>
//             )}
        
//         <CardContent>
//           <div className="flex gap-4 mb-6 border-b border-gray-800">
//             {[
//               { id: 'details', icon: User, label: 'Basic Details' },
//               { id: 'images', icon: Upload, label: 'Images' },
//               { id: 'password', icon: Lock, label: 'Password' },
//               { id: 'account', icon: Briefcase, label: 'Account Type' },
//               { id: 'content', icon: Tag, label: 'Content Choice' }
//             ].map(({ id, icon: Icon, label }) => (
//               <button
//                 key={id}
//                 onClick={() => setActiveSection(id)}
//                 className={`flex items-center gap-2 py-4 px-2 ${
//                   activeSection === id
//                     ? 'text-white border-b-2 border-white'
//                     : 'text-gray-400 hover:text-gray-300'
//                 }`}
//               >
//                 <Icon className="h-5 w-5" />
//                 {label}
//               </button>
//             ))}
//           </div>

//           {activeSection === 'details' && (
//             <form onSubmit={handleUpdateDetails} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-2">Full Name</label>
//                 <input
//                   type="text"
//                   value={userDetails.fullName}
//                   onChange={(e) => setUserDetails({...userDetails, fullName: e.target.value})}
//                   className="w-full bg-gray-800 rounded-lg p-3"
//                   placeholder="Enter your full name"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2">Email</label>
//                 <input
//                   type="email"
//                   value={userDetails.email}
//                   onChange={(e) => setUserDetails({...userDetails, email: e.target.value})}
//                   className="w-full bg-gray-800 rounded-lg p-3"
//                   placeholder="Enter your email"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2">Country</label>
//                 <input
//                   type="text"
//                   value={userDetails.country}
//                   onChange={(e) => setUserDetails({...userDetails, country: e.target.value})}
//                   className="w-full bg-gray-800 rounded-lg p-3"
//                   placeholder="Enter your country"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2">Bio</label>
//                 <textarea
//                   value={userDetails.bio}
//                   onChange={(e) => setUserDetails({...userDetails, bio: e.target.value})}
//                   className="w-full bg-gray-800 rounded-lg p-3 min-h-[100px]"
//                   placeholder="Tell us about yourself"
//                 />
//               </div>
//               <button 
//                 type="submit" 
//                 className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-100"
//                 disabled={isLoading}
//               >
//                 {isLoading ? 'Updating...' : 'Update Details'}
//               </button>
//             </form>
//           )}

//           {activeSection === 'images' && (
//             <div className="space-y-6">
//               <form onSubmit={handleUpdateAvatar} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Profile Picture</label>
//                   <input
//                     type="file"
//                     onChange={(e) => setAvatarFile(e.target.files[0])}
//                     className="w-full bg-gray-800 rounded-lg p-3"
//                     accept="image/*"
//                   />
//                 </div>
//                 <button 
//                   type="submit" 
//                   className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-100"
//                   disabled={isLoading || !avatarFile}
//                 >
//                   {isLoading ? 'Uploading...' : 'Update Avatar'}
//                 </button>
//               </form>

//               <form onSubmit={handleUpdateCoverImage} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Cover Image</label>
//                   <input
//                     type="file"
//                     onChange={(e) => setCoverImageFile(e.target.files[0])}
//                     className="w-full bg-gray-800 rounded-lg p-3"
//                     accept="image/*"
//                   />
//                 </div>
//                 <button 
//                   type="submit" 
//                   className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-100"
//                   disabled={isLoading || !coverImageFile}
//                 >
//                   {isLoading ? 'Uploading...' : 'Update Cover Image'}
//                 </button>
//               </form>
//             </div>
//           )}

//           {activeSection === 'password' && (
//             <form onSubmit={handleChangePassword} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-2">Current Password</label>
//                 <input
//                   type="password"
//                   value={passwords.oldPassword}
//                   onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})}
//                   className="w-full bg-gray-800 rounded-lg p-3"
//                   placeholder="Enter current password"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2">New Password</label>
//                 <input
//                   type="password"
//                   value={passwords.newPassword}
//                   onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
//                   className="w-full bg-gray-800 rounded-lg p-3"
//                   placeholder="Enter new password"
//                 />
//               </div>
//               <button 
//                 type="submit" 
//                 className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-100"
//                 disabled={isLoading || !passwords.oldPassword || !passwords.newPassword}
//               >
//                 {isLoading ? 'Changing...' : 'Change Password'}
//               </button>
//             </form>
//           )}

//           {activeSection === 'account' && (
//             <form onSubmit={handleChangeAccountType} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-2">Account Type</label>
//                 <select
//                   value={accountType.accountType}
//                   onChange={(e) => setAccountType({...accountType, accountType: e.target.value})}
//                   className="w-full bg-gray-800 rounded-lg p-3"
//                 >
//                   <option value="">Select Account Type</option>
//                   <option value="creator">Creator</option>
//                   <option value="collector">Collector</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2">Art Field</label>
//                 <input
//                   type="text"
//                   value={accountType.artField}
//                   onChange={(e) => setAccountType({...accountType, artField: e.target.value})}
//                   className="w-full bg-gray-800 rounded-lg p-3"
//                   placeholder="Enter your art field"
//                 />
//               </div>
//               <button 
//                 type="submit" 
//                 className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-100"
//                 disabled={isLoading || !accountType.accountType || !accountType.artField}
//               >
//                 {isLoading ? 'Updating...' : 'Update Account Type'}
//               </button>
//             </form>
//           )}

//           {activeSection === 'content' && (
//             <form onSubmit={handleUpdateContentChoice} className="space-y-4">
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium mb-2">Content Preferences</label>
//                 {['Digital Art', 'Traditional Art', 'Photography', 'Sculpture', 'Installation', 'Performance'].map((choice) => (
//                   <label key={choice} className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded">
//                     <input
//                       type="checkbox"
//                       checked={contentChoice.includes(choice)}
//                       onChange={(e) => {
//                         if (e.target.checked) {
//                           setContentChoice([...contentChoice, choice]);
//                         } else {
//                           setContentChoice(contentChoice.filter(c => c !== choice));
//                         }
//                       }}
//                       className="rounded bg-gray-800"
//                     />
//                     {choice}
//                   </label>
//                 ))}
//               </div>
//               <button 
//                 type="submit" 
//                 className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-100"
//                 disabled={isLoading || contentChoice.length === 0}
//               >
//                 {isLoading ? 'Updating...' : 'Update Content Preferences'}
//               </button>
//             </form>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default UpdateProfile;
