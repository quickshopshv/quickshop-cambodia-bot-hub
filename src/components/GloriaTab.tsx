
import { useState, useEffect } from 'react';
import { useConsole } from '@/hooks/useConsole';
import { supabase } from '@/lib/supabase';
import { Database } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const GloriaTab = () => {
  const [restaurantKey, setRestaurantKey] = useState('w9p03u55Nf5BZmGllx');
  const [isLoading, setIsLoading] = useState(false);
  const [showSnippet, setShowSnippet] = useState(false);
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

    // Listen for show snippet events from console
    const handleShowSnippet = (event: CustomEvent) => {
      if (event.detail.tab === 'gloria') {
        setShowSnippet(true);
      }
    };

    // Listen for fetch data events from console
    const handleFetchData = (event: CustomEvent) => {
      if (event.detail.tab === 'gloria') {
        fetchGloriaData();
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

  const handleRestaurantKeyChange = (value: string) => {
    setRestaurantKey(value);
    autoSave('RESTAURANT_KEY', value);
  };

  const fetchGloriaData = async () => {
    addLog('Fetching Gloria menu data...', 'info');
    
    try {
      const { data, error } = await supabase.functions.invoke('gloria-api', {
        body: { 
          restaurantKey,
          endpoint: 'menu'
        }
      });

      if (error) {
        addLog(`Fetch error: ${error.message}`, 'error');
        return;
      }

      if (data?.success) {
        addLog('Menu data fetched successfully!', 'success');
        if (data.data) {
          const preview = data.data.length > 500 ? `${data.data.substring(0, 500)}...` : data.data;
          addLog(`Menu XML preview: ${preview}`, 'info');
        }
      } else {
        addLog(`Fetch failed: ${data?.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      addLog(`Fetch error: ${error.message}`, 'error');
    }
  };

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

  return (
    <div className="space-y-6">
      <Tabs defaultValue="environment" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="environment">Environment Variables</TabsTrigger>
          <TabsTrigger value="menus">Menus</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="environment" className="space-y-6">
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
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                placeholder="Enter Gloria Restaurant Key"
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="menus" className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-green-600 mb-4">Menu Management</h2>
            <p className="text-gray-600">Menu management features will be implemented here.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-green-600 mb-4">Category Management</h2>
            <p className="text-gray-600">Category management features will be implemented here.</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Gloria API Test Snippet - Only show when snippet button is clicked */}
      {showSnippet && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-green-600 flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>Gloria Fetch Menu Snippet</span>
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
              <code>{`curl "https://pos.globalfoodsoft.com/pos/menu" \\
   -X GET \\
   -H "Authorization: ${restaurantKey}" \\
   -H "Accept: application/xml" \\
   -H "Glf-Api-Version: 2"`}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
