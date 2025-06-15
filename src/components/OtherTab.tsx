
import { useConsole } from '@/hooks/useConsole';

export const OtherTab = () => {
  const { addLog, clearLogs } = useConsole();

  const showSystemInfo = () => {
    addLog('=== SYSTEM INFORMATION ===', 'info');
    addLog(`User Agent: ${navigator.userAgent}`, 'info');
    addLog(`Platform: ${navigator.platform}`, 'info');
    addLog(`Language: ${navigator.language}`, 'info');
    addLog(`Online: ${navigator.onLine}`, 'info');
    addLog(`URL: ${window.location.href}`, 'info');
    addLog('=== END SYSTEM INFO ===', 'info');
  };

  const testLocalStorage = () => {
    try {
      const testKey = 'test_storage';
      const testValue = 'test_value_' + Date.now();
      
      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      if (retrieved === testValue) {
        addLog('Local Storage: Working correctly', 'success');
      } else {
        addLog('Local Storage: Failed to retrieve data', 'error');
      }
    } catch (error) {
      addLog(`Local Storage Error: ${error}`, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-lime-400">SYSTEM UTILITIES</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              className="btn btn-outline btn-info"
              onClick={showSystemInfo}
            >
              SHOW SYSTEM INFO
            </button>
            
            <button 
              className="btn btn-outline btn-warning"
              onClick={testLocalStorage}
            >
              TEST LOCAL STORAGE
            </button>
            
            <button 
              className="btn btn-outline btn-error"
              onClick={clearLogs}
            >
              CLEAR CONSOLE
            </button>
            
            <button 
              className="btn btn-outline btn-success"
              onClick={() => addLog('Manual test message', 'success')}
            >
              TEST CONSOLE
            </button>
          </div>
        </div>
      </div>

      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h3 className="card-title text-lime-400">PROJECT INFORMATION</h3>
          <div className="space-y-2">
            <p><strong>Project:</strong> QuickShop Cambodia Bot Hub</p>
            <p><strong>Framework:</strong> React + Vite + TypeScript</p>
            <p><strong>UI:</strong> DaisyUI + Tailwind CSS</p>
            <p><strong>Backend:</strong> Supabase</p>
            <p><strong>Purpose:</strong> Telegram Bot Management System</p>
          </div>
        </div>
      </div>
    </div>
  );
};
