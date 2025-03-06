import React, { useEffect, useState, useRef } from 'react';
import about from '../Homevideo/Profile.jpg';



// Define a color palette that works well with dark noise pattern
const colors = {
  primary: '#FFFFFF',    // Bright White for titles
  secondary: '#FFFFFF',  // Medium white for subtitles
  text: '#FFFFFF',       // Light white for paragraphs
  accent: '#E5CC4B',     // Gold accent for highlights
  links: '#7ED4FF',      // Cyan blue for links
  cardBg: 'rgba(10, 20, 40, 0.3)', // Semi-transparent dark blue
  borderLight: 'rgba(75, 146, 229, 0.2)',
};

// Typography settings
const typography = {
  titleFont: "'Playfair Display', serif",
  bodyFont: "'Inter', 'Helvetica Neue', sans-serif",
  titleLineHeight: 1.2,
  paragraphLineHeight: 1.6,
  subtitleLineHeight: 1.4,
};

// Animation function for elements on scroll
const useScrollAnimation = () => {
  const [elements, setElements] = useState<NodeListOf<Element> | []>([]);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.current?.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => {
      observer.current?.observe(el);
    });

    setElements(animatedElements);

    return () => {
      if (observer.current) {
        animatedElements.forEach(el => {
          observer.current?.unobserve(el);
        });
      }
    };
  }, []);

  return elements;
};

// Responsive breakpoints
const breakpoints = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
};

interface AboutPageProps {
  className?: string;
}

