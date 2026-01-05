import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import Card from '../components/Card';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(user.role === 'customer' ? '/customer/dashboard' : '/vendor/dashboard');
    }
  }, [user, navigate]);

  const features = [
    {
      icon: '⚡',
      title: 'Instant Booking Confirmation',
      description: 'Get immediate confirmation for your reservations with real-time availability updates.'
    },
    {
      icon: '💰',
      title: 'Best Price Guarantee',
      description: 'We ensure you get the best rates available with our price match guarantee.'
    },
    {
      icon: '🛡️',
      title: '24/7 Customer Support',
      description: 'Our dedicated support team is always available to assist you anytime, anywhere.'
    },
    {
      icon: '✅',
      title: 'Verified Properties',
      description: 'All listed properties are verified and reviewed to ensure quality and safety.'
    },
    {
      icon: '🔒',
      title: 'Secure Payments',
      description: 'Your transactions are protected with industry-standard encryption and security.'
    },
    {
      icon: '🔄',
      title: 'Easy Cancellation',
      description: 'Flexible cancellation policies with hassle-free refund processing.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Properties Listed' },
    { number: '50,000+', label: 'Happy Customers' },
    { number: '98%', label: 'Satisfaction Rate' },
    { number: '500+', label: 'Partner Restaurants' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Book Your Perfect Stay or<br />
              <span className="text-yellow-300">Dining Experience</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Discover and book exceptional hotels and restaurants with ease. Your next amazing experience is just a click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                variant="primary"
                className="bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto"
                onClick={() => navigate('/customer/listings')}
              >
                🏨 Find Hotels
              </Button>
              <Button 
                size="lg" 
                variant="accent"
                className="w-full sm:w-auto"
                onClick={() => navigate('/customer/listings')}
              >
                🍽️ Book Restaurants
              </Button>
            </div>
            <div className="mt-8">
              <p className="text-sm text-blue-100 mb-2">New here?</p>
              <Button 
                variant="outline" 
                size="sm"
                className="border-white text-white hover:bg-white hover:text-blue-600"
                onClick={() => navigate('/register')}
              >
                Create Free Account
              </Button>
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-blue-600">StayDine</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide everything you need for a seamless booking experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="text-center transform transition-all duration-300 hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">Simple steps to your perfect booking</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Customers */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                <span className="text-blue-600">For Customers</span>
              </h3>
              <div className="space-y-6">
                {[
                  { num: '1', title: 'Browse', desc: 'Explore our curated selection of hotels and restaurants' },
                  { num: '2', title: 'Select', desc: 'Choose your perfect match based on reviews and amenities' },
                  { num: '3', title: 'Book', desc: 'Complete your reservation with secure payment' },
                  { num: '4', title: 'Enjoy', desc: 'Experience exceptional service and create memories' }
                ].map((step) => (
                  <div key={step.num} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {step.num}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{step.title}</h4>
                      <p className="text-gray-600">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* For Partners */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                <span className="text-purple-600">For Partners</span>
              </h3>
              <div className="space-y-6">
                {[
                  { num: '1', title: 'List', desc: 'Add your property with detailed information and photos' },
                  { num: '2', title: 'Manage', desc: 'Use our intuitive dashboard to manage availability' },
                  { num: '3', title: 'Accept', desc: 'Receive and confirm bookings instantly' },
                  { num: '4', title: 'Earn', desc: 'Grow your business with increased visibility' }
                ].map((step) => (
                  <div key={step.num} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {step.num}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{step.title}</h4>
                      <p className="text-gray-600">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Platform Showcase */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Customer Benefits */}
            <Card className="bg-white">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">👥</div>
                <h3 className="text-2xl font-bold text-gray-900">Customer Benefits</h3>
              </div>
              <ul className="space-y-4">
                {[
                  'Wide selection of verified properties',
                  'Instant booking confirmation',
                  'Authentic reviews from real guests',
                  'Best price guarantee',
                  'Secure payment processing',
                  'Flexible cancellation policies'
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Partner Benefits */}
            <Card className="bg-white">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">🏢</div>
                <h3 className="text-2xl font-bold text-gray-900">Partner Benefits</h3>
              </div>
              <ul className="space-y-4">
                {[
                  'Easy property management dashboard',
                  'Increased visibility to customers',
                  'Real-time analytics and insights',
                  'Commission-free first month',
                  'Dedicated partner support',
                  'Marketing and promotional tools'
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-purple-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of satisfied customers and partners today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="primary"
              onClick={() => navigate('/register?role=customer')}
            >
              Start Booking Today
            </Button>
            <Button 
              size="lg" 
              variant="accent"
              onClick={() => navigate('/register?role=vendor')}
            >
              List Your Property
            </Button>
          </div>
          <div className="mt-6">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button 
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
