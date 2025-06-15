
import { useState } from 'react';
import { useConsole } from '@/hooks/useConsole';

export const OtherTab = () => {
  const [currency, setCurrency] = useState('USD');
  const [supportedLanguages, setSupportedLanguages] = useState('en,ru,kh,cn');
  const [defaultLanguage, setDefaultLanguage] = useState('en');
  const [orderTimeout, setOrderTimeout] = useState('30');
  const { addLog } = useConsole();

  const saveOtherVariables = () => {
    const otherVars = {
      CURRENCY: currency,
      SUPPORTED_LANGUAGES: supportedLanguages,
      DEFAULT_LANGUAGE: defaultLanguage,
      ORDER_TIMEOUT: orderTimeout
    };

    Object.entries(otherVars).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });

    addLog('Other variables saved to localStorage', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-lime-400">OTHER ENVIRONMENT VARIABLES</h2>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">CURRENCY</span>
              </label>
              <select 
                className="select select-bordered"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="KHR">KHR (៛)</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">SUPPORTED LANGUAGES</span>
              </label>
              <input
                type="text"
                value={supportedLanguages}
                onChange={(e) => setSupportedLanguages(e.target.value)}
                className="input input-bordered"
                placeholder="en,ru,kh,cn"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">DEFAULT LANGUAGE</span>
              </label>
              <select 
                className="select select-bordered"
                value={defaultLanguage}
                onChange={(e) => setDefaultLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="ru">Russian</option>
                <option value="kh">Khmer</option>
                <option value="cn">Chinese</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">ORDER TIMEOUT (minutes)</span>
              </label>
              <input
                type="number"
                value={orderTimeout}
                onChange={(e) => setOrderTimeout(e.target.value)}
                className="input input-bordered"
                placeholder="30"
              />
            </div>
          </div>

          <div className="card-actions justify-end">
            <button 
              className="btn btn-primary bg-lime-600 border-lime-600 hover:bg-lime-700"
              onClick={saveOtherVariables}
            >
              SAVE
            </button>
          </div>
        </div>
      </div>

      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h3 className="card-title text-lime-400">CURRENCY FORMAT</h3>
          <div className="alert alert-info">
            <span>Format: Amount followed by $ symbol with space as thousand separator</span>
          </div>
          <div className="mockup-code">
            <pre data-prefix="Example:">
              <code>1 000.50 $</code>
            </pre>
            <pre data-prefix="Example:">
              <code>15 500.00 $</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
