import React from 'react';
import '../styles/CustomSidebar.css';

interface CustomSidebarProps {
  children: React.ReactNode;
}

const CustomSidebar: React.FC<CustomSidebarProps> = ({ children }) => {
  return (
    <aside className="custom-sidebar">
      <div className="sidebar-logo">
        <img src="/images/piggy-bank.svg" alt="Piggy Bank" className="sidebar-logo-image" />
        <h2>Money Buddy</h2>
      </div>
      {children}
    </aside>
  );
};

export default CustomSidebar;
