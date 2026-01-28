import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Star, Heart, Calendar, Users, ArrowRight, CheckCircle, Phone, Mail, MapPin } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: <Sparkles className="text-purple-400" size={32} />,
      title: "Full Tarot Reading",
      description: "Comprehensive 60-minute session covering all aspects of your life",
      duration: "60 min",
      price: "₹75"
    },
    {
      icon: <Star className="text-pink-400" size={32} />,
      title: "Quick Reading",
      description: "Focused 30-minute session for specific questions",
      duration: "30 min", 
      price: "₹45"
    },
    {
      icon: <Heart className="text-red-400" size={32} />,
      title: "Relationship Reading",
      description: "Deep insights into love and relationships",
      duration: "45 min",
      price: "₹60"
    },
    {
      icon: <Calendar className="text-blue-400" size={32} />,
      title: "Career Reading",
      description: "Guidance for professional growth and decisions",
      duration: "45 min",
      price: "₹60"
    }
  ];

  const benefits = [
    "Clarity on life decisions",
    "Insight into relationships", 
    "Career guidance",
    "Spiritual growth",
    "Future predictions",
    "Personal empowerment"
  ];

  return (
    <div className="min-h-screen bg-cosmic-dark text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="text-8xl animate-pulse">✨🔮✨</div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-6">
              Tarot Reader 777
            </h1>
            <p className="text-xl md:text-2xl text-purple-200 mb-8 max-w-3xl mx-auto">
              Discover Your Mystical Journey Through Ancient Tarot Wisdom
            </p>
            <p className="text-lg text-purple-300 mb-12 max-w-2xl mx-auto">
              Unlock the secrets of your destiny with personalized tarot readings that provide guidance, clarity, and spiritual insight.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/book')}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full font-bold text-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Book Your Reading
                <ArrowRight size={20} />
              </button>
              <button
                onClick={() => navigate('/booking')}
                className="px-8 py-4 border-2 border-purple-400 hover:bg-purple-400 hover:bg-opacity-20 text-white rounded-full font-bold text-lg transition flex items-center justify-center gap-2"
              >
                Learn More
                <Sparkles size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-purple-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Tarot Services</h2>
            <p className="text-xl text-purple-200">Choose the reading that resonates with your journey</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 border border-purple-400 border-opacity-30 hover:bg-opacity-20 transition transform hover:scale-105">
                <div className="flex justify-center mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-purple-200 mb-4">{service.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-purple-300">{service.duration}</span>
                  <span className="text-gold font-bold">{service.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Why Choose Tarot Reader 777?</h2>
              <p className="text-lg text-purple-200 mb-8">
                Our experienced tarot readers combine ancient wisdom with modern insight to provide you with transformative readings that illuminate your path forward.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="text-green-400" size={20} />
                    <span className="text-purple-200">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <div className="text-9xl mb-4">🔮</div>
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-8 inline-block">
                <p className="text-white font-bold text-xl">1000+ Readings Completed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-purple-900/20 to-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Discover Your Destiny?</h2>
          <p className="text-xl text-purple-200 mb-8">
            Take the first step towards clarity and enlightenment with a personalized tarot reading.
          </p>
          <button
            onClick={() => navigate('/book')}
            className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full font-bold text-lg transition transform hover:scale-105 flex items-center justify-center gap-2 mx-auto"
          >
            Book Your Session Now
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-black bg-opacity-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <Phone className="text-purple-400 mx-auto mb-4" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">Call Us</h3>
              <p className="text-purple-200">+91 98765 43210</p>
            </div>
            <div>
              <Mail className="text-purple-400 mx-auto mb-4" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">Email</h3>
              <p className="text-purple-200">info@tarotreader777.com</p>
            </div>
            <div>
              <MapPin className="text-purple-400 mx-auto mb-4" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">Location</h3>
              <p className="text-purple-200">Mumbai, India</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
