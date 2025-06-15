
import { useState } from 'react';
import { useConsole } from '@/hooks/useConsole';
import { supabase } from '@/integrations/supabase/client';

export const DatabaseTab = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { addLog } = useConsole();

  const testDatabaseConnection = async () => {
    setIsLoading(true);
    addLog('Testing Supabase database connection...', 'info');
    
    try {
      const { data, error } = await supabase.from('users').select('count').limit(1);
      
      if (error) {
        addLog(`Database error: ${error.message}`, 'error');
      } else {
        addLog('Database connection successful!', 'success');
        addLog(`Connected to Supabase database`, 'info');
      }
    } catch (error) {
      addLog(`Connection error: ${error}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const checkTables = async () => {
    setIsLoading(true);
    addLog('Checking database tables...', 'info');
    
    try {
      // Check users table
      const { error: usersError } = await supabase.from('users').select('count').limit(1);
      if (usersError) {
        addLog(`Users table: ${usersError.message}`, 'warning');
      } else {
        addLog('Users table: OK', 'success');
      }

      // Check menu_cache table
      const { error: menuError } = await supabase.from('menu_cache').select('count').limit(1);
      if (menuError) {
        addLog(`Menu cache table: ${menuError.message}`, 'warning');
      } else {
        addLog('Menu cache table: OK', 'success');
      }
    } catch (error) {
      addLog(`Table check error: ${error}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-lime-400">DATABASE MANAGEMENT</h2>
          
          <div className="stats stats-vertical lg:stats-horizontal shadow">
            <div className="stat">
              <div className="stat-title">Project ID</div>
              <div className="stat-value text-sm">fxhtcdyxmtfyvanqhaty</div>
            </div>
            <div className="stat">
              <div className="stat-title">Status</div>
              <div className="stat-value text-lime-400">Connected</div>
            </div>
          </div>

          <div className="card-actions justify-end space-x-2">
            <button 
              className={`btn btn-secondary ${isLoading ? 'loading' : ''}`}
              onClick={testDatabaseConnection}
              disabled={isLoading}
            >
              TEST CONNECTION
            </button>
            <button 
              className={`btn btn-primary bg-lime-600 border-lime-600 hover:bg-lime-700 ${isLoading ? 'loading' : ''}`}
              onClick={checkTables}
              disabled={isLoading}
            >
              CHECK TABLES
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
