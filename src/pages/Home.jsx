import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';


const WaveBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    let scene, camera, renderer, geometry, material, mesh;
    let frameId;

    const init = () => {
      // Scene setup
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);
      mountRef.current.appendChild(renderer.domElement);

      // Create geometry
      geometry = new THREE.PlaneGeometry(20, 20, 50, 50);
      material = new THREE.MeshPhongMaterial({
        color: 0x6c2bd9,
        wireframe: true,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3,
      });

      mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI / 4;
      scene.add(mesh);

      // Add lights
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(0, 1, 1);
      scene.add(light);
      scene.add(new THREE.AmbientLight(0xffffff, 0.5));

      camera.position.z = 10;
    };

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      const positions = geometry.attributes.position.array;
      const time = Date.now() * 0.001;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] = Math.sin(positions[i] / 2 + time) * 
                          Math.cos(positions[i + 1] / 2 + time) * 0.5;
      }

      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    init();
    animate();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};

const HomePage = () => {

    const navigate = useNavigate(); 

  return (
    <>
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <WaveBackground />
      
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-6 py-4 relative z-10">
        <div className="text-2xl font-bold">OpenArt</div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#about" className="hover:text-gray-300">About</a>
          <a href="#artists" className="hover:text-gray-300">Artists</a>
          <a href="#community" className="hover:text-gray-300">Community</a>
          <a href="#artverse" className="hover:text-gray-300">Artverse</a>
          <a href="#more" className="hover:text-gray-300">More</a>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="text-blue-400 hover:text-blue-300"  onClick={() => navigate('/login')} >Log In</button>
          <button className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200"  onClick={() => navigate('/register')}>
            Register Now
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10">
        {/* Text Content */}
        <div className="px-6 pt-20 md:pt-32 max-w-6xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-8">
            Introducing
            <br />
            OpenArt
          </h1>
          
          <div className="max-w-md mb-8">
            <p className="text-2xl md:text-3xl leading-relaxed">
              Open your art to the world. Deep dive into the artist's community.
            </p>
          </div>

          <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg hover:bg-blue-700 transition-colors">
            Register Now
          </button>
        </div>

        {/* Purple Gradient Shape */}
        <div className="absolute bottom-0 right-0 w-1/2 h-96">
          <div className="w-full h-full bg-gradient-to-br from-purple-500/40 to-purple-600/40 rounded-tl-full transform -rotate-45"></div>
        </div>
      </main>
    </div>

    {/* About Section */}

    <section className="min-h-screen bg-black text-white py-20 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Images Grid */}
          <motion.div 
            className="relative h-[600px]"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Top image with blue neon effect */}
            <motion.div 
              className="absolute top-0 left-0 w-3/4 z-10"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">
                <defs>
                  <linearGradient id="neonGlow" x1="0" y1="0" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00ffff" stopOpacity="0.7"/>
                    <stop offset="100%" stopColor="#0066ff" stopOpacity="0.9"/>
                  </linearGradient>
                  <filter id="blur">
                    <feGaussianBlur stdDeviation="4"/>
                  </filter>
                </defs>
                <rect width="400" height="500" fill="#1a1a1a"/>
                <g filter="url(#blur)">
                  <line x1="0" y1="50" x2="400" y2="50" stroke="url(#neonGlow)" strokeWidth="2"/>
                  <line x1="0" y1="150" x2="400" y2="150" stroke="url(#neonGlow)" strokeWidth="2"/>
                  <line x1="0" y1="250" x2="400" y2="250" stroke="url(#neonGlow)" strokeWidth="2"/>
                  <line x1="0" y1="350" x2="400" y2="350" stroke="url(#neonGlow)" strokeWidth="2"/>
                </g>
              </svg>
            </motion.div>

            {/* Middle image with smoke effect */}
            <motion.div 
              className="absolute top-1/3 right-0 w-2/3 z-20"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
                <defs>
                  <radialGradient id="smokeGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor="#00ffff" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="#00ff99" stopOpacity="0"/>
                  </radialGradient>
                  <filter id="smokeBlur">
                    <feGaussianBlur stdDeviation="15"/>
                  </filter>
                </defs>
                <rect width="400" height="400" fill="#003322"/>
                <g filter="url(#smokeBlur)">
                  <path d="M200,300 Q150,200 200,100 Q250,150 200,300" 
                        fill="url(#smokeGradient)" opacity="0.6"/>
                  <path d="M150,250 Q100,150 150,50 Q200,100 150,250" 
                        fill="url(#smokeGradient)" opacity="0.4"/>
                  <path d="M250,250 Q200,150 250,50 Q300,100 250,250" 
                        fill="url(#smokeGradient)" opacity="0.5"/>
                </g>
              </svg>
            </motion.div>

            {/* Bottom image with silhouette */}
            <motion.div 
              className="absolute bottom-0 left-1/4 w-1/2 z-30"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300">
                <defs>
                  <linearGradient id="portalGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#9933ff" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="#ff66ff" stopOpacity="0.4"/>
                  </linearGradient>
                </defs>
                <rect width="200" height="300" fill="#1a1a2e"/>
                <rect x="50" y="50" width="100" height="200" fill="url(#portalGlow)" opacity="0.5"/>
                <path d="M100,80 Q120,100 120,140 L120,220 Q100,240 80,220 L80,140 Q80,100 100,80"
                      fill="#000000" opacity="0.9"/>
              </svg>
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <motion.div 
            className="relative z-40"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              About
              <br />
              OpenArt
            </h2>
            
            <div className="space-y-6">
              <p className="text-2xl font-light leading-relaxed">
                Level up your brand with the latest digital marketing trends.
              </p>
              
              <p className="text-gray-300 leading-relaxed">
                I'm a paragraph. Click here to add your own text and edit me. It's easy. 
                Just click "Edit Text" or double click me to add your own content and 
                make changes to the font. I'm a great place for you to tell a story and 
                let your users know a little more about you.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Footer */}

    <Footer/>
    </>
  );
};

export default HomePage;