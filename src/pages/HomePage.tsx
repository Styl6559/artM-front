import React from 'react';
import Hero from '../components/home/Hero';
import PreviewSection from '../components/home/PreviewSection';
import HowItWorks from '../components/home/HowItWorks';
import Pricing from '../components/home/Pricing';
import ScrollToTop from '../components/ui/ScrollToTop';
import { Helmet } from 'react-helmet-async';

const HomePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Aarly - Startup Funding Discovery Platform</title>
        <meta name="description" content="Find the right investors, grants, and startup support for your startup instantly. Discover 300+ funding options for Indian & global founders." />
        <link rel="canonical" href="https://aarly.co/" />
        <meta property="og:title" content="Aarly - Startup Funding Discovery Platform" />
        <meta property="og:description" content="Find the right investors, grants, and startup support for your startup instantly. Discover 300+ funding options for Indian & global founders." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aarly.co/" />
        <meta property="og:image" content="/Screenshot 2025-06-29 140116.png" />
      </Helmet>
      <Hero />
      <PreviewSection />
      <HowItWorks />
      <Pricing />
      <ScrollToTop />
    </>
  );
};

export default HomePage;