
import { useConsole } from '@/hooks/useConsole';
import { Bot, Database } from 'lucide-react';

interface ConsoleProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Console = ({ activeTab, setActiveTab }: ConsoleProps) => {
  const { logs, clearLogs } = useConsole();

  return (
    <div className="h-1/3 bg-gray-900 border-t border-gray-300">
      <div className="flex justify-between items-center p-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <h3 className="text-green-400 font-semibold text-sm">CONSOLE</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('gloria')}
              className={`flex items-center space-x-1 px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeTab === 'gloria'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Database className="w-3 h-3" />
              <span>GLORIA</span>
            </button>
            <button
              onClick={() => setActiveTab('telegram')}
              className={`flex items-center space-x-1 px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeTab === 'telegram'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Bot className="w-3 h-3" />
              <span>TELEGRAM</span>
            </button>
          </div>
        </div>
        <button 
          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors"
          onClick={clearLogs}
        >
          CLEAR
        </button>
      </div>
      <div className="h-full p-4 overflow-y-auto font-mono text-sm">
        {logs.length === 0 ? (
          <div className="text-gray-500">Console ready...</div>
        ) : (
          logs.map((log, index) => (
            <div 
              key={index} 
              className={`mb-1 ${
                log.type === 'error' ? 'text-red-400' : 
                log.type === 'success' ? 'text-green-400' : 
                log.type === 'warning' ? 'text-yellow-400' : 
                'text-white'
              }`}
            >
              <span className="text-gray-400">[{log.timestamp}]</span> {log.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
