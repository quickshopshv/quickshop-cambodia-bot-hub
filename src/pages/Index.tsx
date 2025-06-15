
import { useState, useEffect } from 'react';
import { GloriaTab } from '@/components/GloriaTab';
import { TelegramTab } from '@/components/TelegramTab';
import { DatabaseTab } from '@/components/DatabaseTab';
import { OtherTab } from '@/components/OtherTab';
import { Console } from '@/components/Console';
import { useConsole } from '@/hooks/useConsole';

const Index = () => {
  const [activeTab, setActiveTab] = useState('gloria');
  const [isLoading, setIsLoading] = useState(true);
  const { addLog } = useConsole();

  useEffect(() => {
    // Simulate app initialization
    const initApp = async () => {
      try {
        addLog('Initializing QuickShop Cambodia Bot Hub...', 'info');
        
        // Add a small delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        addLog('Application loaded successfully!', 'success');
        setIsLoading(false);
      } catch (error) {
        addLog(`Initialization error: ${error}`, 'error');
        setIsLoading(false);
      }
    };

    initApp();
  }, [addLog]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100 text-base-content flex items-center justify-center" data-theme="dark">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-lime-600"></div>
          <p className="mt-4 text-lime-400">Loading QuickShop Cambodia Bot Hub...</p>
        </div>
      </div>
    );
  }

  const getPageTitle = () => {
    switch (activeTab) {
      case 'gloria':
        return 'GLORIA API CONFIGURATION';
      case 'telegram':
        return 'TELEGRAM BOT CONFIGURATION';
      case 'database':
        return 'DATABASE CONFIGURATION';
      case 'other':
        return 'OTHER SETTINGS';
      default:
        return 'QUICKSHOP CAMBODIA BOT HUB';
    }
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content" data-theme="dark">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="navbar bg-base-200 border-b border-lime-600">
          <div className="flex-1">
            <h1 className="text-xl font-bold bg-gradient-to-r from-lime-400 to-green-400 bg-clip-text text-transparent">
              {getPageTitle()}
            </h1>
          </div>
        </div>

        {/* Main Content Area - 2/3 of screen */}
        <div className="flex-grow pb-4">
          {/* Tab Navigation */}
          <div className="tabs tabs-boxed w-full justify-center mb-4 bg-base-200">
            <button 
              className={`tab ${activeTab === 'gloria' ? 'tab-active bg-lime-600' : ''}`}
              onClick={() => setActiveTab('gloria')}
            >
              GLORIA
            </button>
            <button 
              className={`tab ${activeTab === 'telegram' ? 'tab-active bg-lime-600' : ''}`}
              onClick={() => setActiveTab('telegram')}
            >
              TELEGRAM
            </button>
            <button 
              className={`tab ${activeTab === 'database' ? 'tab-active bg-lime-600' : ''}`}
              onClick={() => setActiveTab('database')}
            >
              DATABASE
            </button>
            <button 
              className={`tab ${activeTab === 'other' ? 'tab-active bg-lime-600' : ''}`}
              onClick={() => setActiveTab('other')}
            >
              OTHER
            </button>
          </div>

          {/* Tab Content */}
          <div className="px-4">
            {activeTab === 'gloria' && <GloriaTab />}
            {activeTab === 'telegram' && <TelegramTab />}
            {activeTab === 'database' && <DatabaseTab />}
            {activeTab === 'other' && <OtherTab />}
          </div>
        </div>

        {/* Console - 1/3 of screen from bottom */}
        <Console />
      </div>
    </div>
  );
};

export default Index;
