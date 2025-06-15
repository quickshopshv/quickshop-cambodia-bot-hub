
import { useState, useEffect } from 'react';
import { GloriaTab } from '@/components/GloriaTab';
import { TelegramTab } from '@/components/TelegramTab';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading QuickShop Cambodia Bot Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col h-screen">
        {/* Main Content Area - 2/3 of screen */}
        <div className="flex-grow overflow-auto">
          <div className="max-w-7xl mx-auto p-6">
            {activeTab === 'gloria' && <GloriaTab />}
            {activeTab === 'telegram' && <TelegramTab />}
          </div>
        </div>

        {/* Console - 1/3 of screen from bottom */}
        <Console activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
};

export default Index;
