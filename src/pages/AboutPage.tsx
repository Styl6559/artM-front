import React from 'react';
import { Link } from 'react-router-dom';
import { Palette, Heart, Users, Award, ArrowRight, ArrowLeft, Target } from 'lucide-react';
import Button from '../components/ui/Button';

const AboutPage: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" onClick={scrollToTop} className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6 group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Gallery</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <Target className="relative w-20 h-20 text-emerald-600 mx-auto" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-6 font-serif bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            About Rangleela
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
            We're passionate about connecting art lovers with talented creators across India, bringing unique paintings 
            and artistic apparel to people who appreciate the beauty of handcrafted art.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4 font-serif">Our Mission</h2>
              <p className="text-gray-600 mb-6 font-light leading-relaxed">
                At Rangleela, we believe that art has the power to transform spaces, inspire emotions, 
                and connect people across cultures. Our mission is to create a platform where Indian artists can 
                showcase their work and art enthusiasts can discover pieces that speak to their souls.
              </p>
              <p className="text-gray-600 font-light leading-relaxed">
                We're committed to supporting independent artists across India and providing them with the tools and 
                platform they need to reach a wider audience while maintaining the authenticity and 
                personal touch that makes their work special.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-2xl blur-2xl opacity-20"></div>
              <img
                src="https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Artist at work"
                className="relative rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12 font-serif">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Palette className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 font-serif">Authenticity</h3>
              <p className="text-gray-600 font-light">
                Every piece in our collection is carefully curated to ensure authenticity and quality from Indian artists.
              </p>
            </div>
            
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 font-serif">Passion</h3>
              <p className="text-gray-600 font-light">
                We're driven by our love for Indian art and our commitment to supporting creative communities.
              </p>
            </div>
            
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 font-serif">Community</h3>
              <p className="text-gray-600 font-light">
                Building connections between artists and art lovers across India is at the heart of what we do.
              </p>
            </div>
            
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 font-serif">Excellence</h3>
              <p className="text-gray-600 font-light">
                We strive for excellence in every aspect of our service, from curation to customer care.
              </p>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-2xl p-8 text-white mb-12 shadow-2xl">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 font-serif">Our Story</h2>
            <p className="text-lg text-white/90 mb-6 font-light leading-relaxed">
              Founded in 2024, Rangleela began as a passionate project to connect talented Indian artists 
              with art enthusiasts across the country. What started as a vision to celebrate India's rich artistic heritage 
              has grown into a thriving platform that showcases creativity and craftsmanship.
            </p>
            <p className="text-lg text-white/90 font-light leading-relaxed">
              Today, we're proud to work with dozens of artists from across India, offering 
              everything from traditional paintings to contemporary artistic apparel. Our commitment to quality, 
              authenticity, and community remains unchanged as we continue to grow.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12 font-serif">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:scale-105 transition-all duration-300">
              <div className="w-32 h-32 bg-gradient-to-br from-emerald-200 to-blue-200 rounded-full mx-auto mb-6 shadow-lg"></div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 font-serif">Rangleela Team</h3>
              <p className="text-emerald-600 font-medium mb-3">Founder & Curator</p>
              <p className="text-gray-600 text-sm font-light">
                Art enthusiasts passionate about promoting Indian creativity and connecting artists with art lovers.
              </p>
            </div>
            
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:scale-105 transition-all duration-300">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full mx-auto mb-6 shadow-lg"></div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 font-serif">Art Curation</h3>
              <p className="text-blue-600 font-medium mb-3">Quality & Authenticity</p>
              <p className="text-gray-600 text-sm font-light">
                Dedicated team ensuring every piece meets our high standards of quality and artistic value.
              </p>
            </div>
            
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:scale-105 transition-all duration-300">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mx-auto mb-6 shadow-lg"></div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 font-serif">Artist Relations</h3>
              <p className="text-purple-600 font-medium mb-3">Community Support</p>
              <p className="text-gray-600 text-sm font-light">
                Supporting and nurturing relationships with talented artists across India.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/20">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 font-serif">Join Our Community</h2>
          <p className="text-xl text-gray-600 mb-8 font-light leading-relaxed">
            Whether you're an artist looking to showcase your work or an art lover seeking unique pieces, 
            we'd love to have you as part of the Rangleela family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard" onClick={scrollToTop}>
              <Button className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 hover:from-emerald-600 hover:via-blue-600 hover:to-purple-600 shadow-xl hover:shadow-2xl transition-all duration-300">
                Browse Collection
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/contact?subject=artist" onClick={scrollToTop}>
              <Button variant="outline" className="border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 shadow-lg hover:shadow-xl transition-all duration-300">
                Become an Artist
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
