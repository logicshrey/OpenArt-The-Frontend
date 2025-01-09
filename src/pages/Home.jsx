// v0

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

// Debug component
const DebugBounds = () => (
  <div className="fixed inset-0 border-2 border-red-500 pointer-events-none z-50 opacity-50" />
);

// Floating Elements Component
const FloatingElements = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
    setMounted(true);

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-sm"
          style={{
            width: Math.random() * 100 + 20,
            height: Math.random() * 100 + 20,
          }}
          initial={{ 
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
            scale: 0
          }}
          animate={{ 
            x: [
              Math.random() * dimensions.width,
              Math.random() * dimensions.width,
              Math.random() * dimensions.width
            ],
            y: [
              Math.random() * dimensions.height,
              Math.random() * dimensions.height,
              Math.random() * dimensions.height
            ],
            scale: [0, 1, 0],
            opacity: [0, 0.3, 0]
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

// Animated Grid Component
const AnimatedGrid = () => (
  <div className="absolute inset-0">
    <div className="relative w-full h-full">
      <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-8 grid-rows-4 md:grid-rows-8 gap-4">
        {[...Array(32)].map((_, i) => (
          <motion.div
            key={i}
            className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg backdrop-blur-sm"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1, 0],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 4,
              delay: i * 0.1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

// Animated Waves Component
const AnimatedWaves = () => (
  <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
    <AnimatePresence>
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute border-2 border-purple-500/30 rounded-full"
          initial={{ 
            width: '100px',
            height: '100px',
            opacity: 0.5,
            scale: 0.5
          }}
          animate={{ 
            width: '1000px',
            height: '1000px',
            opacity: 0,
            scale: 1.5
          }}
          transition={{
            duration: 4,
            delay: i * 1.3,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      ))}
    </AnimatePresence>
  </div>
);

// Gradient Orbs Component
const GradientOrbs = () => (
  <>
    <motion.div 
      className="absolute -right-1/4 -top-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl"
      animate={{
        scale: [1, 1.2, 1],
        x: [0, 100, 0],
        y: [0, -50, 0],
        opacity: [0.2, 0.4, 0.2]
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }}
    />
    <motion.div 
      className="absolute -left-1/4 -bottom-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl"
      animate={{
        scale: [1.2, 1, 1.2],
        x: [0, -50, 0],
        y: [0, 100, 0],
        opacity: [0.3, 0.5, 0.3]
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  </>
);

const Navigation = ({ navigate }) => (
  <nav className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4 bg-black/50 backdrop-blur-sm">
    <div className="text-2xl font-bold">OpenArt</div>
    
    <div className="hidden md:flex items-center space-x-8">
      <a href="#about" className="hover:text-purple-300 transition-colors">About</a>
      <a href="#artists" className="hover:text-purple-300 transition-colors">Artists</a>
      <a href="#community" className="hover:text-purple-300 transition-colors">Community</a>
      <a href="#artverse" className="hover:text-purple-300 transition-colors">Artverse</a>
      <a href="#more" className="hover:text-purple-300 transition-colors">More</a>
    </div>
    
    <div className="flex items-center space-x-4">
      <button 
        className="text-purple-400 hover:text-purple-300 transition-colors"
        onClick={() => navigate('/login')}
      >
        Log In
      </button>
      <button 
        className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors"
        onClick={() => navigate('/register')}
      >
        Register Now
      </button>
    </div>
  </nav>
);

const HeroSection = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
    <motion.h1 
      className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      OpenArt
    </motion.h1>
    <motion.p 
      className="text-xl mb-8 max-w-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      Discover and share amazing digital art in our growing community of creators.
    </motion.p>
    <motion.div 
      className="flex gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <button className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors">
        Explore Art
      </button>
      <button className="border border-purple-400 text-purple-400 px-8 py-3 rounded-full hover:bg-purple-400/10 transition-colors">
        Join Community
      </button>
    </motion.div>
  </div>
);

const AboutSection = () => (
  <section id="about" className="min-h-screen py-20 px-4">
    <div className="max-w-6xl mx-auto">
      <motion.h2 
        className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        About OpenArt
      </motion.h2>
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
          <p className="text-gray-300 mb-6">
            We're building the future of digital art creation and sharing. Our platform enables artists to showcase their work, connect with others, and grow their creative careers.
          </p>
          <p className="text-gray-300">
            Join our vibrant community of artists, collectors, and art enthusiasts. Discover unique digital artworks, learn from top creators, and be part of the digital art revolution.
          </p>
        </motion.div>
        <motion.div
          className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-lg p-8"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="space-y-6">
            <div>
              <h4 className="text-xl font-semibold mb-2">🎨 Create</h4>
              <p className="text-gray-300">Express yourself through digital art with our powerful tools.</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-2">🌟 Share</h4>
              <p className="text-gray-300">Share your creations with our global community of art lovers.</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-2">💎 Collect</h4>
              <p className="text-gray-300">Build your collection of unique digital artworks.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const ArtistsSection = () => (
  <section id="artists" className="min-h-screen py-20 px-4 bg-black/50">
    <div className="max-w-6xl mx-auto">
      <motion.h2 
        className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        Featured Artists
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-6 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.2 }}
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2 text-center">Artist Name {i}</h3>
            <p className="text-gray-300 text-center mb-4">Digital Artist & Creator</p>
            <div className="flex justify-center">
              <button className="text-purple-400 hover:text-purple-300 transition-colors">
                View Profile
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const CommunitySection = () => (
  <section id="community" className="min-h-screen py-20 px-4">
    <div className="max-w-6xl mx-auto">
      <motion.h2 
        className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        Join Our Community
      </motion.h2>
      <div className="grid md:grid-cols-2 gap-12">
        <motion.div
          className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-8"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-2xl font-semibold mb-4">Community Features</h3>
          <ul className="space-y-4">
            <li className="flex items-center">
              <span className="mr-2">🎨</span>
              <span>Weekly Art Challenges</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">💬</span>
              <span>Artist Forums</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">🎓</span>
              <span>Learning Resources</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">🤝</span>
              <span>Collaboration Tools</span>
            </li>
          </ul>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-2xl font-semibold mb-4">Get Started Today</h3>
          <p className="text-gray-300 mb-6">
            Join thousands of artists who are already part of our growing community. Share your work, get feedback, and connect with fellow creators.
          </p>
          <button className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors">
            Join Now
          </button>
        </motion.div>
      </div>
    </div>
  </section>
);

const ArtverseSection = () => (
  <section id="artverse" className="min-h-screen py-20 px-4 bg-black/50">
    <div className="max-w-6xl mx-auto">
      <motion.h2 
        className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        Enter the Artverse
      </motion.h2>
      <div className="grid md:grid-cols-3 gap-8">
        {['Create', 'Explore', 'Connect'].map((title, i) => (
          <motion.div
            key={title}
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-6 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.2 }}
          >
            <h3 className="text-2xl font-semibold mb-4 text-center">{title}</h3>
            <p className="text-gray-300 text-center mb-6">
              Experience the future of digital art creation and sharing in our virtual art space.
            </p>
            <div className="flex justify-center">
              <button className="text-purple-400 hover:text-purple-300 transition-colors">
                Learn More
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const HomePage = () => {
  const navigate = useNavigate();
  const [debug, setDebug] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setDebug(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative bg-black text-white">
      {/* Background Animations */}
      <div className="fixed inset-0 z-0">
        <AnimatedGrid />
        <FloatingElements />
        <AnimatedWaves />
        <GradientOrbs />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/50 to-black pointer-events-none" />
        
        {debug && <DebugBounds />}
      </div>

      {/* Navigation */}
      <Navigation navigate={navigate} />

      {/* Main Content */}
      <div className="relative z-10">
        <HeroSection />
        <AboutSection />
        <ArtistsSection />
        <CommunitySection />
        <ArtverseSection />
      </div>
      
      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;

// version 3

// import React from 'react';
// import { motion } from 'framer-motion';
// import Footer from '../components/Footer';
// import { useNavigate } from 'react-router-dom';

// // Floating Elements Component
// const FloatingElements = () => (
//   <div className="absolute inset-0 overflow-hidden">
//     {[...Array(40)].map((_, i) => (
//       <motion.div
//         key={i}
//         className="absolute w-1 h-1 md:w-2 md:h-2 bg-purple-500/20 rounded-full"
//         initial={{ 
//           x: Math.random() * window.innerWidth,
//           y: Math.random() * window.innerHeight 
//         }}
//         animate={{ 
//           x: Math.random() * window.innerWidth,
//           y: Math.random() * window.innerHeight,
//           scale: [1, 1.5, 1],
//           opacity: [0.2, 0.5, 0.2]
//         }}
//         transition={{
//           duration: 10 + Math.random() * 20,
//           repeat: Infinity,
//           ease: "linear"
//         }}
//       />
//     ))}
//   </div>
// );

// // Animated Grid Component
// const AnimatedGrid = () => (
//   <div className="absolute inset-0">
//     <div className="relative w-full h-full">
//       <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-4 opacity-20">
//         {[...Array(64)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="bg-purple-500/10 rounded-lg"
//             initial={{ scale: 0.8, opacity: 0.1 }}
//             animate={{ 
//               scale: [0.8, 1, 0.8],
//               opacity: [0.1, 0.3, 0.1],
//             }}
//             transition={{
//               duration: 4,
//               delay: i * 0.1,
//               repeat: Infinity,
//               ease: "easeInOut"
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   </div>
// );

// // Animated Waves Component
// const AnimatedWaves = () => (
//   <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
//     {[...Array(4)].map((_, i) => (
//       <motion.div
//         key={i}
//         className="absolute w-[800px] h-[800px] border border-purple-500/20 rounded-full"
//         initial={{ scale: 0.5, opacity: 0 }}
//         animate={{ 
//           scale: [0.5, 2],
//           opacity: [0.5, 0]
//         }}
//         transition={{
//           duration: 4,
//           delay: i * 1,
//           repeat: Infinity,
//           ease: "easeOut"
//         }}
//       />
//     ))}
//   </div>
// );

// // Gradient Orb Component
// const GradientOrb = () => (
//   <motion.div 
//     className="absolute right-1/4 top-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl"
//     animate={{
//       scale: [1, 1.2, 1],
//       rotate: [0, 180],
//       opacity: [0.3, 0.5, 0.3]
//     }}
//     transition={{
//       duration: 20,
//       repeat: Infinity,
//       ease: "linear"
//     }}
//   />
// );

// const HomePage = () => {
//   const navigate = useNavigate();

//   return (
//     <>
//       <div className="min-h-screen bg-black text-white relative overflow-hidden">
//         {/* Background Animations */}
//         <div className="fixed inset-0 -z-10">
//           <AnimatedGrid />
//           <AnimatedWaves />
//           <FloatingElements />
//           <GradientOrb />
//           <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/50 to-black" />
//         </div>
        
//         {/* Navigation Bar */}
//         <nav className="flex items-center justify-between px-6 py-4 relative z-10 bg-black/50 backdrop-blur-sm">
//           <div className="text-2xl font-bold">OpenArt</div>
          
//           <div className="hidden md:flex items-center space-x-8">
//             <a href="#about" className="hover:text-purple-300 transition-colors">About</a>
//             <a href="#artists" className="hover:text-purple-300 transition-colors">Artists</a>
//             <a href="#community" className="hover:text-purple-300 transition-colors">Community</a>
//             <a href="#artverse" className="hover:text-purple-300 transition-colors">Artverse</a>
//             <a href="#more" className="hover:text-purple-300 transition-colors">More</a>
//           </div>
          
//           <div className="flex items-center space-x-4">
//             <button 
//               className="text-purple-400 hover:text-purple-300 transition-colors"
//               onClick={() => navigate('/login')}
//             >
//               Log In
//             </button>
//             <button 
//               className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors"
//               onClick={() => navigate('/register')}
//             >
//               Register Now
//             </button>
//           </div>
//         </nav>

//         {/* Hero Section */}
//         <main className="relative z-10 px-6 pt-20 md:pt-32 max-w-6xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//           >
//             <h1 className="text-6xl md:text-8xl font-bold mb-8">
//               Introducing
//               <br />
//               <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
//                 OpenArt
//               </span>
//             </h1>
            
//             <div className="max-w-md mb-12">
//               <p className="text-2xl md:text-3xl leading-relaxed text-gray-300">
//                 Open your art to the world. Deep dive into the artist's community.
//               </p>
//             </div>

//             <motion.button
//               className="bg-purple-600 text-white px-8 py-4 rounded-full text-lg hover:bg-purple-700 transition-all hover:scale-105 transform"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => navigate('/register')}
//             >
//               Register Now
//             </motion.button>
//           </motion.div>
//         </main>

//         {/* Rest of the code remains the same... */}
//       </div>

//       {/* About Section */}
//       <section className="bg-black text-white py-20 px-6 relative overflow-hidden">
//         <div className="max-w-6xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
//           >
//             {/* Artistic Cards */}
//             <div className="grid grid-cols-2 gap-6 relative h-[600px]">
//               <motion.div
//                 className="col-span-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 transform hover:scale-105 transition-transform"
//                 whileHover={{ scale: 1.05 }}
//               >
//                 <div className="h-full w-full bg-black/30 rounded-lg backdrop-blur-sm p-4">
//                   <h3 className="text-2xl font-bold mb-2">Digital Art</h3>
//                   <p className="text-gray-300">Explore the future of creativity</p>
//                 </div>
//               </motion.div>
              
//               <motion.div
//                 className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 transform hover:scale-105 transition-transform"
//                 whileHover={{ scale: 1.05 }}
//               >
//                 <div className="h-full w-full bg-black/30 rounded-lg backdrop-blur-sm p-4">
//                   <h3 className="text-xl font-bold mb-2">NFTs</h3>
//                   <p className="text-gray-300">Own your art</p>
//                 </div>
//               </motion.div>
              
//               <motion.div
//                 className="bg-gradient-to-br from-pink-600 to-red-600 rounded-2xl p-6 transform hover:scale-105 transition-transform"
//                 whileHover={{ scale: 1.05 }}
//               >
//                 <div className="h-full w-full bg-black/30 rounded-lg backdrop-blur-sm p-4">
//                   <h3 className="text-xl font-bold mb-2">Community</h3>
//                   <p className="text-gray-300">Connect with artists</p>
//                 </div>
//               </motion.div>
//             </div>

//             {/* Text Content */}
//             <motion.div
//               initial={{ opacity: 0, x: 50 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.8 }}
//               className="relative z-10"
//             >
//               <h2 className="text-5xl md:text-6xl font-bold mb-8">
//                 About
//                 <br />
//                 <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
//                   OpenArt
//                 </span>
//               </h2>
              
//               <div className="space-y-6">
//                 <p className="text-2xl font-light leading-relaxed">
//                   Level up your brand with the latest digital marketing trends.
//                 </p>
                
//                 <p className="text-gray-300 leading-relaxed">
//                   I'm a paragraph. Click here to add your own text and edit me. It's easy. 
//                   Just click "Edit Text" or double click me to add your own content and 
//                   make changes to the font. I'm a great place for you to tell a story and 
//                   let your users know a little more about you.
//                 </p>
//               </div>
//             </motion.div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Footer */}
//       <Footer />
//     </>
//   );
// };

// export default HomePage;


// version 1

// import React from 'react';
// import { motion } from 'framer-motion';
// import Footer from '../components/Footer';
// import { useNavigate } from 'react-router-dom';

// // Animated Background Component
// const AnimatedBackground = () => (
//   <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
//     {/* Animated gradient overlay */}
//     <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-black to-black animate-gradient" />
    
//     {/* Animated SVG patterns */}
//     <svg className="absolute w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
//       <defs>
//         <pattern id="pattern1" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
//           <circle cx="20" cy="20" r="2" fill="#6c2bd9" className="animate-pulse" />
//         </pattern>
//         <pattern id="pattern2" x="10" y="10" width="60" height="60" patternUnits="userSpaceOnUse">
//           <circle cx="30" cy="30" r="3" fill="#9f7aea" className="animate-ping" />
//         </pattern>
//       </defs>
//       <rect width="100%" height="100%" fill="url(#pattern1)" />
//       <rect width="100%" height="100%" fill="url(#pattern2)" />
//     </svg>

//     {/* Floating elements */}
//     <div className="absolute top-0 left-0 w-full h-full">
//       {[...Array(20)].map((_, i) => (
//         <div
//           key={i}
//           className="absolute w-4 h-4 bg-purple-500 rounded-full opacity-20 animate-float"
//           style={{
//             left: `${Math.random() * 100}%`,
//             top: `${Math.random() * 100}%`,
//             animationDelay: `${Math.random() * 5}s`,
//             animationDuration: `${5 + Math.random() * 10}s`
//           }}
//         />
//       ))}
//     </div>
//   </div>
// );


// // Main HomePage Component
// const HomePage = () => {
//   const navigate = useNavigate();

//   return (
//     <>
//       <div className="min-h-screen bg-black text-white relative overflow-hidden">
//         <AnimatedBackground />
        
//         {/* Navigation Bar */}
//         <nav className="flex items-center justify-between px-6 py-4 relative z-10 bg-black/50 backdrop-blur-sm">
//           <div className="text-2xl font-bold">OpenArt</div>
          
//           <div className="hidden md:flex items-center space-x-8">
//             <a href="#about" className="hover:text-purple-300 transition-colors">About</a>
//             <a href="#artists" className="hover:text-purple-300 transition-colors">Artists</a>
//             <a href="#community" className="hover:text-purple-300 transition-colors">Community</a>
//             <a href="#artverse" className="hover:text-purple-300 transition-colors">Artverse</a>
//             <a href="#more" className="hover:text-purple-300 transition-colors">More</a>
//           </div>
          
//           <div className="flex items-center space-x-4">
//             <button 
//               className="text-purple-400 hover:text-purple-300 transition-colors"
//               onClick={() => navigate('/login')}
//             >
//               Log In
//             </button>
//             <button 
//               className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors"
//               onClick={() => navigate('/register')}
//             >
//               Register Now
//             </button>
//           </div>
//         </nav>

//         {/* Hero Section */}
//         <main className="relative z-10 px-6 pt-20 md:pt-32 max-w-6xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//           >
//             <h1 className="text-6xl md:text-8xl font-bold mb-8">
//               Introducing
//               <br />
//               <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
//                 OpenArt
//               </span>
//             </h1>
            
//             <div className="max-w-md mb-12">
//               <p className="text-2xl md:text-3xl leading-relaxed text-gray-300">
//                 Open your art to the world. Deep dive into the artist's community.
//               </p>
//             </div>

//             <motion.button
//               className="bg-purple-600 text-white px-8 py-4 rounded-full text-lg hover:bg-purple-700 transition-all hover:scale-105 transform"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => navigate('/register')}
//             >
//               Register Now
//             </motion.button>
//           </motion.div>
//         </main>
//       </div>

//       {/* About Section with Artistic Cards */}
//       <section className="bg-black text-white py-20 px-6 relative overflow-hidden">
//         <div className="max-w-6xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
//           >
//             {/* Artistic Cards */}
//             <div className="grid grid-cols-2 gap-6 relative h-[600px]">
//               <motion.div
//                 className="col-span-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 transform hover:scale-105 transition-transform"
//                 whileHover={{ scale: 1.05 }}
//               >
//                 <div className="h-full w-full bg-black/30 rounded-lg backdrop-blur-sm p-4">
//                   <h3 className="text-2xl font-bold mb-2">Digital Art</h3>
//                   <p className="text-gray-300">Explore the future of creativity</p>
//                 </div>
//               </motion.div>
              
//               <motion.div
//                 className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 transform hover:scale-105 transition-transform"
//                 whileHover={{ scale: 1.05 }}
//               >
//                 <div className="h-full w-full bg-black/30 rounded-lg backdrop-blur-sm p-4">
//                   <h3 className="text-xl font-bold mb-2">NFTs</h3>
//                   <p className="text-gray-300">Own your art</p>
//                 </div>
//               </motion.div>
              
//               <motion.div
//                 className="bg-gradient-to-br from-pink-600 to-red-600 rounded-2xl p-6 transform hover:scale-105 transition-transform"
//                 whileHover={{ scale: 1.05 }}
//               >
//                 <div className="h-full w-full bg-black/30 rounded-lg backdrop-blur-sm p-4">
//                   <h3 className="text-xl font-bold mb-2">Community</h3>
//                   <p className="text-gray-300">Connect with artists</p>
//                 </div>
//               </motion.div>
//             </div>

//             {/* Text Content */}
//             <motion.div
//               initial={{ opacity: 0, x: 50 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.8 }}
//               className="relative z-10"
//             >
//               <h2 className="text-5xl md:text-6xl font-bold mb-8">
//                 About
//                 <br />
//                 <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
//                   OpenArt
//                 </span>
//               </h2>
              
//               <div className="space-y-6">
//                 <p className="text-2xl font-light leading-relaxed">
//                   Level up your brand with the latest digital marketing trends.
//                 </p>
                
//                 <p className="text-gray-300 leading-relaxed">
//                   I'm a paragraph. Click here to add your own text and edit me. It's easy. 
//                   Just click "Edit Text" or double click me to add your own content and 
//                   make changes to the font. I'm a great place for you to tell a story and 
//                   let your users know a little more about you.
//                 </p>
//               </div>
//             </motion.div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Footer */}
//       <Footer />
//     </>
//   );
// };

// export default HomePage;


// version 2

// import React, { useEffect, useRef } from 'react';
// import * as THREE from 'three';
// import { motion } from 'framer-motion';
// import Footer from '../components/Footer';
// import { useNavigate } from 'react-router-dom';


// const WaveBackground = () => {
//   const mountRef = useRef(null);

//   useEffect(() => {
//     let scene, camera, renderer, geometry, material, mesh;
//     let frameId;

//     const init = () => {
//       // Scene setup
//       scene = new THREE.Scene();
//       camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//       renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
//       renderer.setSize(window.innerWidth, window.innerHeight);
//       renderer.setClearColor(0x000000, 0);
//       mountRef.current.appendChild(renderer.domElement);

//       // Create geometry
//       geometry = new THREE.PlaneGeometry(20, 20, 50, 50);
//       material = new THREE.MeshPhongMaterial({
//         color: 0x6c2bd9,
//         wireframe: true,
//         side: THREE.DoubleSide,
//         transparent: true,
//         opacity: 0.3,
//       });

//       mesh = new THREE.Mesh(geometry, material);
//       mesh.rotation.x = -Math.PI / 4;
//       scene.add(mesh);

//       // Add lights
//       const light = new THREE.DirectionalLight(0xffffff, 1);
//       light.position.set(0, 1, 1);
//       scene.add(light);
//       scene.add(new THREE.AmbientLight(0xffffff, 0.5));

//       camera.position.z = 10;
//     };

//     const animate = () => {
//       frameId = requestAnimationFrame(animate);

//       const positions = geometry.attributes.position.array;
//       const time = Date.now() * 0.001;

//       for (let i = 0; i < positions.length; i += 3) {
//         positions[i + 2] = Math.sin(positions[i] / 2 + time) * 
//                           Math.cos(positions[i + 1] / 2 + time) * 0.5;
//       }

//       geometry.attributes.position.needsUpdate = true;
//       renderer.render(scene, camera);
//     };

//     const handleResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };

//     init();
//     animate();
//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//       cancelAnimationFrame(frameId);
//       if (mountRef.current) {
//         mountRef.current.removeChild(renderer.domElement);
//       }
//     };
//   }, []);

//   return <div ref={mountRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
// };

// const HomePage = () => {

//     const navigate = useNavigate(); 

//   return (
//     <>
//     <div className="min-h-screen bg-black text-white relative overflow-hidden">
//       <WaveBackground />
      
//       {/* Navigation Bar */}
//       <nav className="flex items-center justify-between px-6 py-4 relative z-10">
//         <div className="text-2xl font-bold">OpenArt</div>
        
//         <div className="hidden md:flex items-center space-x-8">
//           <a href="#about" className="hover:text-gray-300">About</a>
//           <a href="#artists" className="hover:text-gray-300">Artists</a>
//           <a href="#community" className="hover:text-gray-300">Community</a>
//           <a href="#artverse" className="hover:text-gray-300">Artverse</a>
//           <a href="#more" className="hover:text-gray-300">More</a>
//         </div>
        
//         <div className="flex items-center space-x-4">
//           <button className="text-blue-400 hover:text-blue-300"  onClick={() => navigate('/login')} >Log In</button>
//           <button className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200"  onClick={() => navigate('/register')}>
//             Register Now
//           </button>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <main className="relative z-10">
//         {/* Text Content */}
//         <div className="px-6 pt-20 md:pt-32 max-w-6xl mx-auto">
//           <h1 className="text-6xl md:text-8xl font-bold mb-8">
//             Introducing
//             <br />
//             OpenArt
//           </h1>
          
//           <div className="max-w-md mb-8">
//             <p className="text-2xl md:text-3xl leading-relaxed">
//               Open your art to the world. Deep dive into the artist's community.
//             </p>
//           </div>

//           <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg hover:bg-blue-700 transition-colors">
//             Register Now
//           </button>
//         </div>

//         {/* Purple Gradient Shape */}
//         <div className="absolute bottom-0 right-0 w-1/2 h-96">
//           <div className="w-full h-full bg-gradient-to-br from-purple-500/40 to-purple-600/40 rounded-tl-full transform -rotate-45"></div>
//         </div>
//       </main>
//     </div>

//     {/* About Section */}

//     <section className="min-h-screen bg-black text-white py-20 px-6 relative overflow-hidden">
//       <div className="max-w-6xl mx-auto">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
//           {/* Images Grid */}
//           <motion.div 
//             className="relative h-[600px]"
//             initial={{ opacity: 0, x: -50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//           >
//             {/* Top image with blue neon effect */}
//             <motion.div 
//               className="absolute top-0 left-0 w-3/4 z-10"
//               whileHover={{ scale: 1.02 }}
//               transition={{ duration: 0.3 }}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">
//                 <defs>
//                   <linearGradient id="neonGlow" x1="0" y1="0" x2="100%" y2="100%">
//                     <stop offset="0%" stopColor="#00ffff" stopOpacity="0.7"/>
//                     <stop offset="100%" stopColor="#0066ff" stopOpacity="0.9"/>
//                   </linearGradient>
//                   <filter id="blur">
//                     <feGaussianBlur stdDeviation="4"/>
//                   </filter>
//                 </defs>
//                 <rect width="400" height="500" fill="#1a1a1a"/>
//                 <g filter="url(#blur)">
//                   <line x1="0" y1="50" x2="400" y2="50" stroke="url(#neonGlow)" strokeWidth="2"/>
//                   <line x1="0" y1="150" x2="400" y2="150" stroke="url(#neonGlow)" strokeWidth="2"/>
//                   <line x1="0" y1="250" x2="400" y2="250" stroke="url(#neonGlow)" strokeWidth="2"/>
//                   <line x1="0" y1="350" x2="400" y2="350" stroke="url(#neonGlow)" strokeWidth="2"/>
//                 </g>
//               </svg>
//             </motion.div>

//             {/* Middle image with smoke effect */}
//             <motion.div 
//               className="absolute top-1/3 right-0 w-2/3 z-20"
//               whileHover={{ scale: 1.02 }}
//               transition={{ duration: 0.3 }}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
//                 <defs>
//                   <radialGradient id="smokeGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
//                     <stop offset="0%" stopColor="#00ffff" stopOpacity="0.8"/>
//                     <stop offset="100%" stopColor="#00ff99" stopOpacity="0"/>
//                   </radialGradient>
//                   <filter id="smokeBlur">
//                     <feGaussianBlur stdDeviation="15"/>
//                   </filter>
//                 </defs>
//                 <rect width="400" height="400" fill="#003322"/>
//                 <g filter="url(#smokeBlur)">
//                   <path d="M200,300 Q150,200 200,100 Q250,150 200,300" 
//                         fill="url(#smokeGradient)" opacity="0.6"/>
//                   <path d="M150,250 Q100,150 150,50 Q200,100 150,250" 
//                         fill="url(#smokeGradient)" opacity="0.4"/>
//                   <path d="M250,250 Q200,150 250,50 Q300,100 250,250" 
//                         fill="url(#smokeGradient)" opacity="0.5"/>
//                 </g>
//               </svg>
//             </motion.div>

//             {/* Bottom image with silhouette */}
//             <motion.div 
//               className="absolute bottom-0 left-1/4 w-1/2 z-30"
//               whileHover={{ scale: 1.02 }}
//               transition={{ duration: 0.3 }}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300">
//                 <defs>
//                   <linearGradient id="portalGlow" x1="0%" y1="0%" x2="100%" y2="0%">
//                     <stop offset="0%" stopColor="#9933ff" stopOpacity="0.8"/>
//                     <stop offset="100%" stopColor="#ff66ff" stopOpacity="0.4"/>
//                   </linearGradient>
//                 </defs>
//                 <rect width="200" height="300" fill="#1a1a2e"/>
//                 <rect x="50" y="50" width="100" height="200" fill="url(#portalGlow)" opacity="0.5"/>
//                 <path d="M100,80 Q120,100 120,140 L120,220 Q100,240 80,220 L80,140 Q80,100 100,80"
//                       fill="#000000" opacity="0.9"/>
//               </svg>
//             </motion.div>
//           </motion.div>

//           {/* Text Content */}
//           <motion.div 
//             className="relative z-40"
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.2 }}
//           >
//             <h2 className="text-5xl md:text-6xl font-bold mb-8">
//               About
//               <br />
//               OpenArt
//             </h2>
            
//             <div className="space-y-6">
//               <p className="text-2xl font-light leading-relaxed">
//                 Level up your brand with the latest digital marketing trends.
//               </p>
              
//               <p className="text-gray-300 leading-relaxed">
//                 I'm a paragraph. Click here to add your own text and edit me. It's easy. 
//                 Just click "Edit Text" or double click me to add your own content and 
//                 make changes to the font. I'm a great place for you to tell a story and 
//                 let your users know a little more about you.
//               </p>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </section>

//     {/* Footer */}

//     <Footer/>
//     </>
//   );
// };

// export default HomePage;