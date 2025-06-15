
import { useState } from 'react';
import { useConsole } from '@/hooks/useConsole';
import { supabase } from '@/lib/supabase';
import { ExternalLink } from 'lucide-react';

export const GloriaTab = () => {
  const [restaurantKey, setRestaurantKey] = useState('w9p03u55Nf5BZmGllx');
  const [isLoading, setIsLoading] = useState(false);
  const { addLog } = useConsole();

  const testGloriaConnection = async () => {
    setIsLoading(true);
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
      } else {
        addLog(`Gloria API error: ${data?.error || 'Unknown error'}`, 'error');
        if (data?.data) {
          addLog(`Response data: ${data.data}`, 'warning');
        }
        if (data?.details) {
          addLog(`Error details: ${JSON.stringify(data.details)}`, 'error');
          console.error('Error details:', data.details);
        }
      }
    } catch (error) {
      console.error('Catch block error:', error);
      addLog(`Connection error: ${error.message}`, 'error');
      
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

  const saveGloriaVariables = () => {
    localStorage.setItem('RESTAURANT_KEY', restaurantKey);
    addLog('Gloria variables saved to localStorage', 'success');
  };

  const openEdgeFunctionLogs = () => {
    const logsUrl = 'https://supabase.com/dashboard/project/fxhtcdyxmtfyvanqhaty/functions/gloria-api/logs';
    window.open(logsUrl, '_blank');
    addLog('Opening Edge Function logs in new tab...', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-lime-400">GLORIA ENVIRONMENT VARIABLES</h2>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">RESTAURANT KEY</span>
            </label>
            <input
              type="text"
              value={restaurantKey}
              onChange={(e) => setRestaurantKey(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Enter Gloria Restaurant Key"
            />
          </div>

          <div className="card-actions justify-end space-x-2">
            <button 
              className="btn btn-primary bg-lime-600 border-lime-600 hover:bg-lime-700"
              onClick={saveGloriaVariables}
            >
              SAVE
            </button>
            <button 
              className={`btn btn-secondary ${isLoading ? 'loading' : ''}`}
              onClick={testGloriaConnection}
              disabled={isLoading}
            >
              TEST CONNECTION
            </button>
          </div>
        </div>
      </div>

      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h3 className="card-title text-lime-400">DEBUGGING & LOGS</h3>
            <button 
              className="btn btn-outline btn-sm"
              onClick={openEdgeFunctionLogs}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              VIEW EDGE FUNCTION LOGS
            </button>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Click the button above to view detailed Edge Function logs in Supabase dashboard for debugging connection issues.
          </p>
        </div>
      </div>

      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h3 className="card-title text-lime-400">GLORIA FETCH MENU SNIPPET</h3>
          <div className="mockup-code">
            <pre data-prefix="$">
              <code>{`curl "https://pos.globalfoodsoft.com/pos/menu" \\
   -X GET \\
   -H "Authorization: ${restaurantKey}" \\
   -H "Accept: application/xml" \\
   -H "Glf-Api-Version: 2"`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
