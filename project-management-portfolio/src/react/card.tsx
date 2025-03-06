// components/Card.tsx
import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

export type CardBackground = 'instagram' | 'firstfloor' | 'cofolios' | 'curve';
type CardSize = 'small' | 'large';

interface CardProps {
  background: CardBackground;
  size: CardSize;
  mediaUrl: string;
  isVideo?: boolean;
  link?: string;
}

const CardContainer = styled.div<{
  size: CardSize,
  background: CardBackground,
  clickable: boolean
}>`
  ${({ size }) => size === 'small' ? `
    width: 100%;
    height: 620px;
  ` : `
    width: 100%;
    height: 620px;
  `}
  
  ${({ background }) => {
    switch(background) {
      case 'instagram': return 'background: linear-gradient(45deg, #F8D849 0%, #EE8131 33%, #EA336B 66%, #6E3BF1 100%);';
      case 'firstfloor': return 'background-color: #403DFF;';
      case 'cofolios': return 'background-color:rgb(10, 99, 225);';
      case 'curve': return 'background-color: #FFE500;';
    }
  }}
  
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Bounce effect on hover */
  cursor: ${({ clickable }) => clickable ? 'pointer' : 'default'};
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    transform: translateY(-5px) scale(1.03); /* Added scale for zoom effect */
  }

  @media (max-width: 1024px) {
    height: auto;
    aspect-ratio: ${({ size }) => size === 'small' ? '450/620' : '720/620'};
  }

  @media (max-width: 768px) {
    aspect-ratio: unset;
    height: 400px;
  }
`;

const MediaContainer = styled.div`
  width: 80%;
  height: 70%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card: React.FC<CardProps> = ({
  background,
  size,
  mediaUrl,
  isVideo = false,
  link }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Fix for the ESLint warning and proper video handling
  useEffect(() => {
    if (!isVideo || !videoRef.current) return;
    
    const video = videoRef.current;
    video.muted = true;
    
    // Handle video playback
    const playVideo = () => {
      video.play().catch(error => {
        console.warn("Video play failed:", error);
        
        // Retry play on user interaction
        const retryPlay = () => {
          video.play().catch(e => console.warn("Play failed again:", e));
          document.removeEventListener('click', retryPlay);
        };
        
        document.addEventListener('click', retryPlay);
      });
    };
    
    // Try playing if ready, otherwise wait for canplay event
    if (video.readyState >= 3) {
      playVideo();
    } else {
      video.addEventListener('canplay', playVideo);
    }
    
    // Proper cleanup using the stored reference
    return () => {
      video.removeEventListener('canplay', playVideo);
      video.pause();
    };
  }, [isVideo]);

  const handleClick = () => {
    if (link) window.open(link, '_blank');
  };

  return (
    <CardContainer
      size={size}
      background={background}
      clickable={!!link}
      onClick={handleClick}
    >
      <MediaContainer>
        {isVideo ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '16px'
            }}
          >
            {/* Removed process.env.PUBLIC_URL prefix - not needed for assets in public folder */}
            <source src={mediaUrl} type="video/mp4" />
            <source src={mediaUrl.replace('.mp4', '.webm')} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={mediaUrl}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '16px',
            }}
          />
        )}
      </MediaContainer>
    </CardContainer>
  );
};

export default Card;