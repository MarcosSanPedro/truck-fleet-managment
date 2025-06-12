import React, { useState } from 'react';
import { Layout } from './components/layout';
import { Dashboard } from './components/dashboard';
import { Drivers } from './pages/Drivers';
import { Jobs } from './pages/Jobs';
import { Trucks } from './pages/Trucks';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'drivers':
        return <Drivers />;
      case 'jobs':
        return <Jobs />;
      case 'trucks':
        return <Trucks />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;