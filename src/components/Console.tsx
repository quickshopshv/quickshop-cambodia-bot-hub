
import { useConsole } from '@/hooks/useConsole';

export const Console = () => {
  const { logs, clearLogs } = useConsole();

  return (
    <div className="h-1/3 bg-base-300 border-t-2 border-lime-600">
      <div className="flex justify-between items-center p-2 bg-base-200">
        <h3 className="text-lime-400 font-bold">CONSOLE</h3>
        <button 
          className="btn btn-xs btn-error"
          onClick={clearLogs}
        >
          CLEAR
        </button>
      </div>
      <div className="h-full p-4 overflow-y-auto font-mono text-sm">
        {logs.length === 0 ? (
          <div className="text-gray-500">Console ready...</div>
        ) : (
          logs.map((log, index) => (
            <div 
              key={index} 
              className={`mb-1 ${
                log.type === 'error' ? 'text-red-400' : 
                log.type === 'success' ? 'text-lime-400' : 
                log.type === 'warning' ? 'text-yellow-400' : 
                'text-white'
              }`}
            >
              <span className="text-gray-400">[{log.timestamp}]</span> {log.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
