import React, { useState } from 'react';
import '../styles/CustomSidebarLayout.css';

interface CustomSidebarLayoutProps {
  children: React.ReactNode;
}

const CustomSidebarLayout: React.FC<CustomSidebarLayoutProps> = ({ children }) => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className={`layout-container ${sidebarVisible ? '' : 'sidebar-hidden'}`}>
      <button 
        className="toggle-sidebar-btn" 
        onClick={toggleSidebar}
        aria-label={sidebarVisible ? "Hide sidebar" : "Show sidebar"}
      >
        {sidebarVisible ? '◀' : '▶'}
      </button>
      {children}
    </div>
  );
};

export default CustomSidebarLayout;
