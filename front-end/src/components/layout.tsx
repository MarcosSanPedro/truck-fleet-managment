import React from 'react';
import { LayoutDashboard, Users, Briefcase, Truck } from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab }) => {
  const navigation = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Drivers', path: 'drivers', icon: Users },
    { name: 'Jobs', path: 'jobs', icon: Briefcase },
    { name: 'Trucks', path: 'trucks', icon: Truck },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Truck className="h-8 w-8 text-blue-600" />
                <h1 className="ml-2 text-xl font-bold text-gray-900">FleetMaster</h1>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`${
                      activeTab === item.path
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
      <div className="md:hidden bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6">
          <div className="flex space-x-4 overflow-x-auto py-2">
            {navigation.map((item) => (
              <button
                key={item.path}
                className={`${
                  activeTab === item.path
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                } px-3 py-2 rounded-md text-sm font-medium flex items-center whitespace-nowrap transition-colors`}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        {children}
      </main>
    </div>
  );
};