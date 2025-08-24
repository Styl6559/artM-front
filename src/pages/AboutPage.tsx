import React, { useRef, useEffect, useState } from 'react';
import { Target, Users, Award, TrendingUp, Heart, Rocket, Star, CheckCircle, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import ScrollToTop from '../components/ui/ScrollToTop';
import gsap from 'gsap';

const AboutPage: React.FC = () => {
  const teamMembers = [
    {
      name: "Rajyavardhan",
      role: "Lead Designer",
      bio: "Creative visionary with a passion for building beautiful, user-friendly products.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Mohit",
      role: "Growth Strategist",
      bio: "Expert in scaling startups and driving user engagement through data-driven strategies.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Shaurya",
      role: "Tech Lead",
      bio: "Full-stack developer with a knack for solving complex problems and leading agile teams.",
      image: "/api/placeholder/150/150"
    }
  ];

  const milestones = [
    { year: "2023", event: "Aarly founded with vision to democratize startup funding" },
    { year: "2024", event: "Launched with 100+ investors and 50+ government schemes" },
    { year: "2024", event: "Reached 1,000+ startups using our platform" },
    { year: "2025", event: "Expanded to 300+ funding sources and launched investor matching" }
  ];

  const values = [
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: "Accessibility",
      description: "Making funding opportunities accessible to every entrepreneur, regardless of background or connections."
    },
    {
      icon: <Target className="w-8 h-8 text-blue-500" />,
      title: "Transparency",
      description: "Providing clear, honest information about investors and funding processes without hidden agendas."
    },
    {
      icon: <Users className="w-8 h-8 text-green-500" />,
      title: "Community",
      description: "Building a supportive ecosystem where entrepreneurs can learn, connect, and grow together."
    },
    {
      icon: <Rocket className="w-8 h-8 text-purple-500" />,
      title: "Innovation",
      description: "Continuously improving our platform to better serve the evolving needs of the startup community."
    }
  ];

  const stats = [
    { number: "300+", label: "Funding Sources", icon: <Award className="w-6 h-6 text-blue-600" /> },
    { number: "₹120Cr+", label: "Funding Facilitated", icon: <TrendingUp className="w-6 h-6 text-green-600" /> },
    { number: "2,500+", label: "Startups Helped", icon: <Users className="w-6 h-6 text-purple-600" /> },
    { number: "95%", label: "User Satisfaction", icon: <Star className="w-6 h-6 text-yellow-600" /> }
  ];

  // GSAP carousel logic for Core Values (mobile)
  const [currentValue, setCurrentValue] = useState(0);
  const valueRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const valueTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    valueRefs.forEach((ref, idx) => {
      if (ref.current) {
        gsap.set(ref.current, { x: idx === currentValue ? 0 : 100, scale: idx === currentValue ? 1 : 0.85, opacity: idx === currentValue ? 1 : 0, rotate: idx === currentValue ? 0 : 10 });
      }
    });
    if (valueRefs[currentValue].current) {
      gsap.to(valueRefs[currentValue].current, { x: 0, scale: 1, opacity: 1, rotate: 0, duration: 1.3, ease: 'bounce.out' });
    }
    valueRefs.forEach((ref, idx) => {
      if (idx !== currentValue && ref.current) {
        gsap.to(ref.current, { x: -100, scale: 0.85, opacity: 0, rotate: 10, duration: 1.3, ease: 'power3.in' });
      }
    });
  }, [currentValue]);

  useEffect(() => {
    valueTimeoutRef.current = setTimeout(() => {
      setCurrentValue((prev) => (prev + 1) % values.length);
    }, 2500);
    return () => { if (valueTimeoutRef.current) clearTimeout(valueTimeoutRef.current); };
  }, [currentValue]);

  const goToValue = (idx: number) => {
    setCurrentValue(idx);
    if (valueTimeoutRef.current) clearTimeout(valueTimeoutRef.current);
  };

  // GSAP carousel logic for Team (mobile)
  const [currentTeam, setCurrentTeam] = useState(0);
  const teamRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const teamTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    teamRefs.forEach((ref, idx) => {
      if (ref.current) {
        gsap.set(ref.current, { x: idx === currentTeam ? 0 : 100, scale: idx === currentTeam ? 1 : 0.85, opacity: idx === currentTeam ? 1 : 0, rotateY: idx === currentTeam ? 0 : 90 });
      }
    });
    if (teamRefs[currentTeam].current) {
      gsap.to(teamRefs[currentTeam].current, { x: 0, scale: 1, opacity: 1, rotateY: 0, duration: 1.3, ease: 'bounce.out' });
    }
    teamRefs.forEach((ref, idx) => {
      if (idx !== currentTeam && ref.current) {
        gsap.to(ref.current, { x: -100, scale: 0.85, opacity: 0, rotateY: 90, duration: 1.3, ease: 'power3.in' });
      }
    });
  }, [currentTeam]);

  useEffect(() => {
    teamTimeoutRef.current = setTimeout(() => {
      setCurrentTeam((prev) => (prev + 1) % teamMembers.length);
    }, 2500);
    return () => { if (teamTimeoutRef.current) clearTimeout(teamTimeoutRef.current); };
  }, [currentTeam]);

  const goToTeam = (idx: number) => {
    setCurrentTeam(idx);
    if (teamTimeoutRef.current) clearTimeout(teamTimeoutRef.current);
  };

  // GSAP staggered fade-in for desktop
  useEffect(() => {
    if (window.innerWidth >= 768) {
      gsap.from('.about-value-card', { opacity: 0, y: 40, scale: 0.9, rotate: 8, stagger: 0.15, duration: 1.2, ease: 'back.out(1.7)' });
      gsap.from('.about-team-card', { opacity: 0, y: 40, rotate: 10, scale: 0.9, stagger: 0.15, duration: 1.2, ease: 'elastic.out(1, 0.5)' });
    }
  }, []);

  // --- HERO EFFECTS ---
  const logoRef = useRef<HTMLImageElement>(null);
  const heroHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (logoRef.current) {
      gsap.fromTo(logoRef.current, { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: 'back.out(1.7)' });
      gsap.to(logoRef.current, { y: 12, repeat: -1, yoyo: true, duration: 2.5, ease: 'sine.inOut' });
    }
    if (heroHeadingRef.current) {
      gsap.from(heroHeadingRef.current, { y: 40, opacity: 0, duration: 1.2, delay: 0.2, ease: 'power2.out' });
    }
  }, []);

  // --- MISSION/VISION EFFECTS ---
  const missionRef = useRef<HTMLDivElement>(null);
  const visionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.from([missionRef.current, visionRef.current], {
      x: (i) => (i === 0 ? -60 : 60),
      rotate: (i) => (i === 0 ? -6 : 6),
      opacity: 0,
      duration: 1.2,
      delay: (i) => 0.3 + i * 0.2,
      ease: 'power3.out',
      stagger: 0.2,
      clearProps: 'all',
    });
  }, []);

  // --- STORY EFFECTS ---
  const storyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (storyRef.current) {
      gsap.from(storyRef.current, { opacity: 0, y: 40, duration: 1.2, delay: 0.4, ease: 'power2.out', clearProps: 'all' });
      gsap.from(storyRef.current.querySelectorAll('p'), { opacity: 0, y: 20, stagger: 0.2, duration: 1.1, delay: 0.6, ease: 'power2.out', clearProps: 'all' });
    }
  }, []);

  // --- CORE VALUES GRID (DESKTOP) ---
  useEffect(() => {
    if (window.innerWidth >= 768) {
      gsap.from('.about-value-card', { opacity: 0, y: 40, scale: 0.9, rotate: 8, stagger: 0.15, duration: 1.2, ease: 'back.out(1.7)', clearProps: 'all' });
    }
  }, []);

  // --- TEAM GRID (DESKTOP) ---
  useEffect(() => {
    if (window.innerWidth >= 768) {
      gsap.from('.about-team-card', { opacity: 0, y: 40, rotate: 10, scale: 0.9, stagger: 0.15, duration: 1.2, ease: 'elastic.out(1, 0.5)', clearProps: 'all' });
    }
  }, []);

  // --- CTA SECTION ---
  const ctaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ctaRef.current) {
      gsap.fromTo(ctaRef.current, { backgroundPosition: '0% 50%' }, { backgroundPosition: '100% 50%', duration: 10, repeat: -1, yoyo: true, ease: 'linear' });
      gsap.fromTo(ctaRef.current.querySelectorAll('button'), { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, delay: 0.3, stagger: 0.2, ease: 'back.out(1.7)' });
    }
  }, []);

  return (
    <>
      <ScrollToTop />
      <Helmet>
        <title>About Us - Aarly</title>
        <meta name="description" content="Learn about Aarly's mission to democratize startup funding and help entrepreneurs find the right investors and grants." />
      </Helmet>
      <div className="min-h-screen bg-gray-900 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Hero Section */}
          <div className="text-center mb-10 sm:mb-14 md:mb-16 px-2 sm:px-0">
            <img
              ref={logoRef}
              src="/Screenshot 2025-06-29 140116.png"
              alt="Aarly Rocket"
              className="mx-auto mb-6 sm:mb-8 w-32 h-32 sm:w-40 h-40 object-contain drop-shadow-lg rounded-full border-4 border-gray-700 bg-gray-800"
              style={{ background: 'linear-gradient(135deg, #374151 0%, #4b5563 100%)' }}
            />
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium px-2">We're on a mission to democratize startup funding by making investor connections and funding opportunities accessible to every entrepreneur in India and beyond.</p>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-16">
            <div ref={missionRef} className="bg-gray-800 border border-gray-700 shadow-2xl rounded-3xl p-8 transition-transform duration-200 hover:scale-105 hover:shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-8 h-8 text-blue-400" />
                <h2 className="text-3xl font-bold text-white">Our Mission</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                To bridge the gap between ambitious entrepreneurs and the right funding opportunities by providing a comprehensive, transparent, and accessible platform that empowers startups to find their perfect funding match.
              </p>
            </div>
            
            <div ref={visionRef} className="bg-gray-800 border border-gray-700 shadow-2xl rounded-3xl p-8 transition-transform duration-200 hover:scale-105 hover:shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Star className="w-8 h-8 text-purple-400" />
                <h2 className="text-3xl font-bold text-white">Our Vision</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                To become the go-to platform for startup funding in India, where every entrepreneur has equal access to funding opportunities and the tools they need to build successful, impactful businesses.
              </p>
            </div>
          </div>

          {/* Our Story */}
          <div ref={storyRef} className="bg-gray-800 border border-gray-700 shadow-2xl rounded-3xl p-5 sm:p-8 md:p-12 mb-10 md:mb-16">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Our Story</h2>
            <div className="prose prose-lg max-w-none text-gray-300">
              <p className="text-lg leading-relaxed mb-6">
                Aarly was born from a simple yet powerful observation: too many brilliant entrepreneurs struggle to find the right funding not because their ideas lack merit, but because they lack access to the right networks and information.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                Our founder, having experienced the challenges of fundraising firsthand, realized that the startup ecosystem needed a platform that could democratize access to funding opportunities. Traditional methods of finding investors often relied on personal networks, warm introductions, and insider knowledge – creating barriers for many deserving entrepreneurs.
              </p>
              <p className="text-lg leading-relaxed">
                Today, Aarly serves as the bridge between ambitious startups and the funding ecosystem, providing not just a database of investors, but a comprehensive toolkit for successful fundraising. We've helped facilitate over ₹120 crores in funding and continue to grow our impact every day.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="mb-10 md:mb-16">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">Our Core Values</h2>
              <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">These principles guide everything we do and shape how we serve the startup community.</p>
            </div>
            {/* Carousel for mobile */}
            <div className="block md:hidden">
              <div className="relative flex justify-center items-center min-h-[340px]">
                {values.map((value, idx) => (
                  <div
                    key={idx}
                    ref={valueRefs[idx]}
                    className={`absolute left-1/2 top-0 w-[90vw] max-w-xs sm:max-w-sm -translate-x-1/2`}
                    style={{ pointerEvents: idx === currentValue ? 'auto' : 'none' }}
                    onClick={() => goToValue(idx)}
                  >
                    <div className="bg-gray-800 border border-gray-700 shadow-lg rounded-2xl p-8 cursor-pointer">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-700 border border-gray-600 rounded-full flex items-center justify-center">
                          {value.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-white">{value.title}</h3>
                      </div>
                      <p className="text-gray-300 text-lg leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                ))}
                {/* Manual navigation dots */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2 mt-4">
                  {values.map((_, idx) => (
                    <button
                      key={idx}
                      className={`w-2.5 h-2.5 rounded-full ${idx === currentValue ? 'bg-blue-400' : 'bg-gray-600'} transition-all`}
                      onClick={() => goToValue(idx)}
                      aria-label={`Go to value ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* Grid for desktop */}
            <div className="hidden md:grid grid-cols-4 gap-6 md:gap-8">
              {values.map((value, index) => (
                <div key={index} className="about-value-card bg-gray-800 border border-gray-700 shadow-lg rounded-2xl p-8 transition-transform duration-200 hover:scale-105 hover:rotate-1 hover:shadow-2xl">
                  <div className="flex flex-col items-center gap-4 mb-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-700 border border-gray-600 rounded-full flex items-center justify-center">
                      {value.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white break-words text-center w-full">{value.title}</h3>
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed text-center">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-10 md:mb-16">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">Meet Our Team</h2>
              <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">Passionate individuals working together to transform the startup funding landscape.</p>
            </div>
            {/* Carousel for mobile */}
            <div className="block md:hidden">
              <div className="relative flex justify-center items-center min-h-[340px]">
                {teamMembers.map((member, idx) => (
                  <div
                    key={idx}
                    ref={teamRefs[idx]}
                    className={`absolute left-1/2 top-0 w-[90vw] max-w-xs sm:max-w-sm -translate-x-1/2`}
                    style={{ pointerEvents: idx === currentTeam ? 'auto' : 'none' }}
                    onClick={() => goToTeam(idx)}
                  >
                    <div className="bg-gray-800 border border-gray-700 shadow-lg rounded-2xl p-6 text-center cursor-pointer">
                      <div className="w-24 h-24 bg-gray-700 border border-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Users className="w-12 h-12 text-blue-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                      <p className="text-blue-400 font-semibold mb-3">{member.role}</p>
                      <p className="text-gray-300 text-sm leading-relaxed">{member.bio}</p>
                    </div>
                  </div>
                ))}
                {/* Manual navigation dots */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2 mt-4">
                  {teamMembers.map((_, idx) => (
                    <button
                      key={idx}
                      className={`w-2.5 h-2.5 rounded-full ${idx === currentTeam ? 'bg-blue-400' : 'bg-gray-600'} transition-all`}
                      onClick={() => goToTeam(idx)}
                      aria-label={`Go to team member ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* Grid for desktop */}
            <div className="hidden md:grid grid-cols-3 gap-6 md:gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="about-team-card bg-gray-800 border border-gray-700 shadow-lg rounded-2xl p-6 text-center transition-transform duration-200 hover:scale-105 hover:-rotate-1 hover:shadow-2xl">
                  <div className="w-24 h-24 bg-gray-700 border border-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-12 h-12 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                  <p className="text-blue-400 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div ref={ctaRef} className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-700 rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-10 text-center shadow-2xl mt-10 md:mt-20 overflow-hidden flex flex-col items-center justify-center animate-gradient-move">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] rounded-2xl md:rounded-3xl pointer-events-none" />
            <div className="relative z-10 w-full flex flex-col items-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-2 sm:mb-3 tracking-tight text-white drop-shadow-lg">Ready to Start?</h2>
              <p className="text-sm sm:text-lg md:text-xl mb-4 sm:mb-6 opacity-95 font-medium text-white drop-shadow-sm">Join thousands of entrepreneurs who found their perfect funding match through Aarly.</p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full max-w-md">
                <Link to="/auth" className="flex-1 min-w-[150px]" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  <Button className="w-full bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800 font-bold px-4 sm:px-8 py-2 sm:py-3 rounded-lg shadow-lg transition-all duration-200 text-sm sm:text-base border-2 border-white focus:ring-4 focus:ring-blue-200 flex items-center justify-center gap-2">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Link to="/contact" className="flex-1 min-w-[150px]" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  <Button className="w-full bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800 font-bold px-4 sm:px-8 py-2 sm:py-3 rounded-lg shadow-lg transition-all duration-200 text-sm sm:text-base border-2 border-white focus:ring-4 focus:ring-blue-200 flex items-center justify-center gap-2">
                    <span>Contact</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;