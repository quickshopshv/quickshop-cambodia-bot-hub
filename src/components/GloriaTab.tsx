
import { useState, useEffect } from 'react';
import { useConsole } from '@/hooks/useConsole';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Play } from 'lucide-react';

interface Category {
  name: string;
  enabled: boolean;
}

interface Group {
  name: string;
  enabled: boolean;
}

interface Option {
  name: string;
  enabled: boolean;
}

export const GloriaTab = () => {
  const [restaurantKey, setRestaurantKey] = useState('w9p03u55Nf5BZmGllx');
  const [categories, setCategories] = useState<Category[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCategories, setShowCategories] = useState(true);
  const [showGroups, setShowGroups] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
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
        
        // Parse XML to extract categories, groups, and options
        try {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data.data, "text/xml");
          
          // Check if there are any parsing errors
          const parseError = xmlDoc.querySelector('parsererror');
          if (parseError) {
            addLog(`XML Parse Error: ${parseError.textContent}`, 'error');
            return;
          }
          
          // Extract categories
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
                  enabled: true
                });
                addLog(`Found category: ${categoryName}`, 'info');
              }
            }
          }
          
          // Extract groups
          const groupElements = xmlDoc.getElementsByTagName('group');
          addLog(`Found ${groupElements.length} group elements`, 'info');
          
          const extractedGroups: Group[] = [];
          for (let i = 0; i < groupElements.length; i++) {
            const groupElement = groupElements[i];
            const nameElement = groupElement.getElementsByTagName('name')[0];
            
            if (nameElement && nameElement.textContent) {
              const groupName = nameElement.textContent.trim();
              if (groupName) {
                extractedGroups.push({
                  name: groupName,
                  enabled: true
                });
                addLog(`Found group: ${groupName}`, 'info');
              }
            }
          }
          
          // Extract options
          const optionElements = xmlDoc.getElementsByTagName('option');
          addLog(`Found ${optionElements.length} option elements`, 'info');
          
          const extractedOptions: Option[] = [];
          for (let i = 0; i < optionElements.length; i++) {
            const optionElement = optionElements[i];
            const nameElement = optionElement.getElementsByTagName('name')[0];
            
            if (nameElement && nameElement.textContent) {
              const optionName = nameElement.textContent.trim();
              if (optionName) {
                extractedOptions.push({
                  name: optionName,
                  enabled: true
                });
                addLog(`Found option: ${optionName}`, 'info');
              }
            }
          }
          
          // Sort all arrays alphabetically
          extractedCategories.sort((a, b) => a.name.localeCompare(b.name));
          extractedGroups.sort((a, b) => a.name.localeCompare(b.name));
          extractedOptions.sort((a, b) => a.name.localeCompare(b.name));
          
          setCategories(extractedCategories);
          setGroups(extractedGroups);
          setOptions(extractedOptions);
          
          addLog(`Successfully extracted ${extractedCategories.length} categories, ${extractedGroups.length} groups, ${extractedOptions.length} options`, 'success');
          
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

  const toggleGroup = (index: number) => {
    setGroups(prev => prev.map((group, i) => 
      i === index ? { ...group, enabled: !group.enabled } : group
    ));
  };

  const toggleOption = (index: number) => {
    setOptions(prev => prev.map((option, i) => 
      i === index ? { ...option, enabled: !option.enabled } : option
    ));
  };

  const hasData = categories.length > 0 || groups.length > 0 || options.length > 0;

  return (
    <div className="space-y-6">
      {/* Isolated Execute Button */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-green-600">
            GloriaFood Menu Control
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
        
        <div className="mt-4">
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
      </div>

      {/* GloriaFood Fetch Menu Snippet - Hidden when data is displayed */}
      {!hasData && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-green-600 mb-4">
            GloriaFood API Snippet
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
      )}

      {/* Display Controls and Data */}
      {hasData && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-green-600 mb-4">Menu Data</h3>
          
          {/* Display Control Checkboxes */}
          <div className="flex gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="show-categories" 
                checked={showCategories} 
                onCheckedChange={(checked) => setShowCategories(checked as boolean)}
              />
              <Label htmlFor="show-categories" className="text-sm font-medium">
                Categories ({categories.length})
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="show-groups" 
                checked={showGroups} 
                onCheckedChange={(checked) => setShowGroups(checked as boolean)}
              />
              <Label htmlFor="show-groups" className="text-sm font-medium">
                Groups ({groups.length})
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="show-options" 
                checked={showOptions} 
                onCheckedChange={(checked) => setShowOptions(checked as boolean)}
              />
              <Label htmlFor="show-options" className="text-sm font-medium">
                Options ({options.length})
              </Label>
            </div>
          </div>

          {/* Three Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Categories Column */}
            {showCategories && categories.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <Button
                      key={index}
                      variant={category.enabled ? "default" : "outline"}
                      onClick={() => toggleCategory(index)}
                      className={`w-full justify-start text-sm ${
                        category.enabled 
                          ? 'bg-green-500 hover:bg-green-600 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Groups Column */}
            {showGroups && groups.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Groups</h4>
                <div className="space-y-2">
                  {groups.map((group, index) => (
                    <Button
                      key={index}
                      variant={group.enabled ? "default" : "outline"}
                      onClick={() => toggleGroup(index)}
                      className={`w-full justify-start text-sm ${
                        group.enabled 
                          ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {group.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Options Column */}
            {showOptions && options.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Options</h4>
                <div className="space-y-2">
                  {options.map((option, index) => (
                    <Button
                      key={index}
                      variant={option.enabled ? "default" : "outline"}
                      onClick={() => toggleOption(index)}
                      className={`w-full justify-start text-sm ${
                        option.enabled 
                          ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {option.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            {showCategories && (
              <div>
                <span className="font-medium">Categories:</span> {categories.filter(c => c.enabled).length} enabled | {categories.filter(c => !c.enabled).length} disabled
              </div>
            )}
            {showGroups && (
              <div>
                <span className="font-medium">Groups:</span> {groups.filter(g => g.enabled).length} enabled | {groups.filter(g => !g.enabled).length} disabled
              </div>
            )}
            {showOptions && (
              <div>
                <span className="font-medium">Options:</span> {options.filter(o => o.enabled).length} enabled | {options.filter(o => !o.enabled).length} disabled
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
