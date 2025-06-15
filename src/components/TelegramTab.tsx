import { useState, useEffect } from 'react';
import { useConsole } from '@/hooks/useConsole';
import { Bot, MessageCircle, Settings, Globe, Webhook, Shield, Check, AlertCircle } from 'lucide-react';

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
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
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

    window.addEventListener('testConnection', handleTestConnection as EventListener);
    return () => {
      window.removeEventListener('testConnection', handleTestConnection as EventListener);
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

  const testTelegramConnection = async () => {
    if (!botToken) {
      addLog('❌ Bot token is required for testing', 'error');
      setConnectionStatus('error');
      return;
    }

    setIsLoading(true);
    setConnectionStatus('idle');
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
        setConnectionStatus('success');
      } else {
        addLog(`❌ Telegram API error: ${data.description || 'Unknown error'}`, 'error');
        addLog(`🔢 Error code: ${data.error_code || 'N/A'}`, 'error');
        setConnectionStatus('error');
      }
    } catch (error) {
      console.error('Telegram connection error:', error);
      addLog(`💥 Connection error: ${error.message}`, 'error');
      addLog(`⚠️ Error type: ${error.name}`, 'error');
      setConnectionStatus('error');
      
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

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'success':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Bot className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className={`rounded-lg border p-4 ${getStatusColor()}`}>
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              Connection Status
            </h3>
            <p className="text-sm text-gray-600">
              {connectionStatus === 'idle' ? 'Not tested' : connectionStatus === 'success' ? 'Connected' : 'Failed'}
              {isLoading && ' - Testing...'}
            </p>
          </div>
        </div>
      </div>

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
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
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
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
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
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
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
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
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
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
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
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
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
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
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
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="https://api.telegram.org"
              />
            </div>
          </div>
        </div>
      </div>

      {/* API Test Snippet */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-green-600 mb-4 flex items-center space-x-2">
          <Bot className="w-5 h-5" />
          <span>Telegram API Test Snippet</span>
        </h3>
        <div className="bg-gray-900 rounded-md p-4 overflow-x-auto">
          <pre className="text-green-400 text-sm">
            <code>{`curl "${apiUrl}/bot${botToken || '{BOT_TOKEN}'}/getMe" \\
   -X GET \\
   -H "Content-Type: application/json"`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
