"use client"
import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"
import {
  Truck,
  Database,
  BarChart3,
  Settings,
  Monitor,
  Zap,
  Shield,
  Clock,
  BookOpen,
  Code,
  Table,
  FormInput,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/About")({
  component: About,
})

function About() {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [time, setTime] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    const handleScroll = () => setScrollY(window.scrollY)
    const timer = setInterval(() => setTime((prev) => prev + 1), 50)
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearInterval(timer)
    }
  }, [])

  const techStack = [
    { name: "React", icon: "⚛️", description: "Mastered component-based architecture and hooks for dynamic UIs." },
    { name: "TailwindCSS", icon: "🎨", description: "Streamlined styling with utility-first CSS framework." },
    { name: "TanStack Router", icon: "🛣️", description: "Leveraged type-safe routing for seamless navigation." },
    { name: "ShadCN/UI", icon: "✨", description: "Integrated reusable, accessible UI components." },
    { name: "Python", icon: "🐍", description: "Developed robust backend logic and APIs." },
    { name: "SQLAlchemy", icon: "🔗", description: "Implemented efficient ORM for database operations." },
    { name: "SQLite", icon: "💾", description: "Utilized lightweight database for scalable storage." },
  ]

  const learningJourney = [
    {
      title: "Database Design",
      description: "Navigated complex data process and gained deep insights into effective data modeling.",
      icon: <Database className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
      milestone: "Optimized schema design for performance.",
    },
    {
      title: "React Component Lifecycle",
      description:
        "Mastered useEffect and state management, enhancing understanding of React's rendering and lifecycle processes.",
      icon: <Monitor className="w-6 h-6" />,
      color: "from-purple-500 to-indigo-500",
      milestone: "Achieved efficient component updates.",
    },
    {
      title: "State Management Solutions",
      description:
        "Transitioned from prop drilling to advanced state management, improving application scalability and maintainability.",
      icon: <Settings className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500",
      milestone: "Streamlined data flow across components.",
    },
    {
      title: "Full-Stack Integration",
      description:
        "Successfully connected frontend and backend systems, ensuring seamless data flow and robust API interactions.",
      icon: <Zap className="w-6 h-6" />,
      color: "from-orange-500 to-red-500",
      milestone: "Achieved end-to-end functionality.",
    },
  ]

  const coreFeatures = [
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Fleet Management",
      description: "Developed comprehensive fleet operations with intricate business logic.",
      accent: "blue",
      challenge: "Ensuring real-time data accuracy.",
    },
    {
      icon: <Table className="w-6 h-6" />,
      title: "Data Table Rendering",
      description: "Developed dynamic data tables to display and manage complex datasets efficiently.",
      accent: "green",
      challenge: "Ensuring smooth performance with large volumes of data.",
    },
    {
      icon: <FormInput className="w-6 h-6" />,
      title: "Dynamic Forms",
      description: "Implemented dynamic, validated forms to collect and process user input efficiently and securely.",
      accent: "purple",
      challenge: " Robust validation and user-friendly interactions.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Compliance Monitoring",
      description: "Designed robust validation systems to ensure regulatory compliance and data integrity.",
      accent: "orange",
      challenge: "Building reliable form validation.",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Data Analytics",
      description: "Implemented interactive dashboards for data visualization, enabling actionable insights.",
      accent: "pink",
      challenge: "Optimizing chart responsiveness.",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Map & Tracking (In Progress)",
      description: "Working on Developing real-time map integration and tracking features.",
      accent: "cyan",
      challenge: "Integrating live geolocation data smoothly.",
    },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-900">
      {/* Particle Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
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
                transition: "all 0.1s ease-out",
                animationDelay: `${i * 0.1}s`,
              }}
            ></div>
          ))}
        </div>
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
                transition: "all 0.1s ease-out",
              }}
            ></div>
          ))}
        </div>
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Professional Truck Convoy at Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-16 z-20 pointer-events-none overflow-hidden bg-gradient-to-t from-slate-800/20 to-transparent">
        <div className="absolute bottom-8 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-500/30 to-transparent"></div>
        {[
          { size: "w-8 h-8", color: "text-blue-400", opacity: "opacity-70", speed: 1.8, offset: 0 },
          { size: "w-7 h-7", color: "text-cyan-400", opacity: "opacity-60", speed: 2.9, offset: -200 },
          { size: "w-9 h-9", color: "text-purple-400", opacity: "opacity-80", speed: 1.7, offset: -400 },
          { size: "w-6 h-6", color: "text-indigo-400", opacity: "opacity-50", speed: 2.0, offset: -600 },
          { size: "w-8 h-8", color: "text-teal-400", opacity: "opacity-65", speed: 1.15, offset: -800 },
          { size: "w-7 h-7", color: "text-sky-400", opacity: "opacity-75", speed: 1.45, offset: -1000 },
          { size: "w-10 h-10", color: "text-blue-300", opacity: "opacity-55", speed: 1.35, offset: -1200 },
          { size: "w-8 h-8", color: "text-violet-400", opacity: "opacity-70", speed: 1.8, offset: -1400 },
        ].map((truck, index) => {
          const position = ((time * truck.speed + truck.offset) % (window.innerWidth + 200)) - 100
          return (
            <div
              key={index}
              className="absolute bottom-6 flex items-center transition-none"
              style={{
                left: `${position}px`,
                transform: "translateZ(0)",
                willChange: "transform",
              }}
            >
              <Truck className={`${truck.size} ${truck.color} ${truck.opacity} drop-shadow-sm`} />
              <div
                className={`h-0.5 bg-gradient-to-r from-current to-transparent ml-1 ${truck.color} ${truck.opacity}`}
                style={{ width: `${12 + index * 2}px` }}
              ></div>
            </div>
          )
        })}
        {[
          { size: "w-5 h-5", color: "text-slate-400", opacity: "opacity-40", speed: 1.1, offset: -300 },
          { size: "w-6 h-6", color: "text-gray-400", opacity: "opacity-35", speed: 0.6, offset: -700 },
          { size: "w-5 h-5", color: "text-zinc-400", opacity: "opacity-45", speed: 1.2, offset: -1100 },
          { size: "w-4 h-4", color: "text-slate-500", opacity: "opacity-30", speed: 0.9, offset: -1500 },
        ].map((truck, index) => {
          const position = ((time * truck.speed + truck.offset) % (window.innerWidth + 200)) - 100
          return (
            <div
              key={`small-${index}`}
              className="absolute bottom-5 flex items-center transition-none"
              style={{
                left: `${position}px`,
                transform: "translateZ(0)",
                willChange: "transform",
              }}
            >
              <Truck className={`${truck.size} ${truck.color} ${truck.opacity}`} />
            </div>
          )
        })}
      </div>

      {/* Content */}
      <div className="relative z-10 text-white">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center max-w-5xl mx-auto transition-all duration-1000 ${isVisible ? `opacity-100 translate-y-0` : `opacity-0 translate-y-10`}`}
          >
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-full mb-6 shadow-2xl">
                <Truck className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent leading-none">
              FleetMaster
            </h1>
            <div className="space-y-4 mb-8">
              <p className="text-xl md:text-2xl text-blue-200 font-light">A Full-Stack Development Journey</p>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Developed by{" "}
                <a
                  href="https://marcossanpedro.com/"
                  target="_blank"
                  className="font-bold text-blue-400"
                  rel="noreferrer"
                >
                  Marcos San Pedro
                </a>{" "}
                — A showcase of professional growth through modern web technologies, demonstrating resilience and
                technical mastery.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {["Full-Stack Development", "Continuous Learning", "Lots of Coffee ☕"].map((tag) => (
                <Badge
                  key={tag}
                  className="px-4 py-2 text-sm bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Dashboard Button */}
            <div className="mt-10">
              <Link to="/">
                <Button
                  size="lg"
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 hover:from-blue-600 hover:via-purple-600 hover:to-cyan-600 text-white font-semibold text-lg rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 border-0 backdrop-blur-sm"
                >
                  <span className="flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-cyan-400/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300 -z-10"></div>
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold pb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Technology Stack
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                A curated set of tools and frameworks mastered through rigorous development and problem-solving.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {techStack.map((tech) => (
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

        {/* Learning Journey */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold pb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Development Milestones
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Key achievements and lessons learned in building a robust full-stack application.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {learningJourney.map((journey, index) => (
                <Card
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02] group"
                >
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${journey.color} rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        {journey.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-white text-lg">{journey.title}</CardTitle>
                        </div>
                        <CardDescription className="text-gray-300 text-sm">{journey.description}</CardDescription>
                        <p className="text-xs text-orange-300 italic mt-2">🏆 {journey.milestone}</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold pb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Core Application Features
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Functional components built to address real-world operational needs, refined through iterative
                development.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreFeatures.map((feature, index) => (
                <Card
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 group"
                >
                  <CardHeader>
                    <div
                      className={`w-12 h-12 mb-3 bg-gradient-to-br from-${feature.accent}-500 to-${feature.accent}-600 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      {feature.icon}
                    </div>
                    <CardTitle className="text-white text-lg mb-2">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm mb-3">{feature.description}</p>
                    <p className="text-xs text-orange-300 italic">⚙️ {feature.challenge}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Developer Reflection */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-6">
                <Code className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">Lessons from the Journey</h2>
            <div className="space-y-6 text-base md:text-lg text-gray-300">
              <p>
                FleetMaster represents more than a fleet management system—it is a testament to the power of
                perseverance and structured problem-solving in software development.
              </p>
              <p>
                Through rigorous debugging of database schemas, mastering React's component lifecycle, and ensuring
                seamless API integrations, this project honed my technical and analytical skills. Each challenge was an
                opportunity to deepen my expertise.
              </p>
              <p>
                As an emerging developer, I learned that tackling complex problems builds not just applications but also
                confidence and competence. This project underscores the value of embracing challenges as pathways to
                growth.
              </p>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 mt-8 border border-white/10">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-semibold text-white">Advice for Aspiring Developers</h3>
                </div>
                <p className="text-blue-200">
                  Engage with ambitious projects that push your limits. Growth occurs at the edge of your comfort zone,
                  where challenges foster innovation and skill development.
                </p>
              </div>
              <p className="text-xl font-light text-blue-300 italic mt-8">
                "Success in development comes from persistence and a willingness to learn from every challenge."
              </p>
              <p className="text-lg text-blue-400 font-semibold mt-6">— Marcos San Pedro</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
