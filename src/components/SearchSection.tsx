import React, { useState } from 'react';

import { SEARCH_ENGINES } from '../constants';
import { Search } from 'lucide-react';
import { SearchEngine } from '../types';
import { useAlert } from '../hooks/useAlertContext';

const SearchSection: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedEngine, setSelectedEngine] = useState<SearchEngine>(SearchEngine.Google);
  const { showWarning } = useAlert();
  
  const handleSearch = () => {
    if (!query.trim()) {
      showWarning('Please enter a search term.');
      return;
    }
    const engine = SEARCH_ENGINES.find((e) => e.name === selectedEngine);
    if (engine) {
      const url = `${engine.url}${encodeURIComponent(query)}`;
      window.open(url, '_blank');
      setQuery('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="bg-base-100 p-6 rounded-box border border-base-content/10">
      <h2 className="text-2xl font-bold mb-4">Internet Search</h2>
      <div className="join w-full">
        <select
          className="select select-bordered join-item"
          value={selectedEngine}
          onChange={(e) => setSelectedEngine(e.target.value as SearchEngine)}
        >
          {SEARCH_ENGINES.map((engine) => (
            <option key={engine.name} value={engine.name}>
              {engine.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search the web..."
          className="input input-bordered join-item w-full"
        />
        <button className="btn btn-primary join-item" onClick={handleSearch}>
          <Search className="w-4 h-4 mr-1" />
          Search
        </button>
      </div>
    </section>
  );
};

export default SearchSection;
