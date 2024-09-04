import React from 'react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 z-10">
      <div className="flex items-center">
        <img src="/Logo_Genui.jpeg" alt="logo" className="h-8 mr-4" />
        <nav className="flex items-center space-x-2">
          <a href="/stockbot" className="text-gray-700 hover:text-gray-900">GenuiBot</a>
          <span className="text-gray-300">/</span>
          <a href="/new" className="text-black hover:text-black-600 hover:underline">Start New Chat</a>
        </nav>
      </div>
    
    </header>
  );
};

export default Header;