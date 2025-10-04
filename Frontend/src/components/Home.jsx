import React, { useState } from 'react';
import { 
  FaBrain, FaChartLine, FaShieldAlt, FaRocket, FaLightbulb, 
  FaCogs, FaSatelliteDish, FaRobot, FaChartArea, FaBell, FaQuoteLeft 
} from 'react-icons/fa';

const Home = ({ setCurrentScreen }) => {
  const features = [
    {
      icon: <FaBrain className="text-4xl" />,
      title: 'AI-Powered Predictions',
      description: 'Machine learning algorithms analyze geological, weather, and operational data to forecast rockfall events with high accuracy.',
    },
    {
      icon: <FaChartLine className="text-4xl" />,
      title: 'Real-Time Monitoring',
      description: 'Continuous sensor data feeds provide up-to-the-second insights into slope stability and seismic activity.',
    },
    {
      icon: <FaShieldAlt className="text-4xl" />,
      title: 'Proactive Safety',
      description: 'Instant alerts and risk assessments enable preemptive action, reducing incidents and ensuring worker safety.',
    },
    {
      icon: <FaSatelliteDish className="text-4xl" />,
      title: 'Multi-Source Integration',
      description: 'Seamlessly combines data from weather stations, seismic sensors, displacement monitors, and satellite imagery.',
    },
    {
      icon: <FaCogs className="text-4xl" />,
      title: 'Operational Efficiency',
      description: 'Optimize operations by identifying safe working zones and scheduling maintenance during low-risk periods.',
    },
    {
      icon: <FaRobot className="text-4xl" />,
      title: 'Automated Reporting',
      description: 'Generate comprehensive reports for compliance, audits, and strategic planning with minimal manual effort.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Data Collection',
      description: 'Sensors and monitoring devices continuously gather geological, meteorological, and operational data.',
    },
    {
      number: '02',
      title: 'AI Analysis',
      description: 'Advanced algorithms process data streams, identifying patterns and predicting potential hazards.',
    },
    {
      number: '03',
      title: 'Alert Generation',
      description: 'High-risk conditions trigger immediate alerts, sent to dashboards and mobile devices.',
    },
    {
      number: '04',
      title: 'Informed Action',
      description: 'Teams respond swiftly with data-driven decisions, minimizing risk and downtime.',
    },
  ];

  const testimonials = [
    {
      quote: 'StrataNet AI has transformed our safety protocols. We now anticipate issues before they escalate.',
      author: 'Sarah Chen',
      title: 'Chief Safety Officer, MineCore Ltd.',
    },
    {
      quote: "The predictive accuracy is remarkable. It's given us peace of mind and improved our operational efficiency.",
      author: 'James Rodriguez',
      title: 'Operations Manager, Peak Mining Co.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-600/20 p-4 rounded-full">
                <FaBrain className="text-6xl text-blue-400" />
              </div>
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 leading-tight">
              Safeguarding Mines with<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Advanced AI-driven
              </span>
              <br />Geotechnical Monitoring
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Empowering proactive safety and operational excellence in challenging environments.
            </p>
            <button
              onClick={() => setCurrentScreen('dashboard')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all inline-flex items-center space-x-2"
            >
              <FaRocket />
              <span>Launch Dashboard</span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Core Features</h2>
            <p className="text-slate-400 text-lg">
              Cutting-edge technology designed for maximum safety and efficiency
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-all hover:shadow-xl hover:shadow-blue-500/10"
              >
                <div className="text-blue-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-slate-400 text-lg">
              From data collection to actionable insights in four simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-3xl font-bold rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow-lg">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-400">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 -translate-x-8"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Proven Impact</h2>
            <p className="text-slate-400 text-lg">
              StrataNet AI is more than just a monitoring system; it's a commitment to a safer, more efficient future for mining.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-600/50 p-8 rounded-xl text-center">
              <div className="text-5xl font-bold text-green-400 mb-2">85%</div>
              <div className="text-white font-semibold mb-1">Reduction in Unforeseen Incidents</div>
              <div className="text-slate-400 text-sm">Based on deployment at 15+ sites</div>
            </div>
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-600/50 p-8 rounded-xl text-center">
              <div className="text-5xl font-bold text-blue-400 mb-2">40%</div>
              <div className="text-white font-semibold mb-1">Increase in Operational Uptime</div>
              <div className="text-slate-400 text-sm">Less downtime due to preventive measures</div>
            </div>
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-600/50 p-8 rounded-xl text-center">
              <div className="text-5xl font-bold text-purple-400 mb-2">100%</div>
              <div className="text-white font-semibold mb-1">Compliance & Audit Readiness</div>
              <div className="text-slate-400 text-sm">Automated reporting and documentation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-xl border border-slate-700"
              >
                <FaQuoteLeft className="text-blue-400 text-3xl mb-4" />
                <p className="text-slate-300 text-lg mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <div className="text-white font-semibold">{testimonial.author}</div>
                  <div className="text-slate-400 text-sm">{testimonial.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Mine Safety?
          </h2>
          <p className="text-slate-300 text-lg mb-8">
            Join the leading mines that trust StrataNet AI for unparalleled rockfall prediction and operational security.
          </p>
          <button
            onClick={() => setCurrentScreen('dashboard')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all inline-flex items-center space-x-2"
          >
            <FaBell />
            <span>Get Started Now</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
