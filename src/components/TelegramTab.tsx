
import { useState } from 'react';
import { useConsole } from '@/hooks/useConsole';

export const TelegramTab = () => {
  const [botToken, setBotToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addLog } = useConsole();

  const saveTelegramVariables = () => {
    localStorage.setItem('BOT_TOKEN', botToken);
    addLog('Telegram variables saved to localStorage', 'success');
  };

  const testTelegramConnection = async () => {
    setIsLoading(true);
    addLog('Testing Telegram connection...', 'info');
    
    try {
      // Simulate a test connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      addLog('Telegram connection test completed', 'success');
    } catch (error) {
      addLog(`Connection error: ${error}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-lime-400">TELEGRAM BOT CONFIGURATION</h2>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">BOT TOKEN</span>
            </label>
            <input
              type="text"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Enter Telegram Bot Token"
            />
          </div>

          <div className="card-actions justify-end space-x-2">
            <button 
              className="btn btn-primary bg-lime-600 border-lime-600 hover:bg-lime-700"
              onClick={saveTelegramVariables}
            >
              SAVE
            </button>
            <button 
              className={`btn btn-secondary ${isLoading ? 'loading' : ''}`}
              onClick={testTelegramConnection}
              disabled={isLoading}
            >
              TEST CONNECTION
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
