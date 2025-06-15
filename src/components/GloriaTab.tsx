
import { useState } from 'react';
import { useConsole } from '@/hooks/useConsole';
import { supabase } from '@/lib/supabase';

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
        console.error('Edge function error:', error);
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
          console.error('Error details:', data.details);
        }
      }
    } catch (error) {
      console.error('Catch block error:', error);
      addLog(`Connection error: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const saveGloriaVariables = () => {
    localStorage.setItem('RESTAURANT_KEY', restaurantKey);
    addLog('Gloria variables saved to localStorage', 'success');
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
