import React from 'react';
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Checkbox } from "@/components/ui/checkbox.jsx";
import { Facebook, Twitter, Linkedin } from 'lucide-react';

const Footer = ({navigate}) => {
  return (
    <div className="bg-gradient-to-br from-purple-100 to-purple-300 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Newsletter Section */}
        <div className="mb-16">
          <h2 className="text-4xl mb-8 font-light text-gray-800">Stay in<br />the Know</h2>
          
          <div className="space-y-4 max-w-xl">
            <div>
              <label htmlFor="email" className="block text-sm mb-2 text-gray-700">Email *</label>
              <Input 
                type="email" 
                id="email" 
                className="w-full bg-transparent border-b border-gray-600 rounded-none focus:border-gray-800 focus:ring-0 px-0 text-gray-800 placeholder-gray-600"
                placeholder="Enter your email"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="newsletter" className="rounded-sm" />
              <label htmlFor="newsletter" className="text-sm text-gray-700">
                Yes, subscribe me to your newsletter.
              </label>
            </div>
            
            <Button onClick={() => navigate('/login')} className="bg-blue-600 hover:bg-blue-700 rounded-full px-8 text-white">
              Sign Up
            </Button>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-t border-gray-400/20 pt-8">
          {/* Company Info */}
          <div className="mb-4 md:mb-0">
            <h3 className="font-medium mb-2 text-gray-800">OpenArt</h3>
            <p className="text-sm text-gray-700">
              For any questions please email<br />
              logicshrey@gmail.com
            </p>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-start md:items-center mb-4 md:mb-0">
            <div className="mb-2 text-gray-700">
              Visit our <a href="#" className="underline text-gray-800">website</a>
            </div>
            <div className="flex space-x-4 text-gray-700">
              <a href="#" className="hover:text-blue-600">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-blue-600">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-blue-600">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Address */}
          <div className="text-right text-sm text-gray-700">
            Sector 13, New Panvel,<br />
            Navi Mumbai, India
          </div>
        </div>

        {/* Copyright */}
        <div className="text-sm text-center mt-8 pt-8 border-t border-gray-400/20 text-gray-700">
          © 2025 powered and managed by OpenArt
        </div>
      </div>
    </div>
  );
};

export default Footer;