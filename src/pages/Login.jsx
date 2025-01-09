import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {

    const navigate = useNavigate(); 

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center mb-16">
        <div className="text-xl font-bold">OpenArt</div>
        <div className="flex gap-6 items-center">
          <a href="#" className="hover:text-gray-300">About</a>
          <a href="#" className="hover:text-gray-300">Artists</a>
          <a href="#" className="hover:text-gray-300">Community</a>
          <a href="#" className="hover:text-gray-300">Artverse</a>
          <a href="#" className="hover:text-gray-300">More</a>
          {/* <button 
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Register
          </button> */}
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Login to your account</h1>

        <div className="mb-8">
          <label className="block mb-2">
            Username or Email
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
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
            className="w-full p-3 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:border-purple-500"
            required
          />
        </div>

        <button
          className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 transition-colors"
        >
          Login
        </button>

        <p className="text-center mt-4 text-gray-400">
          Don't have an account? <a href="/register" className="text-purple-500 hover:text-purple-400">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;