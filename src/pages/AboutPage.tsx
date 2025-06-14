import React from 'react';
import { Palette, Heart, Users, Award, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About Artistic Manifestation</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're passionate about connecting art lovers with talented creators, bringing unique paintings 
            and artistic apparel to people who appreciate the beauty of handcrafted art.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-6">
                At Artistic Manifestation, we believe that art has the power to transform spaces, inspire emotions, 
                and connect people across cultures. Our mission is to create a platform where artists can 
                showcase their work and art enthusiasts can discover pieces that speak to their souls.
              </p>
              <p className="text-gray-600">
                We're committed to supporting independent artists and providing them with the tools and 
                platform they need to reach a global audience while maintaining the authenticity and 
                personal touch that makes their work special.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Artist at work"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Palette className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Authenticity</h3>
              <p className="text-gray-600">
                Every piece in our collection is carefully curated to ensure authenticity and quality.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Passion</h3>
              <p className="text-gray-600">
                We're driven by our love for art and our commitment to supporting creative communities.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">
                Building connections between artists and art lovers is at the heart of what we do.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-600">
                We strive for excellence in every aspect of our service, from curation to customer care.
              </p>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-gradient-to-r from-purple-600 to-orange-500 rounded-2xl p-8 text-white mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-lg text-white/90 mb-6">
              Founded in 2024, Artistic Manifestation began as a small passion project to connect local artists 
              with art enthusiasts. What started as a weekend market has grown into a global platform 
              that celebrates creativity and craftsmanship.
            </p>
            <p className="text-lg text-white/90">
              Today, we're proud to work with hundreds of artists from around the world, offering 
              everything from original paintings to unique artistic apparel. Our commitment to quality, 
              authenticity, and community remains unchanged.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sarah Johnson</h3>
              <p className="text-purple-600 font-medium mb-2">Founder & CEO</p>
              <p className="text-gray-600 text-sm">
                Art historian and entrepreneur passionate about making art accessible to everyone.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Michael Chen</h3>
              <p className="text-purple-600 font-medium mb-2">Head of Curation</p>
              <p className="text-gray-600 text-sm">
                Former gallery director with 15 years of experience in contemporary art.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Emma Rodriguez</h3>
              <p className="text-purple-600 font-medium mb-2">Artist Relations</p>
              <p className="text-gray-600 text-sm">
                Working artist and advocate for emerging talent in the creative community.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Community</h2>
          <p className="text-xl text-gray-600 mb-8">
            Whether you're an artist looking to showcase your work or an art lover seeking unique pieces, 
            we'd love to have you as part of the Artistic Manifestation family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-purple-600 to-orange-500">
              Browse Collection
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline">
              Become an Artist
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
