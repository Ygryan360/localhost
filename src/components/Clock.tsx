import React, { useEffect, useState } from 'react';

const Clock: React.FC = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const dateString = date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-base-300 rounded-box border border-base-content/10 p-8 mb-4 inline-block">
      <div className="text-4xl font-black text-accent">
        <span className="countdown font-mono">
          <span style={{ '--value': hours } as React.CSSProperties}></span>:
          <span style={{ '--value': minutes } as React.CSSProperties}></span>:
          <span style={{ '--value': seconds } as React.CSSProperties}></span>
        </span>
      </div>
      <div className="text-sm text-base-content/70 tracking-wide mt-2">
        {dateString.toUpperCase()}
      </div>
    </div>
  );
};

export default Clock;
