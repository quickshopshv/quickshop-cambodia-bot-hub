
import { useConsole } from '@/hooks/useConsole';

export const DatabaseTab = () => {
  const { addLog } = useConsole();

  const openSupabaseDashboard = () => {
    addLog('Opening Supabase dashboard...', 'info');
    window.open('https://supabase.com/dashboard', '_blank');
  };

  const openTableEditor = () => {
    addLog('Opening table editor...', 'info');
    // This would open the specific Supabase table editor
    window.open('https://supabase.com/dashboard/project/[PROJECT_ID]/editor', '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-lime-400">DATABASE ENVIRONMENT VARIABLES</h2>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="alert alert-info">
              <span>Database is connected via Supabase integration. Use the shortcuts below to manage your database.</span>
            </div>

            <div className="card-actions justify-center space-x-2">
              <button 
                className="btn btn-primary bg-lime-600 border-lime-600 hover:bg-lime-700"
                onClick={openSupabaseDashboard}
              >
                SUPABASE DASHBOARD
              </button>
              <button 
                className="btn btn-secondary"
                onClick={openTableEditor}
              >
                TABLE EDITOR
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h3 className="card-title text-lime-400">PROPOSED DATABASE STRUCTURE</h3>
          <div className="space-y-4">
            <div className="collapse collapse-arrow bg-base-300">
              <input type="checkbox" />
              <div className="collapse-title text-xl font-medium">
                Users Table
              </div>
              <div className="collapse-content">
                <ul className="list-disc list-inside space-y-1">
                  <li>id (uuid, primary key)</li>
                  <li>telegram_id (bigint, unique)</li>
                  <li>username (text)</li>
                  <li>first_name (text)</li>
                  <li>last_name (text)</li>
                  <li>language_code (text)</li>
                  <li>created_at (timestamp)</li>
                  <li>updated_at (timestamp)</li>
                </ul>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-300">
              <input type="checkbox" />
              <div className="collapse-title text-xl font-medium">
                Orders Table
              </div>
              <div className="collapse-content">
                <ul className="list-disc list-inside space-y-1">
                  <li>id (uuid, primary key)</li>
                  <li>user_id (uuid, foreign key)</li>
                  <li>order_items (jsonb)</li>
                  <li>total_amount (decimal)</li>
                  <li>status (text)</li>
                  <li>delivery_address (text)</li>
                  <li>phone_number (text)</li>
                  <li>created_at (timestamp)</li>
                  <li>completed_at (timestamp)</li>
                </ul>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-300">
              <input type="checkbox" />
              <div className="collapse-title text-xl font-medium">
                Menu Cache Table
              </div>
              <div className="collapse-content">
                <ul className="list-disc list-inside space-y-1">
                  <li>id (uuid, primary key)</li>
                  <li>menu_data (jsonb)</li>
                  <li>last_updated (timestamp)</li>
                  <li>version (text)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
