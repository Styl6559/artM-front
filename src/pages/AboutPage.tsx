import React from 'react';
import { Link } from 'react-router-dom';
import { Palette, Heart, Users, Award, ArrowRight, ArrowLeft, Target } from 'lucide-react';
import Button from '../components/ui/Button';
import SEO from '../components/SEO';

const AboutPage: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      <SEO 
        title="About RangLeela - Our Story & Mission | Indian Art & Fashion Platform"
        description="Learn about RangLeela's journey to support Indian artists and creators. Discover how we connect talented painters, fashion designers, and artisans with art lovers worldwide."
        keywords="about RangLeela, Indian artists, art platform, creative community, handmade art, artistic mission, support artists"
        url="https://rangleela.com/about"
      />
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
            Rangleela is not just a brand, it's a celebration of art, creativity, and culture. 
            Every product we create is hand-painted with care, passion, and imagination, turning everyday objects into treasures that inspire joy.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4 font-serif">Our Story & Mission</h2>
              <p className="text-gray-600 mb-6 font-light leading-relaxed">
                From vibrant decor pieces to unique accessories and artistic apparels, our collection blends tradition with modern expression. 
                Each stroke of colour at Rangleela carries a message of love, positivity, and individuality. 
                Our creations aren't mass-produced – they are one-of-a-kind artworks designed to brighten spaces, uplift moods, and make memories special.
              </p>
              <p className="text-gray-600 font-light leading-relaxed">
                We believe that art should be a part of everyday life, not confined to galleries and museums. 
                That's why we transform ordinary objects into extraordinary canvases, bringing color, joy, and meaning to your daily routine.
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
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12 font-serif">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Palette className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 font-serif">Soulful Paintings</h3>
              <p className="text-gray-600 font-light">
                From mini collectibles to large canvases – every piece is meticulously hand-painted, making each artwork truly one-of-a-kind.
              </p>
            </div>
            
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 font-serif">Hand-Painted Wooden Articles</h3>
              <p className="text-gray-600 font-light">
                Beautiful magnets, coasters, bookmarks & boxes that tell your story and reflect your personality through the magic of art.
              </p>
            </div>
            
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 font-serif">Thoughtful Gifting Options</h3>
              <p className="text-gray-600 font-light">
                Gifts that carry warmth and meaning, bringing your creative visions to life with artistic flair.
              </p>
            </div>
            
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 font-serif">Customized Artistic Apparels</h3>
              <p className="text-gray-600 font-light">
                Unique accessories and artistic apparels that celebrate traditional art techniques while embracing contemporary creativity.
              </p>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
            <div>
              <p className="text-gray-600 mb-6 font-light leading-relaxed">
                At Rangleela, we believe that every object has the potential to become a canvas for creativity. 
                Our journey began with a simple yet powerful idea: to transform the mundane into the magnificent through 
                the timeless art of hand-painting. Each brushstroke tells a story, each color carries emotion, 
                and each finished piece becomes a unique expression of artistry.
              </p>
              <p className="text-gray-600 font-light leading-relaxed">
                Each stroke of colour at Rangleela carries a message of love, positivity, and individuality. 
                Our creations aren't mass-produced – they are one-of-a-kind artworks designed to brighten spaces, uplift moods, and make memories special. 
                Rangleela – Spreading smiles, one brushstroke at a time.
              </p>
            </div>
            <div className="relative flex flex-col items-center">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-2xl blur-2xl opacity-20"></div>
              <img
                src="https://images.pexels.com/photos/1438761/pexels-photo-1438761.jpeg?auto=compress&w=600&h=400&fit=crop"
                alt="Hand-painted art in progress"
                className="relative rounded-2xl shadow-xl"
              />
              <h2 className="text-2xl font-bold text-gray-800 mt-4 font-serif text-center">Spreading Smiles, One Brushstroke at a Time</h2>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12 font-serif">Our Creative Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:scale-105 transition-all duration-300">
              <div className="w-32 h-32 bg-gradient-to-br from-emerald-200 to-blue-200 rounded-full mx-auto mb-6 shadow-lg"></div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 font-serif">Master Artisans</h3>
              <p className="text-emerald-600 font-medium mb-3">Skilled Craftspeople</p>
              <p className="text-gray-600 text-sm font-light">
                Our talented artisans bring years of experience and passion to every hand-painted creation, ensuring exceptional quality.
              </p>
            </div>
            
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:scale-105 transition-all duration-300">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full mx-auto mb-6 shadow-lg"></div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 font-serif">Custom Design</h3>
              <p className="text-blue-600 font-medium mb-3">Personalization Experts</p>
              <p className="text-gray-600 text-sm font-light">
                We work closely with you to bring your vision to life, creating truly personalized pieces that reflect your unique style.
              </p>
            </div>
            
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:scale-105 transition-all duration-300">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mx-auto mb-6 shadow-lg"></div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 font-serif">Quality Assurance</h3>
              <p className="text-purple-600 font-medium mb-3">Excellence Standards</p>
              <p className="text-gray-600 text-sm font-light">
                Every piece undergoes careful quality checks to ensure it meets our high standards before reaching you.
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
