
import { useState, useEffect } from 'react';
import { useConsole } from '@/hooks/useConsole';
import { ExternalLink } from 'lucide-react';

export const TelegramTab = () => {
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [apiUrl, setApiUrl] = useState('https://api.telegram.org');
  const [isLoading, setIsLoading] = useState(false);
  const { addLog } = useConsole();

  // Load saved values on component mount
  useEffect(() => {
    const savedBotToken = localStorage.getItem('BOT_TOKEN') || '';
    const savedChatId = localStorage.getItem('CHAT_ID') || '';
    const savedWebhookUrl = localStorage.getItem('WEBHOOK_URL') || '';
    const savedApiUrl = localStorage.getItem('TELEGRAM_API_URL') || 'https://api.telegram.org';
    
    setBotToken(savedBotToken);
    setChatId(savedChatId);
    setWebhookUrl(savedWebhookUrl);
    setApiUrl(savedApiUrl);
  }, []);

  const saveTelegramVariables = () => {
    localStorage.setItem('BOT_TOKEN', botToken);
    localStorage.setItem('CHAT_ID', chatId);
    localStorage.setItem('WEBHOOK_URL', webhookUrl);
    localStorage.setItem('TELEGRAM_API_URL', apiUrl);
    addLog('Telegram variables saved to localStorage', 'success');
  };

  const testTelegramConnection = async () => {
    if (!botToken) {
      addLog('Bot token is required for testing', 'error');
      return;
    }

    setIsLoading(true);
    addLog('Testing Telegram Bot API connection...', 'info');
    
    try {
      const testUrl = `${apiUrl}/bot${botToken}/getMe`;
      addLog(`Making request to: ${testUrl}`, 'info');
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      addLog(`Response status: ${response.status} ${response.statusText}`, 'info');
      addLog(`Response headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`, 'info');

      const data = await response.json();
      addLog(`Response body: ${JSON.stringify(data, null, 2)}`, 'info');

      if (response.ok && data.ok) {
        addLog('Telegram Bot API connection successful!', 'success');
        addLog(`Bot info: ${data.result.first_name} (@${data.result.username})`, 'success');
        addLog(`Bot ID: ${data.result.id}`, 'info');
        addLog(`Can join groups: ${data.result.can_join_groups}`, 'info');
        addLog(`Can read all group messages: ${data.result.can_read_all_group_messages}`, 'info');
        addLog(`Supports inline queries: ${data.result.supports_inline_queries}`, 'info');
      } else {
        addLog(`Telegram API error: ${data.description || 'Unknown error'}`, 'error');
        addLog(`Error code: ${data.error_code || 'N/A'}`, 'error');
      }
    } catch (error) {
      console.error('Telegram connection error:', error);
      addLog(`Connection error: ${error.message}`, 'error');
      addLog(`Error type: ${error.name}`, 'error');
      
      if (error.message.includes('Failed to fetch')) {
        addLog('Network error detected. Check your internet connection and bot token.', 'warning');
      }
      if (error.message.includes('CORS')) {
        addLog('CORS error detected. This is expected in browser - use Edge Function for production.', 'warning');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const openTelegramBotDocs = () => {
    window.open('https://core.telegram.org/bots/api', '_blank');
    addLog('Opening Telegram Bot API documentation...', 'info');
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
              placeholder="Enter Telegram Bot Token (from @BotFather)"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">CHAT ID</span>
            </label>
            <input
              type="text"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Enter Chat ID or Channel Username"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">WEBHOOK URL</span>
            </label>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Enter Webhook URL (optional)"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">TELEGRAM API URL</span>
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Telegram API URL"
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
              disabled={isLoading || !botToken}
            >
              TEST CONNECTION
            </button>
          </div>
        </div>
      </div>

      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h3 className="card-title text-lime-400">DEBUGGING & DOCUMENTATION</h3>
            <button 
              className="btn btn-outline btn-sm"
              onClick={openTelegramBotDocs}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              TELEGRAM BOT API DOCS
            </button>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Click the button above to view the official Telegram Bot API documentation.
          </p>
        </div>
      </div>

      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h3 className="card-title text-lime-400">TELEGRAM API TEST SNIPPET</h3>
          <div className="mockup-code">
            <pre data-prefix="$">
              <code>{`curl "${apiUrl}/bot${botToken || '{BOT_TOKEN}'}/getMe" \\
   -X GET \\
   -H "Content-Type: application/json"`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
