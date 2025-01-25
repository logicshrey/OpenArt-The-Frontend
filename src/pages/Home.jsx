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
    <div onClick={() => navigate('/')} className="text-2xl font-bold cursor-pointer">OpenArt</div>
    
    <div className="hidden md:flex items-center space-x-8">
      <a href="#about" className="hover:text-purple-300 transition-colors">About</a>
      <a href="https://artsandculture.google.com/category/artist" className="hover:text-purple-300 transition-colors">Artists</a>
      <a href="#community" className="hover:text-purple-300 transition-colors">Community</a>
      <a href="#artverse" className="hover:text-purple-300 transition-colors">Artverse</a>
      <a href="/https://artsocietyofindia.org/" className="hover:text-purple-300 transition-colors">More</a>
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

const HeroSection = ({navigate}) => (
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
      Open your art to the world. Deep dive into the growing community of creators.
    </motion.p>
    <motion.div 
      className="flex gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <button  onClick={() => navigate('/register')} className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors">
        Explore Art
      </button>
      <button  onClick={() => navigate('/register')}  className="border border-purple-400 text-purple-400 px-8 py-3 rounded-full hover:bg-purple-400/10 transition-colors">
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
          At OpenArt, we are crafting the future of artistic expression and collaboration. Our mission is to empower artists of every form - painters, musicians, writers, designers, photographers, and more - to showcase their creativity, connect with a global audience, and grow their artistic journey.
          </p>
          <p className="text-gray-300">
          Join us in revolutionizing the way art is created, shared, and celebrated. Whether you're a creator or an admirer, OpenArt is where art finds its voice and artists build their future.
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
              <p className="text-gray-300">Unleash your creativity and showcase your art with ease.</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-2">🌟 Share</h4>
              <p className="text-gray-300">Connect with a global community of artists and art enthusiasts.</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-2">💎 Collect</h4>
              <p className="text-gray-300">Discover and curate a unique collection of inspiring digital artworks.
</p>
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

const CommunitySection = ({navigate}) => (
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
              <span>Global Art Events</span>
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
          <button onClick={() => navigate('/login')}  className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors">
            Join Now
          </button>
        </motion.div>
      </div>
    </div>
  </section>
);

const ArtverseSection = ({navigate}) => (
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
              <button onClick={() => navigate('/login')} className="text-purple-400 hover:text-purple-300 transition-colors">
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
        <HeroSection navigate={navigate} />
        <AboutSection />
        <CommunitySection navigate={navigate} />
        <ArtverseSection navigate={navigate} />
      </div>
      
      {/* Footer */}
      <div className="relative z-10">
        <Footer navigate={navigate} />
      </div>
    </div>
  );
};

export default HomePage;
