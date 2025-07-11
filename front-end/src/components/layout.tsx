import { LayoutDashboard, Users, Briefcase, Truck, ScanFace } from 'lucide-react';
import { Link, useLocation } from '@tanstack/react-router';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigation = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Drivers', path: '/drivers', icon: Users },
    { name: 'Jobs', path: '/jobs', icon: Briefcase },
    { name: 'Trucks', path: '/trucks', icon: Truck },
    { name: 'About Me', path: '/about', icon: ScanFace },
  ]

  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <Truck className="h-8 w-8 text-blue-600" />
                <h1 className="ml-2 text-xl font-bold text-gray-900">FleetMaster</h1>
              </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`${
                      location.pathname === item.path
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    } px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6">
          <div className="flex space-x-4 overflow-x-auto py-2">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${
                  location.pathname === item.path
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                } px-3 py-2 rounded-md text-sm font-medium flex items-center whitespace-nowrap transition-colors`}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-4 h-full flex-grow flex flex-col">
        {children}
      </main>
    </div>
  );
};