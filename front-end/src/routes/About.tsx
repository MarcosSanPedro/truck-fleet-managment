import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react';
import { Truck, Code, Database, Users, Calendar, BarChart3, Settings, FileText, Monitor, Zap, Shield, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const Route = createFileRoute('/About')({
  component: RouteComponent,
})

function RouteComponent() {


  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    
    const timer = setInterval(() => setTime(prev => prev + 1), 50);
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  const techStack = [
    { name: 'React', icon: '⚛️', description: 'Component-based UI' },
    { name: 'TailwindCSS', icon: '🎨', description: 'Rapid styling' },
    { name: 'TanStack Router', icon: '🛣️', description: 'Type-safe navigation' },
    { name: 'ShadCN/UI', icon: '✨', description: 'Premium components' },
    { name: 'Python', icon: '🐍', description: 'Backend logic' },
    { name: 'SQLAlchemy', icon: '🔗', description: 'Advanced ORM' },
    { name: 'SQLite', icon: '💾', description: 'Data storage' },
  ];

  const projectHighlights = [
    {
      title: "Full-Stack Architecture",
      description: "Designed scalable architecture separating frontend, backend, and data layers with clean interfaces.",
      icon: <Settings className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Database Engineering",
      description: "Complex relational schemas with SQLAlchemy, optimized queries and efficient relationships.",
      icon: <Database className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Modern Frontend",
      description: "Responsive interfaces with React hooks, TypeScript, and modern CSS for optimal UX.",
      icon: <Monitor className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "System Integration",
      description: "Seamless integration of multiple technologies with real-time sync and error handling.",
      icon: <Zap className="w-6 h-6" />,
      color: "from-orange-500 to-red-500"
    }
  ];

  const coreFeatures = [
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Fleet Operations",
      description: "Complete vehicle lifecycle management with status monitoring and operational history.",
      accent: "blue"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Personnel Management",
      description: "Driver profiles with certification tracking and performance analytics.",
      accent: "green"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Smart Scheduling",
      description: "Advanced trip planning with conflict detection and resource allocation.",
      accent: "purple"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Compliance Tracking",
      description: "Automated monitoring for licenses, inspections, and regulatory requirements.",
      accent: "orange"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Business Intelligence",
      description: "Real-time analytics with KPI tracking and performance optimization insights.",
      accent: "pink"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Maintenance Hub",
      description: "Predictive maintenance scheduling with service history and cost tracking.",
      accent: "cyan"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-900">
      {/* Particle Background */}
      <div className="fixed inset-0 z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        
        {/* Particle system */}
        <div className="absolute inset-0">
          {[...Array(80)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-blue-400 rounded-full opacity-30"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `
                  translateY(${Math.sin(time * 0.01 + i * 0.5) * 50 - scrollY * 0.1}px)
                  translateX(${Math.cos(time * 0.008 + i * 0.3) * 30}px)
                `,
                transition: 'all 0.1s ease-out',
                animationDelay: `${i * 0.1}s`
              }}
            ></div>
          ))}
        </div>

        {/* Additional floating particles */}
        <div className="absolute inset-0">
          {[...Array(40)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute bg-purple-400 rounded-full opacity-20"
              style={{
                width: `${Math.random() * 2 + 0.5}px`,
                height: `${Math.random() * 2 + 0.5}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `
                  translateY(${Math.sin(time * 0.015 + i * 0.7) * 40}px)
                  translateX(${Math.cos(time * 0.012 + i * 0.4) * 25}px)
                `,
                transition: 'all 0.1s ease-out'
              }}
            ></div>
          ))}
        </div>

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Professional Truck Convoy at Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-16 z-20 pointer-events-none overflow-hidden bg-gradient-to-t from-slate-800/20 to-transparent">
        {/* Road line */}
        <div className="absolute bottom-8 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-500/30 to-transparent"></div>
        
        {/* Truck convoy - 8 trucks with different speeds and spacing */}
        {[
          { size: 'w-8 h-8', color: 'text-blue-400', opacity: 'opacity-70', speed: 0.8, offset: 0 },
          { size: 'w-7 h-7', color: 'text-cyan-400', opacity: 'opacity-60', speed: 0.9, offset: -200 },
          { size: 'w-9 h-9', color: 'text-purple-400', opacity: 'opacity-80', speed: 0.7, offset: -400 },
          { size: 'w-6 h-6', color: 'text-indigo-400', opacity: 'opacity-50', speed: 1.0, offset: -600 },
          { size: 'w-8 h-8', color: 'text-teal-400', opacity: 'opacity-65', speed: 0.85, offset: -800 },
          { size: 'w-7 h-7', color: 'text-sky-400', opacity: 'opacity-75', speed: 0.75, offset: -1000 },
          { size: 'w-10 h-10', color: 'text-blue-300', opacity: 'opacity-55', speed: 0.95, offset: -1200 },
          { size: 'w-8 h-8', color: 'text-violet-400', opacity: 'opacity-70', speed: 0.8, offset: -1400 }
        ].map((truck, index) => {
          const position = ((time * truck.speed + truck.offset) % (window.innerWidth + 200)) - 100;
          return (
            <div
              key={index}
              className="absolute bottom-6 flex items-center transition-none"
              style={{ 
                left: `${position}px`,
                transform: 'translateZ(0)', // Hardware acceleration
                willChange: 'transform'
              }}
            >
              <Truck className={`${truck.size} ${truck.color} ${truck.opacity} drop-shadow-sm`} />
              {/* Subtle motion trail */}
              <div 
                className={`h-0.5 bg-gradient-to-r from-current to-transparent ml-1 ${truck.color} ${truck.opacity}`}
                style={{ width: `${12 + index * 2}px` }}
              ></div>
            </div>
          );
        })}
        
        {/* Additional smaller trucks for density */}
        {[
          { size: 'w-5 h-5', color: 'text-slate-400', opacity: 'opacity-40', speed: 1.1, offset: -300 },
          { size: 'w-6 h-6', color: 'text-gray-400', opacity: 'opacity-35', speed: 0.6, offset: -700 },
          { size: 'w-5 h-5', color: 'text-zinc-400', opacity: 'opacity-45', speed: 1.2, offset: -1100 },
          { size: 'w-4 h-4', color: 'text-slate-500', opacity: 'opacity-30', speed: 0.9, offset: -1500 }
        ].map((truck, index) => {
          const position = ((time * truck.speed + truck.offset) % (window.innerWidth + 200)) - 100;
          return (
            <div
              key={`small-${index}`}
              className="absolute bottom-5 flex items-center transition-none"
              style={{ 
                left: `${position}px`,
                transform: 'translateZ(0)',
                willChange: 'transform'
              }}
            >
              <Truck className={`${truck.size} ${truck.color} ${truck.opacity}`} />
            </div>
          );
        })}
      </div>

      {/* Content */}
      <div className="relative z-10 text-white">
        {/* Hero Section - Compact */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className={`text-center max-w-5xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-full mb-6 shadow-2xl">
                <Truck className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent leading-none">
              FleetMaster
            </h1>
            
            <div className="space-y-4 mb-8">
              <p className="text-xl md:text-2xl text-blue-200 font-light">
                Enterprise Fleet Management System
              </p>
              
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                A sophisticated full-stack application by{' '}
                <span className="font-bold text-blue-400">Marcos San Pedro</span>{' '}
                demonstrating advanced software development and modern architecture.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              {['Full-Stack Development', 'Modern Architecture', 'Production Ready'].map((tag, index) => (
                <Badge 
                  key={tag}
                  className="px-4 py-2 text-sm bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Stack - Compact */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Technology Stack
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Modern technologies for exceptional performance and maintainability
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {techStack.map((tech, index) => (
                <Card 
                  key={tech.name}
                  className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 group"
                >
                  <CardHeader className="text-center pb-2">
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                      {tech.icon}
                    </div>
                    <CardTitle className="text-white text-base">{tech.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-xs text-center">{tech.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Project Highlights - Compact */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Engineering Excellence
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Key technical achievements demonstrating advanced software engineering
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projectHighlights.map((highlight, index) => (
                <Card 
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02] group"
                >
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${highlight.color} rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {highlight.icon}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg mb-2">{highlight.title}</CardTitle>
                        <CardDescription className="text-gray-300 text-sm">
                          {highlight.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Core Features - Compact */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                System Capabilities
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Comprehensive features for enterprise-level fleet operations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreFeatures.map((feature, index) => (
                <Card 
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 group"
                >
                  <CardHeader>
                    <div className={`w-12 h-12 mb-3 bg-gradient-to-br from-${feature.accent}-500 to-${feature.accent}-600 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-white text-lg mb-2">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Developer Reflection - Compact */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-6">
                <Code className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
              Developer's Journey
            </h2>
            
            <div className="space-y-6 text-base md:text-lg text-gray-300">
              <p>
                Building FleetMaster was an intensive exploration of modern software development. 
                This project challenged me to architect scalable solutions and implement complex business logic 
                with production-quality standards.
              </p>
              
              <p>
                Every component was crafted with attention to performance, maintainability, and user experience. 
                From efficient database schemas to responsive frontend components, each decision prioritized 
                real-world operational requirements.
              </p>
              
              <p className="text-xl font-light text-blue-300 italic mt-8">
                "Excellence is a continuous journey of learning and improvement."
              </p>
              
              <p className="text-lg text-blue-400 font-semibold mt-6">
                — Marcos San Pedro
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
