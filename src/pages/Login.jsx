import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting to login with:', formData); // Log the request data
      
      const response = await fetch('https://openart.onrender.com/openart/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status); // Log the response status
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      console.log('Login successful:', data);
      navigate('/artworks');
      
    } catch (err) {
      console.error('Detailed login error:', err); // More detailed error logging
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
};

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center mb-16">
        <div className="text-xl font-bold cursor-pointer" onClick={() => navigate('/')}>OpenArt</div>
        <div className="flex gap-6 items-center">
          <a href="#" className="hover:text-gray-300">About</a>
          <a href="https://artsandculture.google.com/category/artist" className="hover:text-gray-300">Artists</a>
          <a href="https://artsocietyofindia.org" className="hover:text-gray-300">Community</a>
          <a href="#" className="hover:text-gray-300">Artverse</a>
          <a href="#" className="hover:text-gray-300">More</a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Login to your account</h1>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <label className="block mb-2">
              Username
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div className="mb-8">
            <label className="block mb-2">
              Password
              <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-md transition-colors ${
              isLoading 
                ? 'bg-purple-400 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-700'
            } text-white`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-center mt-4 text-gray-400">
            Don't have an account? {' '}
            <span 
              onClick={() => navigate('/register')} 
              className="text-purple-500 hover:text-purple-400 cursor-pointer"
            >
              Register here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;



// Default Version 

// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const LoginForm = () => {

//     const navigate = useNavigate(); 

//   return (
//     <div className="min-h-screen bg-black text-white p-8">
//       {/* Navigation Bar */}
//       <nav className="flex justify-between items-center mb-16">
//         <div className="text-xl font-bold">OpenArt</div>
//         <div className="flex gap-6 items-center">
//           <a href="#" className="hover:text-gray-300">About</a>
//           <a href="#" className="hover:text-gray-300">Artists</a>
//           <a href="#" className="hover:text-gray-300">Community</a>
//           <a href="#" className="hover:text-gray-300">Artverse</a>
//           <a href="#" className="hover:text-gray-300">More</a>
//           {/* <button 
//             className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
//           >
//             Register
//           </button> */}
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div className="max-w-2xl mx-auto">
//         <h1 className="text-4xl font-bold text-center mb-8">Login to your account</h1>

//         <div className="mb-8">
//           <label className="block mb-2">
//             Username or Email
//             <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             className="w-full p-3 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:border-purple-500"
//             required
//           />
//         </div>

//         <div className="mb-8">
//           <label className="block mb-2">
//             Password
//             <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="password"
//             className="w-full p-3 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:border-purple-500"
//             required
//           />
//         </div>

//         <button
//           className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 transition-colors"
//         >
//           Login
//         </button>

//         <p className="text-center mt-4 text-gray-400">
//           Don't have an account? <a href="/register" className="text-purple-500 hover:text-purple-400">Register here</a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LoginForm;