const AboutPage: React.FC<AboutPageProps> = ({ className }) => {
  // Get initial window width with server-side rendering safety
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    // Add animation CSS
    const style = document.createElement('style');
    style.innerHTML = `
      .animate-on-scroll {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
      }
      .animate-in {
        opacity: 1;
        transform: translateY(0);
      }
      .delay-1 { transition-delay: 0.1s; }
      .delay-2 { transition-delay: 0.2s; }
      .delay-3 { transition-delay: 0.3s; }
      .delay-4 { transition-delay: 0.4s; }
      .delay-5 { transition-delay: 0.5s; }
      
      /* Typography fixes */
      p, .card-text {
        margin-bottom: 1.5rem !important;
        line-height: 1.6 !important;
      }
      
      /* Two-column grid layout - Modified for proper responsive behavior */
      .two-column-grid {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 2rem;
        margin-bottom: 2.5rem;
      }
      
      @media (max-width: ${breakpoints.mobile}px) {
        .mobile-full-width {
          width: 100% !important;
          padding: 0 1rem !important;
        }
        /* Key fix: Force flex column direction on mobile */
        .mobile-stack {
          flex-direction: column !important;
        }
        .mobile-center {
          text-align: center !important;
          justify-content: center !important;
        }
        .mobile-small-text {
          font-size: 0.9rem !important;
          line-height: 1.6 !important;
          margin-bottom: 1.2rem !important;
        }
        .mobile-smaller-title {
          font-size: 1.8rem !important;
          margin-bottom: 1rem !important;
        }
        .mobile-smaller-subtitle {
          font-size: 1.2rem !important;
          line-height: 1.4 !important;
          margin-bottom: 1rem !important;
        }
        .section-title-mobile {
          margin-bottom: 1.2rem !important;
        }
        .tight-paragraph {
          margin-bottom: 1.2rem !important;
          line-height: 1.6 !important;
        }
        
        /* Make two-column grid stack on mobile - Critical Fix */
        .two-column-grid {
          flex-direction: column !important;
          gap: 1.5rem !important;
        }
        .grid-column {
          width: 100% !important;
          padding: 0 !important;
        }
      }
      
      @media (min-width: ${breakpoints.mobile + 1}px) and (max-width: ${breakpoints.tablet}px) {
        /* Also force mobile layout for small tablets */
        .two-column-grid {
          flex-direction: column !important;
          gap: 1.5rem !important;
        }
        .grid-column {
          width: 100% !important;
        }
        .tablet-adjust {
          padding: 0 1.5rem !important;
        }
        .tablet-smaller-title {
          font-size: 2rem !important;
        }
        .tight-paragraph {
          margin-bottom: 1.2rem !important;
          line-height: 1.6 !important;
        }
      }
    `;
    document.head.appendChild(style);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.head.removeChild(style);
    };
  }, []);

  // Initialize scroll animations
  useScrollAnimation();

  // Helper function to get responsive styles based on screen size
  const getResponsiveStyle = (mobileStyle: any, tabletStyle: any, desktopStyle: any) => {
    if (windowWidth <= breakpoints.mobile) return { ...desktopStyle, ...mobileStyle };
    if (windowWidth <= breakpoints.tablet) return { ...desktopStyle, ...tabletStyle };
    return desktopStyle;
  };

  // Base styles with proper typography and colors
  const styles = {
    container: getResponsiveStyle(
      { padding: '1rem' },
      { padding: '1.5rem' },
      {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        backgroundColor: 'transparent',
      }
    ),
    title: getResponsiveStyle(
      { 
        fontSize: '2rem',
        marginBottom: '1rem',
      },
      { 
        fontSize: '2.2rem',
        marginBottom: '1.2rem',
      },
      {
        fontSize: '2.5rem',
        color: colors.primary,
        fontFamily: typography.titleFont,
        marginBottom: '1.5rem',
        fontWeight: 'bold',
        textShadow: '0px 0px 10px rgba(0, 71, 171, 0.4)',
        lineHeight: typography.titleLineHeight,
      }
    ),
    subtitle: getResponsiveStyle(
      { 
        fontSize: '1.2rem',
        marginBottom: '1rem',
        lineHeight: 1.4,
      },
      { 
        fontSize: '1.5rem',
        marginBottom: '1.2rem',
      },
      {
        fontSize: '1.8rem',
        color: colors.secondary,
        fontFamily: typography.bodyFont,
        marginBottom: '1.5rem',
        lineHeight: typography.subtitleLineHeight,
        fontWeight: 'normal',
      }
    ),
    paragraph: getResponsiveStyle(
      { 
        fontSize: '0.9rem', 
        lineHeight: 1.6,
        marginBottom: '1.2rem',
      },
      { 
        fontSize: '1rem',
        lineHeight: 1.6,
        marginBottom: '1.5rem',
      },
      {
        fontSize: '1.1rem',
        lineHeight: typography.paragraphLineHeight,
        color: colors.text,
        marginBottom: '1.5rem',
        fontFamily: typography.bodyFont,
        fontWeight: 'normal',
      }
    ),
    highlightText: {
      color: colors.accent,
      fontWeight: 'bold',
    },
    gridContainer: getResponsiveStyle(
      { 
        flexDirection: 'column', // Force column layout on mobile
        gap: '1.5rem',
      },
      { 
        flexDirection: 'column', // Force column layout on tablet
        gap: '1.5rem',
      },
      {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '2rem',
        marginBottom: '2.5rem',
        width: '100%',
      }
    ),
    gridColumn: getResponsiveStyle(
      { width: '100%' }, // Full width on mobile
      { width: '100%' }, // Full width on tablet
      {
        width: '50%',
      }
    ),
    imageContainer: getResponsiveStyle(
      { maxWidth: '100%', height: '300px' },
      { maxWidth: '100%', height: '350px' },
      {
        width: '100%',
        maxWidth: '100%',
        height: '400px',
        position: 'relative',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 0 20px rgba(75, 146, 229, 0.35)',
      }
    ),
    profileImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.5s ease',
    },
    grid: getResponsiveStyle(
      { 
        gridTemplateColumns: '1fr',
        gap: '1.2rem',
      },
      { 
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1.5rem',
      },
      {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '2rem',
      }
    ),
    card: getResponsiveStyle(
      { padding: '1.2rem' },
      { padding: '1.5rem' },
      {
        backgroundColor: colors.cardBg,
        backdropFilter: 'blur(5px)',
        border: `1px solid ${colors.borderLight}`,
        padding: '1.8rem',
        borderRadius: '10px',
        transition: 'transform 0.4s ease, box-shadow 0.4s ease',
      }
    ),
    cardTitle: getResponsiveStyle(
      { 
        fontSize: '1.3rem',
        marginBottom: '1rem',
      },
      { 
        fontSize: '1.4rem',
        marginBottom: '1.2rem',
      },
      {
        fontSize: '1.5rem',
        fontStyle: 'italic',
        color: colors.secondary,
        marginBottom: '1.2rem',
        fontFamily: typography.titleFont,
        fontWeight: 'bold',
        lineHeight: typography.subtitleLineHeight,
      }
    ),
    cardText: getResponsiveStyle(
      { 
        fontSize: '0.9rem',
        lineHeight: 1.6,
      },
      { fontSize: '0.95rem', lineHeight: 1.6 },
      {
        fontSize: '1rem',
        color: colors.text,
        fontFamily: typography.bodyFont,
        lineHeight: 1.6,
      }
    ),
    footer: getResponsiveStyle(
      { marginTop: '2rem' },
      { marginTop: '2.5rem' },
      {
        marginTop: '3rem',
        borderTop: `1px solid ${colors.borderLight}`,
        paddingTop: '1.5rem',
      }
    ),
    socialLinks: getResponsiveStyle(
      { 
        flexDirection: 'column',
        margin: '1.2rem auto 0',
      },
      { 
        flexWrap: 'wrap',
        margin: '1.5rem auto 0',
      },
      {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        margin: '1.8rem auto 0',
      }
    ),
    socialLink: getResponsiveStyle(
      { 
        borderRight: 'none', 
        borderBottom: `1px solid ${colors.borderLight}`,
        padding: '0.7rem',
      },
      { 
        flex: '1 0 30%',
        padding: '0.8rem',
      },
      {
        padding: '0.9rem',
        color: colors.links,
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        borderRight: `1px solid ${colors.borderLight}`,
        flex: '1',
        justifyContent: 'center',
        transition: 'background-color 0.3s ease, color 0.3s ease, transform 0.3s ease',
        fontFamily: typography.bodyFont,
      }
    ),
    sectionTitle: getResponsiveStyle(
      { 
        fontSize: '1.7rem',
        marginBottom: '1.2rem',
      },
      { 
        fontSize: '1.8rem',
        marginBottom: '1.8rem',
      },
      {
        fontSize: '2.2rem',
        color: colors.primary,
        fontFamily: typography.titleFont,
        marginBottom: '1.8rem',
        textShadow: '0px 0px 8px rgba(0, 71, 171, 0.3)',
        fontWeight: 'bold',
        lineHeight: typography.titleLineHeight,
      }
    ),
    lastUpdated: getResponsiveStyle(
      { 
        textAlign: 'center', 
        marginTop: '1.2rem',
        fontSize: '0.8rem',
      },
      { 
        textAlign: 'right',
        fontSize: '0.8rem',
      },
      {
        textAlign: 'right',
        fontSize: '0.85rem',
        color: 'rgba(179, 212, 255, 0.6)',
        marginTop: '1.5rem',
        fontFamily: typography.bodyFont,
      }
    )
  };

  // Handle hover effects with useState
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoveredImage, setHoveredImage] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<number | null>(null);

  return (
    <div style={styles.container as React.CSSProperties} className={`${className} mobile-full-width tablet-adjust`}>
      {/* Title section */}
      <h1 style={styles.title as React.CSSProperties} className="animate-on-scroll mobile-smaller-title tablet-smaller-title">ABOUT</h1>
      
      {/* Two-column grid layout - With mobile-stack class added */}
      <div style={styles.gridContainer as React.CSSProperties} className="two-column-grid mobile-stack">
        {/* Left column - Text content */}
        <div style={styles.gridColumn as React.CSSProperties} className="grid-column animate-on-scroll">
          <h2 style={styles.subtitle as React.CSSProperties} className="delay-1 mobile-smaller-subtitle">
            I'm a <span style={styles.highlightText}>strategic product manager</span> with a background in engineering.
          </h2>
          <p style={styles.paragraph as React.CSSProperties} className="delay-2 mobile-small-text tight-paragraph">
            My expertise lies in building 
            <span style={styles.highlightText}> scalable and user-driven </span>  
            digital products across web and mobile platforms, ensuring seamless execution from <span style={styles.highlightText}>idea to launch.</span>
          </p>
          <p style={styles.paragraph as React.CSSProperties} className="delay-3 mobile-small-text tight-paragraph">
            I combine <span style={styles.highlightText}>product management</span> skills with a deep understanding of UX and business needs to create solutions that align with both user expectations and company objectives. My approach ensures <span style={styles.highlightText}>structured roadmaps, efficient workflows, and high-impact results.</span>
          </p>
          <p style={styles.paragraph as React.CSSProperties} className="delay-4 mobile-small-text tight-paragraph">
          With experience in project management, I excel at leading cross-functional teams, defining clear priorities, and executing projects efficiently. From <span style={styles.highlightText}> agile methodologies </span> to stakeholder communication, I focus on delivering value on time and within scope.
          </p>
          <p style={styles.paragraph as React.CSSProperties} className="delay-5 mobile-small-text tight-paragraph">
          When I’m not strategizing, you can find me exploring new tech trends, refining workflows, or brainstorming the next big idea—because <span style={styles.highlightText}> I’m "A New Gen Product Manager." </span> 
          </p>
        </div>
        
        {/* Right column - Image */}
        <div style={styles.gridColumn as React.CSSProperties} className="grid-column animate-on-scroll delay-4">
          <div style={styles.imageContainer as React.CSSProperties}>
            <img 
              src={about} 
              alt="Designer at work" 
              style={{
                ...styles.profileImage as React.CSSProperties,
                transform: hoveredImage ? 'scale(1.05)' : 'scale(1)',
              }} 
              onMouseEnter={() => setHoveredImage(true)}
              onMouseLeave={() => setHoveredImage(false)}
            />
          </div>
        </div>
      </div>

      {/* Process & Philosophy section */}
      <div className="animate-on-scroll delay-2">
        <h2 style={styles.sectionTitle as React.CSSProperties} className="mobile-smaller-title section-title-mobile">process & philosophy</h2>
        <div style={styles.grid as React.CSSProperties}>
          {[
            {
              title: "data-driven decisions.",
              text: "I leverage analytics and user insights to make informed decisions, ensuring products meet both user needs and business goals."
            },
            {
              title: "simplify complexity",
              text: "Breaking down complex problems into intuitive, user-friendly solutions that drive engagement and retention."
            },
            {
              title: "impact over output.",
              text: "Focusing on measurable impact rather than just shipping features—prioritizing what moves the needle for users and stakeholders."
            },
            {
              title: " collaborate to innovate.",
              text: "Great products emerge from strong cross-functional teamwork, aligning engineering, design, and business strategy."
            }
          ].map((card, index) => (
            <div 
              key={index}
              className={`animate-on-scroll delay-${index + 1}`}
              style={{
                ...styles.card,
                transform: hoveredCard === index ? 'translateY(-5px)' : 'translateY(0)',
                boxShadow: hoveredCard === index ? '0 10px 20px rgba(0, 0, 0, 0.3)' : 'none',
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <h3 style={styles.cardTitle}>{card.title}</h3>
              <p style={styles.cardText} className="card-text">{card.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer section */}
      <div style={styles.footer as React.CSSProperties} className="animate-on-scroll">
        <h2 style={{
          ...styles.sectionTitle as React.CSSProperties, 
          textAlign: 'center',
          color: colors.accent,
          marginBottom: windowWidth <= breakpoints.mobile ? '1rem' : '1.5rem',
        }} className="mobile-smaller-title">
          Let's create something <i>great</i> together.
        </h2>
        <div style={styles.socialLinks as React.CSSProperties} className="mobile-stack">
          {[
            { icon: "📧", text: "Email", href: "mailto:aradhya.in.co@gmail.com" },
            { icon: "🖌️", text: "UX Portfolio", href: "https://nuthan-in.web.app" },
            { icon: "in", text: "LinkedIn", href: "https://www.linkedin.com/in/nuthanaradhyatj/" },
            { icon: "📄", text: "Résumé", href: "/resume.pdf" },
            { icon: "🐱", text: "Github", href: "https://github.com/NuthanAradhya" }
          ].map((link, index, array) => (
            <a 
              key={index}
              href={link.href} 
              style={{
                ...styles.socialLink as React.CSSProperties,
                borderRight: index === array.length - 1 || windowWidth <= breakpoints.mobile ? 'none' : `1px solid ${colors.borderLight}`,
                borderBottom: windowWidth <= breakpoints.mobile && index !== array.length - 1 ? `1px solid ${colors.borderLight}` : 'none',
                backgroundColor: hoveredLink === index ? 'rgba(75, 146, 229, 0.15)' : 'transparent',
                color: hoveredLink === index ? '#fff' : colors.links,
                transform: hoveredLink === index ? 'translateY(-2px)' : 'translateY(0)',
              }}
              className="animate-on-scroll delay-1 mobile-center"
              onMouseEnter={() => setHoveredLink(index)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <span>{link.icon}</span> {link.text}
            </a>
          ))}
        </div>
        <p style={styles.lastUpdated as React.CSSProperties} className="mobile-center">
          Monday | Last updated: 02-03-2025
        </p>
      </div>
    </div>
  );
};

export default AboutPage