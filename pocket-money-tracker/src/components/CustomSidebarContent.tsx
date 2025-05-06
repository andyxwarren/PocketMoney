import React from 'react';
import '../styles/CustomSidebarContent.css';

interface CustomSidebarContentProps {
  children: React.ReactNode;
}

const CustomSidebarContent: React.FC<CustomSidebarContentProps> = ({ children }) => {
  return (
    <main className="custom-sidebar-content">
      <div className="content-wrapper">
        {children}
      </div>
    </main>
  );
};

export default CustomSidebarContent;
