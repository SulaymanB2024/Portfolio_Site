import { useState, useEffect } from 'react';

export function LocalTime() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.toLocaleTimeString('en-GB', { timeZone: 'Europe/London', hour: '2-digit' }).padStart(2, '0');
  const minutes = time.toLocaleTimeString('en-GB', { timeZone: 'Europe/London', minute: '2-digit' }).padStart(2, '0');
  const seconds = time.toLocaleTimeString('en-GB', { timeZone: 'Europe/London', second: '2-digit' }).padStart(2, '0');

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] font-sans tracking-[0.3em] uppercase opacity-50">Local Time</span>
      <span className="font-serif italic text-2xl tracking-tighter">
        {hours}<span className="opacity-60">:</span>{minutes}<span className="opacity-60">:</span>{seconds} GMT
      </span>
    </div>
  );
}
