
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
        return <Check className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Bot className="w-5 h-5 text-lime-400" />;
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'success':
        return 'border-green-500/50 bg-green-900/20';
      case 'error':
        return 'border-red-500/50 bg-red-900/20';
      default:
        return 'border-lime-500/50 bg-lime-900/20';
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Title */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-lime-400 to-green-400 bg-clip-text text-transparent">
          TELEGRAM BOT CONFIGURATION
        </h1>
      </div>

      {/* Status Card */}
      <div className={`card shadow-2xl border-2 transition-all duration-300 ${getStatusColor()}`}>
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon()}
              <span className="text-lg font-semibold">
                Connection Status: {connectionStatus === 'idle' ? 'Not Tested' : connectionStatus === 'success' ? 'Connected' : 'Failed'}
              </span>
            </div>
            <button 
              className={`btn btn-sm ${isLoading ? 'loading' : ''} ${connectionStatus === 'success' ? 'btn-success' : 'btn-outline'}`}
              onClick={testTelegramConnection}
              disabled={isLoading || !botToken}
            >
              {isLoading ? 'Testing...' : 'Test Connection'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Bot Configuration */}
        <div className="card bg-base-200/80 shadow-xl border border-lime-500/20 backdrop-blur-sm">
          <div className="card-body">
            <div className="flex items-center space-x-3 mb-6">
              <Settings className="w-6 h-6 text-green-500" />
              <h2 className="card-title text-green-500">BOT SETTINGS</h2>
            </div>
            
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>BOT TOKEN</span>
                  </span>
                </label>
                <input
                  type="password"
                  value={botToken}
                  onChange={(e) => handleBotTokenChange(e.target.value)}
                  className="input input-bordered w-full bg-base-300/50 focus:border-lime-400 transition-colors"
                  placeholder="Enter Telegram Bot Token (from @BotFather)"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center space-x-2">
                    <Bot className="w-4 h-4" />
                    <span>BOT USERNAME</span>
                  </span>
                </label>
                <input
                  type="text"
                  value={botUsername}
                  onChange={(e) => handleBotUsernameChange(e.target.value)}
                  className="input input-bordered w-full bg-base-300/50 focus:border-lime-400 transition-colors"
                  placeholder="@your_bot_username"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center space-x-2">
                    <Globe className="w-4 h-4" />
                    <span>BOT DOMAIN</span>
                  </span>
                </label>
                <input
                  type="text"
                  value={botDomain}
                  onChange={(e) => handleBotDomainChange(e.target.value)}
                  className="input input-bordered w-full bg-base-300/50 focus:border-lime-400 transition-colors"
                  placeholder="your-domain.com"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center space-x-2">
                    <Webhook className="w-4 h-4" />
                    <span>BOT WEBAPP URL</span>
                  </span>
                </label>
                <input
                  type="url"
                  value={botWebappUrl}
                  onChange={(e) => handleBotWebappUrlChange(e.target.value)}
                  className="input input-bordered w-full bg-base-300/50 focus:border-lime-400 transition-colors"
                  placeholder="https://your-webapp-url.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Channel Configuration */}
        <div className="card bg-base-200/80 shadow-xl border border-lime-500/20 backdrop-blur-sm">
          <div className="card-body">
            <div className="flex items-center space-x-3 mb-6">
              <MessageCircle className="w-6 h-6 text-green-500" />
              <h2 className="card-title text-green-500">PRIVATE CHANNELS</h2>
            </div>
            
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">NEW ORDER CHANNEL</span>
                </label>
                <input
                  type="text"
                  value={privateChannelNewOrder}
                  onChange={(e) => handlePrivateChannelNewOrderChange(e.target.value)}
                  className="input input-bordered w-full bg-base-300/50 focus:border-lime-400 transition-colors"
                  placeholder="@new_orders_channel or -1001234567890"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">COMPLETED ORDERS CHANNEL</span>
                </label>
                <input
                  type="text"
                  value={privateChannelCompletedOrders}
                  onChange={(e) => handlePrivateChannelCompletedOrdersChange(e.target.value)}
                  className="input input-bordered w-full bg-base-300/50 focus:border-lime-400 transition-colors"
                  placeholder="@completed_orders_channel or -1001234567890"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">EXISTING USER CHANNEL</span>
                </label>
                <input
                  type="text"
                  value={privateChannelExistingUser}
                  onChange={(e) => handlePrivateChannelExistingUserChange(e.target.value)}
                  className="input input-bordered w-full bg-base-300/50 focus:border-lime-400 transition-colors"
                  placeholder="@existing_users_channel or -1001234567890"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center space-x-2">
                    <Globe className="w-4 h-4" />
                    <span>TELEGRAM API URL</span>
                  </span>
                </label>
                <input
                  type="url"
                  value={apiUrl}
                  onChange={(e) => handleApiUrlChange(e.target.value)}
                  className="input input-bordered w-full bg-base-300/50 focus:border-lime-400 transition-colors"
                  placeholder="https://api.telegram.org"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Test Snippet */}
      <div className="card bg-base-200/80 shadow-xl border border-lime-500/20 backdrop-blur-sm">
        <div className="card-body">
          <h3 className="card-title text-green-500 mb-4 flex items-center space-x-2">
            <Bot className="w-5 h-5" />
            <span>TELEGRAM API TEST SNIPPET</span>
          </h3>
          <div className="mockup-code bg-base-300/50 border border-lime-500/30">
            <pre data-prefix="$" className="text-lime-300">
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
