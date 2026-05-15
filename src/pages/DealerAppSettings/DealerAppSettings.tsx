import React, { useState } from 'react';
import { Settings } from 'lucide-react';

const DealerAppSettings = () => {
  const [selectedSeason, setSelectedSeason] = useState('spring');
  const [message, setMessage] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const seasons = [
    { value: 'spring', label: 'Spring', color: '#10b981' },
    { value: 'summer', label: 'Summer', color: '#f59e0b' },
    { value: 'autumn', label: 'Autumn', color: '#ef6b3d' },
    { value: 'winter', label: 'Winter', color: '#3b82f6' },
  ];

  const handleApply = (e) => {
    e.preventDefault();
    setIsApplying(true);
    setMessage('');

    // Simulate API call
    setTimeout(() => {
      setIsApplying(false);
      setMessage(`${selectedSeason.charAt(0).toUpperCase() + selectedSeason.slice(1)} theme applied successfully!`);
      setTimeout(() => setMessage(''), 3000);
    }, 1500);
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="text-green-600" size={32} />
        <h1 className="text-3xl font-bold text-gray-900">Dealer App Settings</h1>
      </div>

      <form onSubmit={handleApply} className="bg-white rounded-lg shadow-md p-8 max-w-md">
        {message && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
            {message}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">Select Season-wise Theme</label>
          <div className="space-y-3">
            {seasons.map((season) => (
              <div key={season.value} className="flex items-center gap-3">
                <input
                  type="radio"
                  id={season.value}
                  name="season"
                  value={season.value}
                  checked={selectedSeason === season.value}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="w-4 h-4 cursor-pointer"
                />
                <label htmlFor={season.value} className="flex items-center gap-2 cursor-pointer">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: season.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">{season.label}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isApplying}
          className="w-full mt-6 bg-common-btn-bg hover:bg-common-btn-hover text-white font-bold py-3 rounded-lg transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isApplying ? 'Applying...' : 'Apply'}
        </button>
      </form>
    </div>
  );
};

export default DealerAppSettings;
