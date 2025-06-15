
import { useState, useEffect } from 'react';
import { useConsole } from '@/hooks/useConsole';
import { supabase } from '@/lib/supabase';
import { Database, Check, AlertCircle } from 'lucide-react';

export const GloriaTab = () => {
  const [restaurantKey, setRestaurantKey] = useState('w9p03u55Nf5BZmGllx');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { addLog } = useConsole();

  useEffect(() => {
    // Load saved restaurant key on component mount
    const savedRestaurantKey = localStorage.getItem('RESTAURANT_KEY') || 'w9p03u55Nf5BZmGllx';
    setRestaurantKey(savedRestaurantKey);

    // Listen for test connection events from console
    const handleTestConnection = (event: CustomEvent) => {
      if (event.detail.tab === 'gloria') {
        testGloriaConnection();
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

  const handleRestaurantKeyChange = (value: string) => {
    setRestaurantKey(value);
    autoSave('RESTAURANT_KEY', value);
  };

  const testGloriaConnection = async () => {
    setIsLoading(true);
    setConnectionStatus('idle');
    addLog('Testing Gloria connection via Edge Function...', 'info');
    
    try {
      console.log('Calling edge function with restaurant key:', restaurantKey);
      
      const { data, error } = await supabase.functions.invoke('gloria-api', {
        body: { 
          restaurantKey,
          endpoint: 'menu'
        }
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        addLog(`Edge Function error: ${error.message}`, 'error');
        addLog(`Error details: ${JSON.stringify(error)}`, 'error');
        console.error('Edge function error details:', error);
        setConnectionStatus('error');
        
        // Additional error details for debugging
        if (error.context) {
          addLog(`Error context: ${JSON.stringify(error.context)}`, 'error');
        }
        if (error.details) {
          addLog(`Error details: ${JSON.stringify(error.details)}`, 'error');
        }
        return;
      }

      if (data?.success) {
        addLog('Gloria connection successful!', 'success');
        addLog(`Response status: ${data.status}`, 'info');
        if (data.data) {
          const preview = data.data.length > 200 ? `${data.data.substring(0, 200)}...` : data.data;
          addLog(`XML data preview: ${preview}`, 'info');
        }
        setConnectionStatus('success');
      } else {
        addLog(`Gloria API error: ${data?.error || 'Unknown error'}`, 'error');
        if (data?.data) {
          addLog(`Response data: ${data.data}`, 'warning');
        }
        if (data?.details) {
          addLog(`Error details: ${JSON.stringify(data.details)}`, 'error');
          console.error('Error details:', data.details);
        }
        setConnectionStatus('error');
      }
    } catch (error) {
      console.error('Catch block error:', error);
      addLog(`Connection error: ${error.message}`, 'error');
      setConnectionStatus('error');
      
      // Enhanced error logging for debugging
      addLog(`Error type: ${error.name}`, 'error');
      if (error.stack) {
        addLog(`Error stack: ${error.stack}`, 'error');
      }
      if (error.cause) {
        addLog(`Error cause: ${JSON.stringify(error.cause)}`, 'error');
      }
      
      // Check for specific network errors
      if (error.message.includes('Failed to fetch')) {
        addLog('Network error detected. Check your internet connection and Supabase project status.', 'warning');
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
        return <Database className="w-4 h-4 text-gray-400" />;
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

      {/* Environment Variables */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <span className="font-bold text-green-600">GloriaFood</span>
          <h2 className="text-lg font-semibold text-green-600">Environment Variables</h2>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Restaurant Key
          </label>
          <input
            type="text"
            value={restaurantKey}
            onChange={(e) => handleRestaurantKeyChange(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
            placeholder="Enter Gloria Restaurant Key"
          />
        </div>
      </div>

      {/* Gloria API Test Snippet */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-green-600 mb-4 flex items-center space-x-2">
          <Database className="w-5 h-5" />
          <span>Gloria Fetch Menu Snippet</span>
        </h3>
        <div className="bg-gray-900 rounded-md p-4 overflow-x-auto">
          <pre className="text-green-400 text-sm">
            <code>{`curl "https://pos.globalfoodsoft.com/pos/menu" \\
   -X GET \\
   -H "Authorization: ${restaurantKey}" \\
   -H "Accept: application/xml" \\
   -H "Glf-Api-Version: 2"`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
