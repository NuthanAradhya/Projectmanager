import React, { useState, useEffect } from 'react';

// Cursor types
export type CursorType = 
  | 'default' 
  | 'pointer' 
  | 'text' 
  | 'image' 
  | 'button' 
  | 'link' 
  | 'grab' 
  | 'grabbing'
  | 'none';

// Custom hook to manage cursor
export const useCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursorType, setCursorType] = useState<CursorType>('default');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Set body cursor to none to hide default cursor
    document.body.style.cursor = 'none';

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    const handleMouseEnter = () => {
      setVisible(true);
    };

    window.addEventListener('mousemove', updatePosition);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Auto-detect elements for cursor changes
    const handleElementDetection = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.tagName === 'BUTTON' || 
          target.closest('button') || 
          target.tagName === 'A' || 
          target.closest('a') ||
          target.hasAttribute('role') && target.getAttribute('role') === 'button') {
        setCursorType('button');
      } else if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        setCursorType('text');
      } else if (target.tagName === 'IMG' || target.closest('img') || target.getAttribute('role') === 'img') {
        setCursorType('image');
      } else {
        setCursorType('default');
      }
    };

    window.addEventListener('mouseover', handleElementDetection);

    return () => {
      document.body.style.cursor = 'auto';
      window.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleElementDetection);
    };
  }, []);

  return { position, cursorType, setCursorType, visible };
};

// CustomCursor component
export const CustomCursor: React.FC = () => {
  const { position, cursorType, visible } = useCursor();

  if (!visible) return null;

  const getCursorIcon = () => {
    switch (cursorType) {
      case 'default':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 2L18 12L12 14L16 22L14 23L10 15L6 18L6 2Z" fill="white" stroke="black" strokeWidth="1"/>
          </svg>
        );
      case 'pointer':
      case 'button':
      case 'link':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 2L9 14L13 11L17 19L19 18L15 10L19 8L7 2Z" fill="white" stroke="black" strokeWidth="1"/>
          </svg>
        );
      case 'text':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 4V20M16 4V20M10 4H14M10 20H14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'image':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" stroke="white" fill="none" strokeWidth="2"/>
            <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'grab':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 6V11M12 4V11M15 6V11M7 11C7 9.89543 7.89543 9 9 9C9 7.89543 9.89543 7 11 7C11 5.89543 11.8954 5 13 5C14.1046 5 15 5.89543 15 7C16.1046 7 17 7.89543 17 9C17 10.1046 16.1046 11 15 11H9C7.89543 11 7 10.1046 7 11ZM7 11V16C7 18.2091 8.79086 20 11 20H13C15.2091 20 17 18.2091 17 16V11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'grabbing':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 6V11M12 4V11M15 6V11M7 14C7 12.8954 7.89543 12 9 12C9 10.8954 9.89543 10 11 10C11 8.89543 11.8954 8 13 8C14.1046 8 15 8.89543 15 10C16.1046 10 17 10.8954 17 12C17 13.1046 16.1046 14 15 14H9C7.89543 14 7 13.1046 7 14ZM7 14V16C7 18.2091 8.79086 20 11 20H13C15.2091 20 17 18.2091 17 16V14" stroke="white" strokeWidth="2" strokeLinecap="round" fill="rgba(255,255,255,0.3)"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 9999,
        transition: 'transform 0.05s ease-out',
        mixBlendMode: 'difference',
      }}
    >
      {getCursorIcon()}
    </div>
  );
};

// Export a standalone component that can be used without the context
export const StandaloneCursor: React.FC = () => {
  return <CustomCursor />;
};