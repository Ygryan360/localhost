import React, { useState } from 'react';

import { SquareArrowOutUpRight } from 'lucide-react';
import { useAlert } from '../hooks/useAlertContext';

const CustomPortSection: React.FC = () => {
  const [port, setPort] = useState('');
  const { showWarning } = useAlert();

  const goToCustomPort = () => {
    const portNumber = parseInt(port, 10);
    if (!port.trim()) {
      showWarning('Please enter a port number.');
      return;
    }
    if (isNaN(portNumber) || portNumber < 1 || portNumber > 65535) {
      showWarning('Please enter a valid port number (1-65535).');
      return;
    }
    const url = `http://localhost:${portNumber}`;
    window.open(url, '_blank');
    setPort('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      goToCustomPort();
    }
  };

  return (
    <section className="bg-base-100 p-6 rounded-box border border-base-content/10">
      <h2 className="text-2xl font-bold mb-4">Custom Port</h2>
      <div className="join w-full">
        <input
          type="number"
          value={port}
          onChange={(e) => setPort(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter port (e.g., 3001)"
          min="1"
          max="65535"
          className="input input-bordered join-item w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button className="btn btn-secondary join-item" onClick={goToCustomPort}>
          <SquareArrowOutUpRight className="h-4 w-4 mr-1" />
          Go to Port
        </button>
      </div>
    </section>
  );
};

export default CustomPortSection;
