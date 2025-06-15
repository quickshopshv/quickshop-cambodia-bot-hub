import { useState, useEffect } from 'react';
import { useConsole } from '@/hooks/useConsole';
import { Bot, MessageCircle, Settings, Globe, Webhook, Shield } from 'lucide-react';

export const TelegramTab = () => {
  const [botToken, setBotToken] = useState('');
  const [botUsername, setBotUsername] = useState('');
  const [botDomain, setBotDomain] = useState('');
  const [botWebappUrl, setBotWebappUrl] = useState('');
  const [privateChannelNewOrder, setPrivateChannelNewOrder] = useState('');
  const [privateChannelCompletedOrders, setPrivateChannelCompletedOrders] = useState('');
  const [privateChannelExistingUser, setPrivateChannelExistingUser] = useState('');
  const [apiUrl, setApiUrl] = useState('https://api.telegram.org');
  const [isLoading, setIsLoading] = useState(false);
  const [showSnippet, setShowSnippet] = useState(false);
  const { addLog } = useConsole();

  // Load saved values on component mount
  useEffect(() => {
    const savedBotToken = localStorage.getItem('BOT_TOKEN') || '';
    const savedBotUsername = localStorage.getItem('BOT_USERNAME') || '';
    const savedBotDomain = localStorage.getItem('BOT_DOMAIN') || '';
    const savedBotWebappUrl = localStorage.getItem('BOT_WEBAPP_URL') || '';
    const savedPrivateChannelNewOrder = localStorage.getItem('PRIVATE_CHANNEL_NEW_ORDER') || '';
    const savedPrivateChannelCompletedOrders = localStorage.getItem('PRIVATE_CHANNEL_COMPLETED_ORDERS') || '';
    const savedPrivateChannelExistingUser = localStorage.getItem('PRIVATE_CHANNEL_EXISTING_USER') || '';
    const savedApiUrl = localStorage.getItem('TELEGRAM_API_URL') || 'https://api.telegram.org';
    
    setBotToken(savedBotToken);
    setBotUsername(savedBotUsername);
    setBotDomain(savedBotDomain);
    setBotWebappUrl(savedBotWebappUrl);
    setPrivateChannelNewOrder(savedPrivateChannelNewOrder);
    setPrivateChannelCompletedOrders(savedPrivateChannelCompletedOrders);
    setPrivateChannelExistingUser(savedPrivateChannelExistingUser);
    setApiUrl(savedApiUrl);

    // Listen for test connection events from console
    const handleTestConnection = (event: CustomEvent) => {
      if (event.detail.tab === 'telegram') {
        testTelegramConnection();
      }
    };

    // Listen for show snippet events from console
    const handleShowSnippet = (event: CustomEvent) => {
      if (event.detail.tab === 'telegram') {
        setShowSnippet(true);
      }
    };

    // Listen for fetch data events from console
    const handleFetchData = (event: CustomEvent) => {
      if (event.detail.tab === 'telegram') {
        fetchTelegramData();
      }
    };

    window.addEventListener('testConnection', handleTestConnection as EventListener);
    window.addEventListener('showSnippet', handleShowSnippet as EventListener);
    window.addEventListener('fetchData', handleFetchData as EventListener);
    
    return () => {
      window.removeEventListener('testConnection', handleTestConnection as EventListener);
      window.removeEventListener('showSnippet', handleShowSnippet as EventListener);
      window.removeEventListener('fetchData', handleFetchData as EventListener);
    };
  }, []);

  const autoSave = (key: string, value: string) => {
    localStorage.setItem(key, value);
    addLog(`💾 Auto-saved ${key}`, 'info');
  };

  const handleBotTokenChange = (value: string) => {
    setBotToken(value);
    autoSave('BOT_TOKEN', value);
  };

  const handleBotUsernameChange = (value: string) => {
    setBotUsername(value);
    autoSave('BOT_USERNAME', value);
  };

  const handleBotDomainChange = (value: string) => {
    setBotDomain(value);
    autoSave('BOT_DOMAIN', value);
  };

  const handleBotWebappUrlChange = (value: string) => {
    setBotWebappUrl(value);
    autoSave('BOT_WEBAPP_URL', value);
  };

  const handlePrivateChannelNewOrderChange = (value: string) => {
    setPrivateChannelNewOrder(value);
    autoSave('PRIVATE_CHANNEL_NEW_ORDER', value);
  };

  const handlePrivateChannelCompletedOrdersChange = (value: string) => {
    setPrivateChannelCompletedOrders(value);
    autoSave('PRIVATE_CHANNEL_COMPLETED_ORDERS', value);
  };

  const handlePrivateChannelExistingUserChange = (value: string) => {
    setPrivateChannelExistingUser(value);
    autoSave('PRIVATE_CHANNEL_EXISTING_USER', value);
  };

  const handleApiUrlChange = (value: string) => {
    setApiUrl(value);
    autoSave('TELEGRAM_API_URL', value);
  };

  const fetchTelegramData = async () => {
    if (!botToken) {
      addLog('❌ Bot token is required for fetching data', 'error');
      return;
    }

    addLog('🔄 Fetching Telegram bot data...', 'info');
    
    try {
      const getMeUrl = `${apiUrl}/bot${botToken}/getMe`;
      const response = await fetch(getMeUrl);
      const data = await response.json();

      if (response.ok && data.ok) {
        addLog('✅ Bot data fetched successfully!', 'success');
        addLog(`🤖 Bot: ${data.result.first_name} (@${data.result.username})`, 'info');
        addLog(`🆔 Bot ID: ${data.result.id}`, 'info');
      } else {
        addLog(`❌ Failed to fetch bot data: ${data.description}`, 'error');
      }
    } catch (error) {
      addLog(`💥 Fetch error: ${error.message}`, 'error');
    }
  };

  const testTelegramConnection = async () => {
    if (!botToken) {
      addLog('❌ Bot token is required for testing', 'error');
      return;
    }

    setIsLoading(true);
    addLog('🔄 Testing Telegram Bot API connection...', 'info');
    
    try {
      const testUrl = `${apiUrl}/bot${botToken}/getMe`;
      addLog(`📡 Making request to: ${testUrl}`, 'info');
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      addLog(`📊 Response status: ${response.status} ${response.statusText}`, 'info');
      addLog(`📋 Response headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`, 'info');

      const data = await response.json();
      addLog(`📄 Response body: ${JSON.stringify(data, null, 2)}`, 'info');

      if (response.ok && data.ok) {
        addLog('✅ Telegram Bot API connection successful!', 'success');
        addLog(`🤖 Bot info: ${data.result.first_name} (@${data.result.username})`, 'success');
        addLog(`🆔 Bot ID: ${data.result.id}`, 'info');
        addLog(`👥 Can join groups: ${data.result.can_join_groups}`, 'info');
        addLog(`📨 Can read all group messages: ${data.result.can_read_all_group_messages}`, 'info');
        addLog(`🔍 Supports inline queries: ${data.result.supports_inline_queries}`, 'info');
      } else {
        addLog(`❌ Telegram API error: ${data.description || 'Unknown error'}`, 'error');
        addLog(`🔢 Error code: ${data.error_code || 'N/A'}`, 'error');
      }
    } catch (error) {
      console.error('Telegram connection error:', error);
      addLog(`💥 Connection error: ${error.message}`, 'error');
      addLog(`⚠️ Error type: ${error.name}`, 'error');
      
      if (error.message.includes('Failed to fetch')) {
        addLog('🌐 Network error detected. Check your internet connection and bot token.', 'warning');
      }
      if (error.message.includes('CORS')) {
        addLog('🔒 CORS error detected. This is expected in browser - use Edge Function for production.', 'warning');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bot Configuration */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Settings className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-green-600">Bot Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Bot Token</span>
                </div>
              </label>
              <input
                type="password"
                value={botToken}
                onChange={(e) => handleBotTokenChange(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                placeholder="Enter Telegram Bot Token (from @BotFather)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4" />
                  <span>Bot Username</span>
                </div>
              </label>
              <input
                type="text"
                value={botUsername}
                onChange={(e) => handleBotUsernameChange(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                placeholder="@your_bot_username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>Bot Domain</span>
                </div>
              </label>
              <input
                type="text"
                value={botDomain}
                onChange={(e) => handleBotDomainChange(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                placeholder="your-domain.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center space-x-2">
                  <Webhook className="w-4 h-4" />
                  <span>Bot Webapp URL</span>
                </div>
              </label>
              <input
                type="url"
                value={botWebappUrl}
                onChange={(e) => handleBotWebappUrlChange(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                placeholder="https://your-webapp-url.com"
              />
            </div>
          </div>
        </div>

        {/* Channel Configuration */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <MessageCircle className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-green-600">Private Channels</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Order Channel
              </label>
              <input
                type="text"
                value={privateChannelNewOrder}
                onChange={(e) => handlePrivateChannelNewOrderChange(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                placeholder="@new_orders_channel or -1001234567890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Completed Orders Channel
              </label>
              <input
                type="text"
                value={privateChannelCompletedOrders}
                onChange={(e) => handlePrivateChannelCompletedOrdersChange(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                placeholder="@completed_orders_channel or -1001234567890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Existing User Channel
              </label>
              <input
                type="text"
                value={privateChannelExistingUser}
                onChange={(e) => handlePrivateChannelExistingUserChange(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                placeholder="@existing_users_channel or -1001234567890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>Telegram API URL</span>
                </div>
              </label>
              <input
                type="url"
                value={apiUrl}
                onChange={(e) => handleApiUrlChange(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                placeholder="https://api.telegram.org"
              />
            </div>
          </div>
        </div>
      </div>

      {/* API Test Snippet - Only show when snippet button is clicked */}
      {showSnippet && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-green-600 flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <span>Telegram API Test Snippet</span>
            </h3>
            <button 
              onClick={() => setShowSnippet(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="bg-gray-900 rounded-md p-4 overflow-x-auto">
            <pre className="text-green-400 text-sm">
              <code>{`curl "${apiUrl}/bot${botToken || '{BOT_TOKEN}'}/getMe" \\
   -X GET \\
   -H "Content-Type: application/json"`}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
