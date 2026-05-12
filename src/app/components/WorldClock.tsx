import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

const TIMEZONES = [
  { label: 'IST', tz: 'Asia/Kolkata', city: 'Prayagraj' },
  { label: 'EST', tz: 'America/New_York', city: 'New York' },
  { label: 'PST', tz: 'America/Los_Angeles', city: 'Los Angeles' },
  { label: 'UTC', tz: 'UTC', city: 'UTC' },
  { label: 'JST', tz: 'Asia/Tokyo', city: 'Tokyo' },
];

function formatTime(tz: string) {
  return new Date().toLocaleTimeString('en-US', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function WorldClock() {
  const { isDark } = useApp();
  const [times, setTimes] = useState(() => TIMEZONES.map(t => formatTime(t.tz)));
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimes(TIMEZONES.map(t => formatTime(t.tz)));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % TIMEZONES.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const current = TIMEZONES[currentIndex];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-zinc-500 hover:text-foreground hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-all"
      >
        <Globe size={16} />
        <span className="text-xs font-mono font-bold">
          {isOpen ? times[0] : `${current.label} ${times[currentIndex]}`}
        </span>
      </button>

      {isOpen && (
        <div className={`absolute right-0 top-full mt-1 w-48 rounded-xl border-2 shadow-lg z-50 ${
          isDark ? 'bg-[#0D0B1A] border-zinc-700' : 'bg-white border-zinc-900'
        }`}>
          <div className="p-2 space-y-1">
            {TIMEZONES.map((zone, i) => (
              <div
                key={zone.tz}
                className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                  i === currentIndex ? 'bg-violet-100 dark:bg-violet-900/30' : ''
                }`}
              >
                <div className="flex flex-col">
                  <span className={`text-xs font-bold ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    {zone.label}
                  </span>
                  <span className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    {zone.city}
                  </span>
                </div>
                <span className="text-sm font-mono font-bold text-[#7C3AED]">
                  {times[i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}