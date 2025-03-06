import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { StandaloneCursor, useCursor } from "./cursorUtils"; // Import custom cursor
import BentoGrid from './BentoGrid';
import AboutPage from './AboutPage';

// Define types for responsive styling
type CSSProperties = React.CSSProperties;

interface ResponsiveStyles {
  desktop: CSSProperties;
  mobile: CSSProperties;
}

// First half: Constants, state definitions, and helper functions
const ResponsiveGridLayout: React.FC = () => {
  // Refs
  const noiseOverlayRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const animationId = useRef<number | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // State
  const [opacity, setOpacity] = useState<number>(0); // For fade-in effect
  const [blurAmount, setBlurAmount] = useState<number>(10); // For blur effect
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);
  const [isVideoError, setIsVideoError] = useState<boolean>(false);
  const [videoRetries, setVideoRetries] = useState<number>(0);
  const [videoSrc, setVideoSrc] = useState<string>("/video/1.mp4");
  
  // Add cursor hook
  const { setCursorType } = useCursor();

  // Helper function to apply responsive styles based on viewport
  const useResponsiveStyles = (styles: ResponsiveStyles): CSSProperties => {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
      const checkMobile = (): void => {
        setIsMobile(window.innerWidth < 768);
      };

      checkMobile();
      window.addEventListener("resize", checkMobile);

      return () => {
        window.removeEventListener("resize", checkMobile);
      };
    }, []);

    return isMobile ? { ...styles.desktop, ...styles.mobile } : styles.desktop;
  };

  const scrollToCaseStudies = (): void => {
    const caseStudiesSection = document.getElementById("case-studies");
    if (caseStudiesSection) {
      caseStudiesSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Responsive styles
  const titleContainerStyles = useResponsiveStyles({
    desktop: {
      gridColumn: "1 / span 5",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      maxWidth: "100%",
      marginTop: "-20px", // Moving title up by approximately 100px
    },
    mobile: {
      gridColumn: "1 / span 12",
      maxWidth: "100%",
      marginTop: "-5px",
      gap: "0.5rem",
      // Adjusted for mobile
    },
  });

  const mediaContainerStyles = useResponsiveStyles({
    desktop: {
      gridColumn: "6 / span 7",
      maxWidth: "100%",
    },
    mobile: {
      gridColumn: "1 / span 12",
      marginTop: "0.5rem",
      maxWidth: "100%",
    },
  });

  // Enhanced video handling
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // Array of possible video sources to try
    const videoSources = [
      "/video/1.mp4",
      `${process.env.PUBLIC_URL}/video/1.mp4`,
      "/project-management-portfolio/public/video/1.mp4",
      "https://example.com/video/1.mp4",
      // Add CDN fallback if available
      "https://cdn.example.com/videos/fallback.mp4"
    ];

    // Video load handler
    const handleVideoLoad = () => {
      setIsVideoLoaded(true);
      setIsVideoError(false);
      console.log("Video loaded successfully");
    };

    // Video error handler with retry logic
    const handleVideoError = () => {
      console.log(`Video load error. Retry attempt: ${videoRetries + 1}`);
      
      if (videoRetries < videoSources.length - 1) {
        // Try next source
        setVideoRetries(prev => prev + 1);
        setVideoSrc(videoSources[videoRetries + 1]);
      } else {
        console.log("All video sources failed, showing fallback");
        setIsVideoError(true);
      }
    };

    // Set up event listeners
    videoElement.addEventListener('loadeddata', handleVideoLoad);
    videoElement.addEventListener('error', handleVideoError);

    // Set initial source
    videoElement.src = videoSrc;

    // Set up video preloading
    videoElement.preload = "auto";

    // Cleanup
    return () => {
      videoElement.removeEventListener('loadeddata', handleVideoLoad);
      videoElement.removeEventListener('error', handleVideoError);
      videoElement.src = "";
    };
  }, [videoSrc, videoRetries]);
 
  // ThreeJS noise effect
  useEffect(() => {
    const noiseElement = noiseOverlayRef.current;
    if (!noiseElement) return;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
    camera.position.z = 1;

    // Renderer setup - important to use alpha: true for transparency
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    rendererRef.current = renderer;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    noiseElement.appendChild(renderer.domElement);

    // More pronounced noise material with higher contrast and opacity
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        resolution: { value: new THREE.Vector2() },
      },
      fragmentShader: `
        precision highp float;
        uniform float time;
        uniform vec2 resolution;

        // Improved noise function for more pronounced grain
        float hash(vec2 p) {
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p + 45.32);
          return fract(p.x * p.y);
        }

        void main() {
          vec2 uv = gl_FragCoord.xy / resolution.xy;
          
          // Multi-layered noise for a more complex texture
          float noise = 0.0;
          
          // Layer 1: fine grain
          noise += hash(uv * 12.0 + time * 0.05) * 0.4;
          
          // Layer 2: medium grain
          noise += hash(uv * 6.0 - time * 0.03) * 0.3;
          
          // Layer 3: coarse grain
          noise += hash(uv * 3.0 + time * 0.02) * 0.3;
          
          // Make noise more prominent by increasing contrast
          noise = (noise - 0.4) * 1.8 + 0.2;
          
          // Create the final color with higher opacity
          vec3 color = vec3(noise * 0.8);
          gl_FragColor = vec4(color, 0.2); // Much higher opacity for visibility
        }
      `,
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    // Animation loop
    const animate = (): void => {
      material.uniforms.time.value += 0.008; // Slightly slower animation speed
      material.uniforms.resolution.value.set(
        window.innerWidth * window.devicePixelRatio,
        window.innerHeight * window.devicePixelRatio
      );
      renderer.render(scene, camera);
      animationId.current = requestAnimationFrame(animate);
    };
    animate();

    // Resize handler
    const handleResize = (): void => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.resolution.value.set(
        window.innerWidth * window.devicePixelRatio,
        window.innerHeight * window.devicePixelRatio
      );
    };

    window.addEventListener("resize", handleResize);

    // Fade-in and blur effect
    const animationDuration = 20;
    const animationStart = performance.now();

    const fadeInBlurAnimation = (): void => {
      const now = performance.now();
      const elapsedTime = now - animationStart;

      if (elapsedTime < animationDuration) {
        const progress = elapsedTime / animationDuration;
        setOpacity(progress);
        setBlurAmount(10 * (1 - progress)); // Blur starts at 10px and goes to 0
        requestAnimationFrame(fadeInBlurAnimation);
      } else {
        setOpacity(1);
        setBlurAmount(0);
      }
    };

    fadeInBlurAnimation();

    // FIXED scrollbar styling - More visible blue scrollbar
    const addCustomScrollbarStyles = (): void => {
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        /* Basic scrollbar customization */
        ::-webkit-scrollbar {
          width: 8px; /* Increased width for visibility */
          height: 8px;
          background: transparent;
        }
        
        /* Track styling */
        ::-webkit-scrollbar-track {
          background: rgba(17, 17, 17, 0.7); /* Dark but slightly visible track */
          border-radius: 4px;
        }
        
        /* Thumb styling - bright blue for visibility */
        ::-webkit-scrollbar-thumb {
          background: #4169e1; /* Royal blue */
          border-radius: 4px;
          border: 2px solid rgba(17, 17, 17, 0.1);
        }
        
        /* Hover state */
        ::-webkit-scrollbar-thumb:hover {
          background: #5179f1; /* Slightly lighter blue on hover */
        }
        
        /* Firefox scrollbar */
        * {
          scrollbar-width: thin;
          scrollbar-color: #4169e1 rgba(17, 17, 17, 0.7);
        }
        
        /* Force document background color */
        :root, body {
          background-color: #111111;
          overflow-x: hidden;
          scrollbar-width: thin;
          scrollbar-color: #4169e1 rgba(17, 17, 17, 0.7);
        }
        
        /* Ensure scrollbar components don't show default style */
        ::-webkit-scrollbar-corner,
        ::-webkit-scrollbar-button {
          display: none;
        }
      `;
      document.head.appendChild(styleElement);
    };
    
    addCustomScrollbarStyles();

    // Cleanup
    return () => {
      if (animationId.current) cancelAnimationFrame(animationId.current);
      window.removeEventListener("resize", handleResize);

      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (noiseElement.contains(rendererRef.current.domElement)) {
          noiseElement.removeChild(rendererRef.current.domElement);
        }
      }
    };
  }, []);

  // Second half: Return statement with JSX
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Add the custom cursor component */}
      <StandaloneCursor />
      
      {/* Dark background for the entire page */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#111111", // Deep dark background
          zIndex: -2,
        }}
      />

      {/* Main Content Grid Container */}
      <div
        ref={gridContainerRef}
        style={{
          position: "relative",
          width: "100%",
          minHeight: "100vh", // Changed from height
          padding: "5vw",
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gridGap: "1.5rem",
          opacity: opacity,
          filter: `blur(${blurAmount}px)`,
          transition: "opacity 2s ease-in-out, filter 2s ease-in-out",
          zIndex: 1,
          boxSizing: "border-box", // Ensures padding doesn't cause overflow
          overflowX: "hidden", // Prevent horizontal scrolling
        }}
      >
        {/* Left Column - Title Section */}
        <div 
          style={titleContainerStyles}
          onMouseEnter={() => setCursorType('text')}
          onMouseLeave={() => setCursorType('default')}
        >
          <h1
            style={{
              fontFamily: "'PPMori-SemiBold', sans-serif",
              fontSize: "clamp(2rem, 6vw, 5rem)",
              fontWeight: 600,
              color: "white",
              margin: 0,
              lineHeight: 1,
              position: "relative", // Added for better stacking context
              zIndex: 2, // Added to ensure text is above any backgrounds
            }}
          >
            Shaping Ideas <span style={{ fontWeight: 600 }}>into</span>
          </h1>
          <h1
            style={{
              fontFamily: "'PPMori-SemiBold', sans-serif",
              fontSize: "clamp(2rem, 6vw, 5rem)",
              fontWeight: 600,
              color: "white",
              margin: 0,
              lineHeight: 1,
              marginBottom: "2rem",
              position: "relative", // Added for better stacking context
              zIndex: 2, // Added to ensure text is above any backgrounds
            }}
          >
            Scalable products.
          </h1>
          <p
            style={{
              fontFamily: "'PPMori', sans-serif",
              fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
              color: "rgba(255, 255, 255, 0.8)",
              maxWidth: "40ch",
              lineHeight: 1.6,
              position: "relative", // Added for better stacking context
              zIndex: 2, // Added to ensure text is above any backgrounds
            }}
          >
            From ideation to launch, ensuring every detail is purpose-driven.
            Balancing user experience, business value, and execution efficiency.
            Delivering high-quality products while managing project
            complexities.
          </p>

          {/* Scroll Button - Add this below your paragraph */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start", // Aligns to the left side of the container
              marginTop: "2rem",
              position: "relative",
              zIndex: 3,
            }}
          >
            <button
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 25px rgba(0, 0, 0, 0.2)";
                setCursorType('button');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(0, 0, 0, 0.1)";
                setCursorType('default');
              }}
              onClick={scrollToCaseStudies}
              style={{
                backgroundColor: "white",
                color: "#111",
                border: "none",
                borderRadius: "50px",
                padding: "12px 24px",
                fontSize: "clamp(0.9rem, 1.2vw, 1.1rem)",
                fontFamily: "'PPMori', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              }}
            >
              Case Studies
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  transition: "transform 0.3s ease",
                }}
              >
                <path
                  d="M12 4L12 20M12 20L18 14M12 20L6 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Column - Media Section */}
        <div 
          style={mediaContainerStyles}
          onMouseEnter={() => setCursorType('image')}
          onMouseLeave={() => setCursorType('default')}
        >
          {/* Media container that supports both video and image fallback */}
          <div
            style={{
              width: "100%",
              height: "100%",
              minHeight: "300px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderRadius: "12px",
              overflow: "hidden",
              position: "relative",
              zIndex: 2,
            }}
          >
            {/* Enhanced video element with better error handling */}
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: isVideoLoaded ? "block" : "none",
              }}
            />

            {/* Loading indicator - shown when video is not yet loaded */}
            {!isVideoLoaded && !isVideoError && (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(135deg, #222 0%, #111 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255, 255, 255, 0.7)",
                  fontFamily: "'PPMori', sans-serif",
                }}
              >
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ 
                      margin: "0 auto 16px",
                      animation: "spin 1.5s linear infinite"
                    }}
                  >
                    <style>
                      {`
                        @keyframes spin {
                          0% { transform: rotate(0deg); }
                          100% { transform: rotate(360deg); }
                        }
                      `}
                    </style>
                    <circle 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="rgba(255,255,255,0.2)" 
                      strokeWidth="2" 
                    />
                    <path 
                      d="M12 2C6.48 2 2 6.48 2 12" 
                      stroke="white" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                    />
                  </svg>
                  <p style={{ margin: 0, fontSize: "14px" }}>
                    Loading media content...
                  </p>
                </div>
              </div>
            )}

            {/* Image fallback that shows only when video fails */}
            {isVideoError && (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(135deg, #333 0%, #111 100%)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255, 255, 255, 0.7)",
                  fontFamily: "'PPMori', sans-serif",
                  padding: "20px",
                }}
              >
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ marginBottom: "16px" }}
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M10 9L7 12L10 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 9L17 12L14 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "bold" }}>
                  Video Content Unavailable
                </p>
                <p style={{ margin: 0, fontSize: "14px", textAlign: "center", maxWidth: "280px" }}>
                  We're having trouble displaying this content. Please check your connection or try again later.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BentoGrid Section with ID for scrolling */}
      <div 
        id="case-studies" 
        style={{ 
          backgroundColor: '#111', 
          minHeight: '100vh', 
          padding: '24px' 
        }}
      >
        <BentoGrid />
      </div>
      <div style={{ 
          backgroundColor: '#111', 
          minHeight: '100vh', 
          padding: '24px', 
        }}>
        <AboutPage />
      </div>
      {/* Noise Overlay - On top of all content with screen blend mode */}
      <div
        ref={noiseOverlayRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 20, // Higher z-index to be on top of all content
          pointerEvents: "none", // Allow interaction with content below
          opacity: opacity, // For fade-in effect
          transition: "opacity 2s ease-in-out",
          mixBlendMode: "screen", // Screen blend mode for visible grain
        }}
      />
    </div>
  );
};

export default ResponsiveGridLayout;