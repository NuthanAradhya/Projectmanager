// components/BentoGrid.tsx
import React, { useEffect } from 'react';
import styled from 'styled-components';
import AOS from 'aos'; // Import AOS library
import 'aos/dist/aos.css'; // Import AOS styles
import Card, { CardBackground } from './card';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 60px;
  
  @media (max-width: 1024px) {
    gap: 24px;
    padding: 24px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const CardWrapper = styled.div`
  position: relative;
`;

const TextContainer = styled.div`
  margin-top: 20px;
  padding: 0 16px;
  
  h3 {
    font-family: 'PPMori-SemiBold', sans-serif;
    font-size: 1.5rem;
    color: white;
    margin: 0 0 12px 0;
  }
  
  p {
    font-family: 'PPMori', sans-serif;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.53);
    margin: 0;
    line-height: 1.5;
  }
`;

interface CaseStudy {
  background: CardBackground;
  size: 'small' | 'large';
  mediaUrl: string;
  isVideo?: boolean;
  link?: string;
  title: string;
  description: string;
}

const BentoGrid: React.FC = () => {
  // Initialize AOS on component mount
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: false
    });
    
    // Refresh AOS on window resize for better responsive behavior
    window.addEventListener('resize', AOS.refresh);
    
    return () => {
      window.removeEventListener('resize', AOS.refresh);
    };
  }, []);
  
  // Fixed paths to match the actual file structure
  const VIDEO1_PATH = '/video/AI.mp4';  // Changed from '/videos/1.mp4' to match folder structure
  const IMAGE1_PATH = '/images/Collobo.gif';  // Renamed for clarity
  const Hairtudio = 'video/Hairstudio.mp4';  // Changed from '/videos/2.mp4' to match folder structure
  const Geopolitical = 'video/Geopolitical.mp4';
  // Case studies data with correct paths
  const caseStudies: CaseStudy[] = [
    {
      background: 'instagram',
      size: 'small',
      mediaUrl: VIDEO1_PATH,
      isVideo: true,
      link: 'https://www.notion.so/nuthanaradhya/Invoice-Management-1abe452f3036809dba53c4d8a0df0adc',
      title: "AI-Powered Invoice Management",
      description: "Automating invoice processing with AI-driven data extraction, categorization, and analytics for enhanced financial insights."
    },
    {
      background: 'firstfloor',
      size: 'large',
      mediaUrl: Geopolitical,
      isVideo: true, // GIFs should be treated as images
      link: 'https://www.notion.so/nuthanaradhya/AI-Powered-Geopolitical-Risk-Analysis-1abe452f3036809cab22e91363a96956?pvs=4',
      title: "AI-Powered Geopolitical Risk Analysis",
      description: "Leveraging AI to monitor and predict geopolitical risks, enabling businesses to make data-driven strategic decisions."
    },
    {
      background: 'cofolios',
      size: 'large',
      mediaUrl: IMAGE1_PATH,
      isVideo: false,
      link: 'https://www.notion.so/nuthanaradhya/AI-Driven-Supply-Chain-Optimization-1abe452f30368024bb3ed26778b53468?pvs=4',
      title: "AI-Driven Supply Chain Optimization (On Going)",
      description: "An AI-driven solution that enhances supply chain resilience by predicting disruptions, optimizing logistics, and reducing operational risks."
    },
    {
      background: 'curve',
      size: 'small',
      mediaUrl: Hairtudio,
      isVideo: true,
      link: 'https://nuthanaradhya.notion.site/HariStudio-1abe452f30368032bf05cca8628a9d9b?pvs=4',
      title: "HairStudio (Upcoming)",
      description: "A smart booking platform that offers AI-powered virtual hairstyling recommendations while streamlining salon appointment management."
    }
  ];
  
  return (
    <section style={{ backgroundColor: '#111' }}>
      <h1 style={{
        fontFamily: "'PPMori-SemiBold', sans-serif",
        fontSize: 'clamp(2rem, 5vw, 3rem)',
        color: 'white',
        textAlign: 'center',
        padding: '60px 0 40px'
      }}
      data-aos="fade-down"
      >
        Case Studies
      </h1>
      
      <GridContainer>
        {caseStudies.map((study, index) => (
          <CardWrapper 
            key={index}
            data-aos="fade-up"
            data-aos-delay={index * 100}
            data-aos-anchor-placement="top-bottom"
          >
            <Card
              background={study.background}
              size={study.size}
              mediaUrl={study.mediaUrl}
              isVideo={study.isVideo}
              link={study.link}
            />
            <TextContainer>
              <h3>{study.title}</h3>
              <p>{study.description}</p>
            </TextContainer>
          </CardWrapper>
        ))}
      </GridContainer>
    </section>
  );
};

export default BentoGrid;