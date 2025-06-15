
import { useState, useEffect } from 'react';
import { useConsole } from '@/hooks/useConsole';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play } from 'lucide-react';

interface Category {
  name: string;
  enabled: boolean;
}

export const GloriaTab = () => {
  const [restaurantKey, setRestaurantKey] = useState('w9p03u55Nf5BZmGllx');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addLog } = useConsole();

  useEffect(() => {
    // Load saved restaurant key on component mount
    const savedRestaurantKey = localStorage.getItem('RESTAURANT_KEY') || 'w9p03u55Nf5BZmGllx';
    setRestaurantKey(savedRestaurantKey);

    // Listen for fetch data events from console
    const handleFetchData = (event: CustomEvent) => {
      if (event.detail.tab === 'gloria') {
        fetchGloriaMenuData();
      }
    };

    window.addEventListener('fetchData', handleFetchData as EventListener);
    
    return () => {
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

  const fetchGloriaMenuData = async () => {
    setIsLoading(true);
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

      if (data?.success && data.data) {
        addLog('Menu data fetched successfully!', 'success');
        
        // Log the first 1000 characters of the XML to see its structure
        addLog(`XML Preview: ${data.data.substring(0, 1000)}...`, 'info');
        
        // Parse XML to extract categories
        try {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data.data, "text/xml");
          
          // Check if there are any parsing errors
          const parseError = xmlDoc.querySelector('parsererror');
          if (parseError) {
            addLog(`XML Parse Error: ${parseError.textContent}`, 'error');
            return;
          }
          
          // Find category elements
          const categoryElements = xmlDoc.getElementsByTagName('category');
          addLog(`Found ${categoryElements.length} category elements`, 'info');
          
          const extractedCategories: Category[] = [];
          for (let i = 0; i < categoryElements.length; i++) {
            const categoryElement = categoryElements[i];
            const nameElement = categoryElement.getElementsByTagName('name')[0];
            
            if (nameElement && nameElement.textContent) {
              const categoryName = nameElement.textContent.trim();
              if (categoryName) {
                extractedCategories.push({
                  name: categoryName,
                  enabled: true // Default to enabled
                });
                addLog(`Found category: ${categoryName}`, 'info');
              }
            }
          }
          
          // Sort categories alphabetically
          extractedCategories.sort((a, b) => a.name.localeCompare(b.name));
          setCategories(extractedCategories);
          
          addLog(`Successfully extracted ${extractedCategories.length} categories`, 'success');
          
        } catch (parseError) {
          addLog(`Failed to parse XML: ${parseError.message}`, 'error');
        }
      } else {
        addLog(`Fetch failed: ${data?.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      addLog(`Fetch error: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const executeSnippet = async () => {
    addLog('Executing Gloria fetch snippet...', 'info');
    await fetchGloriaMenuData();
  };

  const toggleCategory = (index: number) => {
    setCategories(prev => prev.map((cat, i) => 
      i === index ? { ...cat, enabled: !cat.enabled } : cat
    ));
  };

  return (
    <div className="space-y-6">
      {/* GloriaFood Fetch Menu Snippet */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-green-600">
            GloriaFood Fetch Menu Snippet
          </h3>
          <Button 
            onClick={executeSnippet}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>{isLoading ? 'Executing...' : 'Execute'}</span>
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="restaurant-key" className="block text-sm font-medium text-gray-700 mb-1">
              Restaurant Key
            </Label>
            <Input
              id="restaurant-key"
              type="text"
              value={restaurantKey}
              onChange={(e) => handleRestaurantKeyChange(e.target.value)}
              placeholder="Enter Gloria Restaurant Key"
            />
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
      </div>

      {/* Categories Tree */}
      {categories.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-green-600 mb-4">Menu Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant={category.enabled ? "default" : "outline"}
                onClick={() => toggleCategory(index)}
                className={`justify-start ${
                  category.enabled 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <span className="font-medium">Enabled:</span> {categories.filter(c => c.enabled).length} | 
            <span className="font-medium ml-2">Disabled:</span> {categories.filter(c => !c.enabled).length}
          </div>
        </div>
      )}
    </div>
  );
};
