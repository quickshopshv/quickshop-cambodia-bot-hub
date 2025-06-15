
import { useState } from 'react';
import { useConsole } from '@/hooks/useConsole';

export const TelegramTab = () => {
  const [botToken, setBotToken] = useState('7729351267:AAGWVMKV-cDKgXgq7Mg4BUlgnY0gX9vdK0M');
  const [botUsername, setBotUsername] = useState('Quickshop_forever_bot');
  const [botDomain, setBotDomain] = useState(window.location.origin);
  const [botWebappUrl, setBotWebappUrl] = useState(window.location.origin);
  const [privateChannelNewOrder, setPrivateChannelNewOrder] = useState('2704263125');
  const [privateChannelCompletedOrders, setPrivateChannelCompletedOrders] = useState('2256094978');
  const [privateChannelExistingUser, setPrivateChannelExistingUser] = useState('');
  const { addLog } = useConsole();

  const saveTelegramVariables = () => {
    const telegramVars = {
      BOT_TOKEN: botToken,
      BOT_USERNAME: botUsername,
      BOT_DOMAIN: botDomain,
      BOT_WEBAPP_URL: botWebappUrl,
      PRIVATE_CHANNEL_NEW_ORDER: privateChannelNewOrder,
      PRIVATE_CHANNEL_COMPLETED_ORDERS: privateChannelCompletedOrders,
      PRIVATE_CHANNEL_EXISTING_USER: privateChannelExistingUser
    };

    Object.entries(telegramVars).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });

    addLog('Telegram variables saved to localStorage', 'success');
  };

  const testBotConnection = async () => {
    addLog('Testing Telegram Bot connection...', 'info');
    
    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
      const data = await response.json();
      
      if (data.ok) {
        addLog(`Bot connection successful! Bot: @${data.result.username}`, 'success');
      } else {
        addLog(`Bot connection failed: ${data.description}`, 'error');
      }
    } catch (error) {
      addLog(`Bot connection error: ${error}`, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-lime-400">TELEGRAM ENVIRONMENT VARIABLES</h2>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">BOT TOKEN</span>
              </label>
              <input
                type="text"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                className="input input-bordered"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">BOT USERNAME</span>
              </label>
              <input
                type="text"
                value={botUsername}
                onChange={(e) => setBotUsername(e.target.value)}
                className="input input-bordered"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">BOT DOMAIN</span>
              </label>
              <input
                type="text"
                value={botDomain}
                onChange={(e) => setBotDomain(e.target.value)}
                className="input input-bordered"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">BOT WEBAPP URL</span>
              </label>
              <input
                type="text"
                value={botWebappUrl}
                onChange={(e) => setBotWebappUrl(e.target.value)}
                className="input input-bordered"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">PRIVATE CHANNEL NEW ORDER</span>
              </label>
              <input
                type="text"
                value={privateChannelNewOrder}
                onChange={(e) => setPrivateChannelNewOrder(e.target.value)}
                className="input input-bordered"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">PRIVATE CHANNEL COMPLETED ORDERS</span>
              </label>
              <input
                type="text"
                value={privateChannelCompletedOrders}
                onChange={(e) => setPrivateChannelCompletedOrders(e.target.value)}
                className="input input-bordered"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">PRIVATE CHANNEL EXISTING USER</span>
              </label>
              <input
                type="text"
                value={privateChannelExistingUser}
                onChange={(e) => setPrivateChannelExistingUser(e.target.value)}
                className="input input-bordered"
              />
            </div>
          </div>

          <div className="card-actions justify-end space-x-2">
            <button 
              className="btn btn-primary bg-lime-600 border-lime-600 hover:bg-lime-700"
              onClick={saveTelegramVariables}
            >
              SAVE
            </button>
            <button 
              className="btn btn-secondary"
              onClick={testBotConnection}
            >
              TEST BOT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
