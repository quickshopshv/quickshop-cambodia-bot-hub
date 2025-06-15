
import { useConsole } from '@/hooks/useConsole';
import { Bot, Database, ExternalLink, TestTube, Code, Download } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ConsoleProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Console = ({
  activeTab,
  setActiveTab
}: ConsoleProps) => {
  const {
    logs,
    clearLogs,
    addLog
  } = useConsole();

  const fetchEdgeFunctionLogs = async () => {
    addLog('Fetching Edge Function logs...', 'info');
    
    try {
      // Since we can't directly access Supabase's edge function logs via API,
      // we'll simulate fetching logs or show a message about manual access
      addLog('Edge Function logs are available in the Supabase Dashboard', 'info');
      addLog('URL: https://supabase.com/dashboard/project/fxhtcdyxmtfyvanqhaty/functions/gloria-api/logs', 'info');
      addLog('Note: Direct log fetching requires CLI access or dashboard viewing', 'warning');
      
      // If we had actual logs, they would be displayed here
      // For demonstration, showing sample log format:
      addLog('Sample log format: [timestamp] [level] message', 'info');
      addLog('[2024-01-15 10:30:45] INFO Function invoked successfully', 'success');
      addLog('[2024-01-15 10:30:46] ERROR Connection timeout to external API', 'error');
      
    } catch (error) {
      addLog(`Failed to fetch edge function logs: ${error.message}`, 'error');
    }
  };

  const handleTestConnection = () => {
    // Dispatch a custom event that the active tab can listen to
    const event = new CustomEvent('testConnection', { detail: { tab: activeTab } });
    window.dispatchEvent(event);
  };

  const handleShowSnippet = () => {
    // Only show snippet for telegram tab now
    if (activeTab === 'telegram') {
      const event = new CustomEvent('showSnippet', { detail: { tab: activeTab } });
      window.dispatchEvent(event);
      addLog(`Displaying ${activeTab} snippet cards...`, 'info');
    } else {
      addLog('Snippet button is only available for Telegram tab', 'warning');
    }
  };

  const handleFetchData = () => {
    // Only fetch data for gloria tab now
    if (activeTab === 'gloria') {
      const event = new CustomEvent('fetchData', { detail: { tab: activeTab } });
      window.dispatchEvent(event);
      addLog('Fetching GloriaFood menu data...', 'info');
    } else {
      addLog('Fetch button is only available for GloriaFood tab', 'warning');
    }
  };

  return (
    <div className="h-1/3 bg-gray-900 border-t border-gray-300">
      <div className="flex justify-between items-center p-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <h3 className="text-green-400 font-semibold text-sm">CONSOLE</h3>
          <div className="flex space-x-2">
            <button onClick={() => setActiveTab('gloria')} className={`flex items-center space-x-2 px-3 py-1 rounded text-xs font-medium transition-colors ${activeTab === 'gloria' ? 'bg-white text-gray-900' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
              <span className="font-bold">GloriaFood</span>
            </button>
            <button onClick={() => setActiveTab('telegram')} className={`flex items-center space-x-1 px-3 py-1 rounded text-xs font-medium transition-colors ${activeTab === 'telegram' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
              <Bot className="w-3 h-3" />
              <span>TELEGRAM</span>
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleShowSnippet}
            className="flex items-center space-x-1 px-3 py-1 text-white text-xs font-medium rounded transition-colors bg-purple-500 hover:bg-purple-600"
            disabled={activeTab !== 'telegram'}
          >
            <Code className="w-3 h-3" />
            <span>SNIPPET</span>
          </button>
          <button 
            onClick={handleFetchData}
            className="flex items-center space-x-1 px-3 py-1 text-white text-xs font-medium rounded transition-colors bg-indigo-500 hover:bg-indigo-600"
            disabled={activeTab !== 'gloria'}
          >
            <Download className="w-3 h-3" />
            <span>FETCH</span>
          </button>
          <button 
            onClick={handleTestConnection}
            className="flex items-center space-x-1 px-3 py-1 text-white text-xs font-medium rounded transition-colors bg-blue-500 hover:bg-blue-600"
          >
            <TestTube className="w-3 h-3" />
            <span>TEST</span>
          </button>
          <button 
            onClick={fetchEdgeFunctionLogs}
            className="flex items-center space-x-1 px-3 py-1 text-white text-xs font-medium rounded transition-colors bg-green-500 hover:bg-green-600"
          >
            <Database className="w-3 h-3" />
            <span>EDGE LOGS</span>
          </button>
          <button onClick={clearLogs} className="px-3 py-1 text-white text-xs font-medium rounded transition-colors bg-amber-500 hover:bg-amber-400">
            CLEAR
          </button>
        </div>
      </div>
      <div className="h-full p-4 overflow-y-auto font-mono text-sm">
        {logs.length === 0 ? <div className="text-gray-500">Console ready...</div> : logs.map((log, index) => <div key={index} className={`mb-1 ${log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-green-400' : log.type === 'warning' ? 'text-yellow-400' : 'text-white'}`}>
              <span className="text-gray-400">[{log.timestamp}]</span> {log.message}
            </div>)}
      </div>
    </div>
  );
};
