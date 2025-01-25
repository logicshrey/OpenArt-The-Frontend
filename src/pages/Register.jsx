import React, { useState } from 'react';
import { User, Upload, Lock, Mail, Globe, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    country: '',
    accountType: 'creator', // Default value
    artField: '',
    username: '',
    bio: '',
    avatar: null,
    coverImage: null,
    password: '',
    contentChoice: [] // Will store as array directly
  });

  const contentTypes = [
    'Music',
    'Dance',
    'Poetry',
    'Acting',
    'Writing',
    'Digital Art',
    'Traditional Art',
    'Photography',
    'Sculptures',
    'Sports',
    'Illustrations',
    'Sketching'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'checkbox') {
      // Modified to handle contentChoice as direct array
      const updatedChoices = checked
        ? [...formData.contentChoice, value]
        : formData.contentChoice.filter(choice => choice !== value);
      
      setFormData(prevState => ({
        ...prevState,
        contentChoice: updatedChoices
      }));
    } else if (type === 'file') {
      setFormData(prevState => ({
        ...prevState,
        [name]: files[0]
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Create FormData object for handling file uploads
      const submitData = new FormData();
      
      // Modified to handle contentChoice differently
      Object.keys(formData).forEach(key => {
        if (key === 'avatar' || key === 'coverImage') {
          if (formData[key]) {
            submitData.append(key, formData[key]);
          }
        } else if (key === 'contentChoice') {
          // Instead of JSON.stringify, append each choice separately
          formData[key].forEach((choice, index) => {
            submitData.append(`contentChoice[${index}]`, choice);
          });
        } else {
          submitData.append(key, formData[key]);
        }
      });

      const response = await fetch('https://openart.onrender.com/openart/api/users/register', {
        method: 'POST',
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      
      // Clear form
      setFormData({
        fullName: '',
        email: '',
        country: '',
        accountType: 'creator',
        artField: '',
        username: '',
        bio: '',
        avatar: null,
        coverImage: null,
        password: '',
        contentChoice: []
      });

      // Redirect to login page
      navigate('/login');
      
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Header */}
      <nav className="flex justify-between items-center mb-16">
        <div className="text-xl font-bold cursor-pointer" onClick={() => navigate('/')}>OpenArt</div>
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/login')} className="bg-transparent border border-white px-4 py-2 rounded-full hover:bg-white hover:text-black transition-colors">
            Log In
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Create Your Account</h1>
        
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-6">
            <div className="flex gap-4">
              <User className="mt-1" size={20} />
              <div className="flex-1">
                <label className="block mb-2">Full Name<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-transparent border border-gray-600 rounded focus:border-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Mail className="mt-1" size={20} />
              <div className="flex-1">
                <label className="block mb-2">Email<span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-transparent border border-gray-600 rounded focus:border-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Globe className="mt-1" size={20} />
              <div className="flex-1">
                <label className="block mb-2">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-transparent border border-gray-600 rounded focus:border-white focus:outline-none"
                >
                  <option value="">Select a country</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="India">India</option>
                </select>
              </div>
            </div>
          </div>

          {/* Account Type Section */}
          <div className="border-t border-gray-600 pt-6">
            <label className="block mb-4">Account Type<span className="text-red-500">*</span></label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="accountType"
                  value="artist"
                  checked={formData.accountType === 'artist'}
                  onChange={handleChange}
                  className="text-indigo-600"
                />
                Artist
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="accountType"
                  value="organization"
                  checked={formData.accountType === 'organization'}
                  onChange={handleChange}
                  className="text-indigo-600"
                />
                Organization
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="accountType"
                  value="user"
                  checked={formData.accountType === 'user'}
                  onChange={handleChange}
                  className="text-indigo-600"
                />
                User
              </label>
            </div>
          </div>

          {/* Art Field Section */}
          <div className="flex gap-4">
            <Palette className="mt-1" size={20} />
            <div className="flex-1">
              <label className="block mb-2">Art Field</label>
              <input
                type="text"
                name="artField"
                value={formData.artField}
                onChange={handleChange}
                placeholder="e.g., Music, Photography, Painting"
                className="w-full px-4 py-2 bg-transparent border border-gray-600 rounded focus:border-white focus:outline-none"
              />
            </div>
          </div>

          {/* Username & Password Section */}
          <div className="space-y-6">
            <div className="flex gap-4">
              <User className="mt-1" size={20} />
              <div className="flex-1">
                <label className="block mb-2">Username<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-transparent border border-gray-600 rounded focus:border-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Lock className="mt-1" size={20} />
              <div className="flex-1">
                <label className="block mb-2">Password<span className="text-red-500">*</span></label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-transparent border border-gray-600 rounded focus:border-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div>
            <label className="block mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 bg-transparent border border-gray-600 rounded focus:border-white focus:outline-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Image Upload Section */}
          <div className="space-y-6">
            <div>
              <label className="block mb-2">Profile Avatar</label>
              <div className="flex items-center gap-4">
                <Upload size={20} />
                <input
                  type="file"
                  name="avatar"
                  onChange={handleChange}
                  accept="image/*"
                  className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2">Cover Image</label>
              <div className="flex items-center gap-4">
                <Upload size={20} />
                <input
                  type="file"
                  name="coverImage"
                  onChange={handleChange}
                  accept="image/*"
                  className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                />
              </div>
            </div>
          </div>

          {/* Content Choice Section */}
          <div className="border-t border-gray-600 pt-6">
            <label className="block mb-4">Content Interests</label>
            <div className="grid grid-cols-2 gap-4">
              {contentTypes.map(type => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="contentChoice"
                    value={type}
                    checked={formData.contentChoice.includes(type)}
                    onChange={handleChange}
                    className="text-indigo-600"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 ${
              isLoading 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white rounded transition-colors mt-8`}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;





// Default Version 

// import React, { useState } from 'react';
// import { User, Upload, Lock, Mail, Globe, Palette } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';


// const RegistrationForm = () => {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     country: '',
//     accountType: 'creator', // Default value
//     artField: '',
//     username: '',
//     bio: '',
//     avatar: null,
//     coverImage: null,
//     password: '',
//     contentChoice: []
//   });

//   const contentTypes = [
//     'Music',
//     'Dance',
//     'Poetry',
//     'Acting',
//     'Writing',
//     'Digital Art',
//     'Traditional Art',
//     'Photography',
//     'Sculptures',
//     'Sports',
//     'Illustrations',
//     'Cooking',
//   ];

//   const handleChange = (e) => {
//     const { name, value, type, checked, files } = e.target;
    
//     if (type === 'checkbox') {
//       const updatedChoices = checked
//         ? [...formData.contentChoice, value]
//         : formData.contentChoice.filter(choice => choice !== value);
      
//       setFormData(prevState => ({
//         ...prevState,
//         contentChoice: updatedChoices
//       }));
//     } else if (type === 'file') {
//       setFormData(prevState => ({
//         ...prevState,
//         [name]: files[0]
//       }));
//     } else {
//       setFormData(prevState => ({
//         ...prevState,
//         [name]: value
//       }));
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Form submitted:', formData);
//   };

//     const navigate = useNavigate(); 
  
//   return (
//     <div className="min-h-screen bg-black text-white p-8">
//       {/* Header */}
//       <nav className="flex justify-between items-center mb-16">
//         <div className="text-xl font-bold cursor-pointer" onClick={() => navigate('/')}>OpenArt</div>
//         <div className="flex items-center gap-6">
//           <a href="#" className="hover:text-gray-300">About</a>
//           <a href="#" className="hover:text-gray-300">Artists</a>
//           <a href="#" className="hover:text-gray-300">Community</a>
//           <a href="#" className="hover:text-gray-300">Artverse</a>
//           <a href="#" className="hover:text-gray-300">More</a>
//           <button  onClick={() => navigate('/login')} className="bg-transparent border border-white px-4 py-2 rounded-full hover:bg-white hover:text-black transition-colors">
//             Log In
//           </button>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div className="max-w-3xl mx-auto">
//         <h1 className="text-4xl font-bold mb-8">Create Your Account</h1>
        
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Basic Information Section */}
//           <div className="space-y-6">
//             <div className="flex gap-4">
//               <User className="mt-1" size={20} />
//               <div className="flex-1">
//                 <label className="block mb-2">Full Name<span className="text-red-500">*</span></label>
//                 <input
//                   type="text"
//                   name="fullName"
//                   value={formData.fullName}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-2 bg-transparent border border-gray-600 rounded focus:border-white focus:outline-none"
//                 />
//               </div>
//             </div>

//             <div className="flex gap-4">
//               <Mail className="mt-1" size={20} />
//               <div className="flex-1">
//                 <label className="block mb-2">Email<span className="text-red-500">*</span></label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-2 bg-transparent border border-gray-600 rounded focus:border-white focus:outline-none"
//                 />
//               </div>
//             </div>

//             <div className="flex gap-4">
//               <Globe className="mt-1" size={20} />
//               <div className="flex-1">
//                 <label className="block mb-2">Country</label>
//                 <select
//                   name="country"
//                   value={formData.country}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 bg-transparent border border-gray-600 rounded focus:border-white focus:outline-none"
//                 >
//                   <option value="">Select a country</option>
//                   <option value="US">United States</option>
//                   <option value="UK">United Kingdom</option>
//                   <option value="CA">Canada</option>
//                   <option value="AU">Australia</option>
//                   <option value="IN">India</option>
//                   {/* Add more countries as needed */}
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Account Type Section */}
//           <div className="border-t border-gray-600 pt-6">
//             <label className="block mb-4">Account Type<span className="text-red-500">*</span></label>
//             <div className="flex gap-6">
//               <label className="flex items-center gap-2">
//                 <input
//                   type="radio"
//                   name="accountType"
//                   value="artist"
//                   checked={formData.accountType === 'artist'}
//                   onChange={handleChange}
//                   className="text-indigo-600"
//                 />
//                 Artist
//               </label>
//               <label className="flex items-center gap-2">
//                 <input
//                   type="radio"
//                   name="accountType"
//                   value="organization"
//                   checked={formData.accountType === 'organization'}
//                   onChange={handleChange}
//                   className="text-indigo-600"
//                 />
//                 Organization
//               </label>
//               <label className="flex items-center gap-2">
//                 <input
//                   type="radio"
//                   name="accountType"
//                   value="user"
//                   checked={formData.accountType === 'user'}
//                   onChange={handleChange}
//                   className="text-indigo-600"
//                 />
//                 User
//               </label>
//             </div>
//           </div>

//           {/* Art Field Section */}
//           <div className="flex gap-4">
//             <Palette className="mt-1" size={20} />
//             <div className="flex-1">
//               <label className="block mb-2">Art Field</label>
//               <input
//                 type="text"
//                 name="artField"
//                 value={formData.artField}
//                 onChange={handleChange}
//                 placeholder="e.g., Music, Photography, Painting"
//                 className="w-full px-4 py-2 bg-transparent border border-gray-600 rounded focus:border-white focus:outline-none"
//               />
//             </div>
//           </div>

//           {/* Username & Password Section */}
//           <div className="space-y-6">
//             <div className="flex gap-4">
//               <User className="mt-1" size={20} />
//               <div className="flex-1">
//                 <label className="block mb-2">Username<span className="text-red-500">*</span></label>
//                 <input
//                   type="text"
//                   name="username"
//                   value={formData.username}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-2 bg-transparent border border-gray-600 rounded focus:border-white focus:outline-none"
//                 />
//               </div>
//             </div>

//             <div className="flex gap-4">
//               <Lock className="mt-1" size={20} />
//               <div className="flex-1">
//                 <label className="block mb-2">Password<span className="text-red-500">*</span></label>
//                 <input
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-2 bg-transparent border border-gray-600 rounded focus:border-white focus:outline-none"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Bio Section */}
//           <div>
//             <label className="block mb-2">Bio</label>
//             <textarea
//               name="bio"
//               value={formData.bio}
//               onChange={handleChange}
//               rows={4}
//               className="w-full px-4 py-2 bg-transparent border border-gray-600 rounded focus:border-white focus:outline-none"
//               placeholder="Tell us about yourself..."
//             />
//           </div>

//           {/* Image Upload Section */}
//           <div className="space-y-6">
//             <div>
//               <label className="block mb-2">Profile Avatar</label>
//               <div className="flex items-center gap-4">
//                 <Upload size={20} />
//                 <input
//                   type="file"
//                   name="avatar"
//                   onChange={handleChange}
//                   accept="image/*"
//                   className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block mb-2">Cover Image</label>
//               <div className="flex items-center gap-4">
//                 <Upload size={20} />
//                 <input
//                   type="file"
//                   name="coverImage"
//                   onChange={handleChange}
//                   accept="image/*"
//                   className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Content Choice Section */}
//           <div className="border-t border-gray-600 pt-6">
//             <label className="block mb-4">Content Interests</label>
//             <div className="grid grid-cols-2 gap-4">
//               {contentTypes.map(type => (
//                 <label key={type} className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     name="contentChoice"
//                     value={type}
//                     checked={formData.contentChoice.includes(type)}
//                     onChange={handleChange}
//                     className="text-indigo-600"
//                   />
//                   {type}
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors mt-8"
//           >
//             Create Account
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RegistrationForm;