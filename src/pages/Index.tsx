
import { useState } from 'react';
import { GloriaTab } from '@/components/GloriaTab';
import { TelegramTab } from '@/components/TelegramTab';
import { DatabaseTab } from '@/components/DatabaseTab';
import { OtherTab } from '@/components/OtherTab';
import { Console } from '@/components/Console';

const Index = () => {
  const [activeTab, setActiveTab] = useState('gloria');

  return (
    <div className="min-h-screen bg-base-100 text-base-content" data-theme="dark">
      <div className="flex flex-col h-screen">
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
