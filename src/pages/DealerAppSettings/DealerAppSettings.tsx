import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { toast } from 'react-toastify';

const DealerAppSettings = () => {
  const [selectedSeason, setSelectedSeason] = useState('spring');
  const [isApplying, setIsApplying] = useState(false);

  const seasons = [
    { value: 'spring', label: 'Spring', color: '#10b981' },
    { value: 'summer', label: 'Summer', color: '#f59e0b' },
    { value: 'autumn', label: 'Autumn', color: '#ef6b3d' },
    { value: 'winter', label: 'Winter', color: '#3b82f6' },
  ];

  const handleApply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsApplying(true);

    // Simulate API call
    setTimeout(() => {
      setIsApplying(false);
      toast.success(`${selectedSeason.charAt(0).toUpperCase() + selectedSeason.slice(1)} theme applied successfully!`);
    }, 1500);
  };

  return (
    <div className="space-y-6 text-left min-w-0">
      <div className="flex items-center gap-3">
        <Settings className="text-green-600 shrink-0" size={30} />
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Dealer App Settings</h1>
      </div>

      <form onSubmit={handleApply} className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8 w-full max-w-md">
        <FormControl fullWidth>
          <label className="block text-sm font-semibold text-gray-700 mb-4">Select Season-wise Theme</label>
          <RadioGroup value={selectedSeason} onChange={(e) => setSelectedSeason(e.target.value)}>
            {seasons.map((season) => (
              <FormControlLabel
                key={season.value}
                value={season.value}
                control={
                  <Radio
                    sx={{
                      color: 'var(--text)',
                      '&.Mui-checked': { color: 'var(--common-btn-bg)' },
                    }}
                  />
                }
                label={
                  <span className="flex items-center gap-2 cursor-pointer">
                    <span
                      className="w-6 h-6 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: season.color }}
                    />
                    <span className="text-sm font-medium text-gray-700">{season.label}</span>
                  </span>
                }
              />
            ))}
          </RadioGroup>
        </FormControl>

        <button
          type="submit"
          disabled={isApplying}
          className="w-full mt-6 font-bold py-3 rounded-lg transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bg-common-btn-bg hover:bg-common-btn-hover text-white"
        >
          {isApplying ? 'Applying...' : 'Apply'}
        </button>
      </form>
    </div>
  );
};

export default DealerAppSettings;
