import {
  INITIAL_FAVORITE_PORTS,
  LOCAL_STORAGE_KEY,
  INITIAL_LOCAL_SITES,
  LOCAL_SITES_STORAGE_KEY,
} from './constants';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import AddPortModal from './components/AddPortModal';
import AddSiteModal from './components/AddSiteModal';
import Clock from './components/Clock';
import CustomPortSection from './components/CustomPortSection';
import FavoritePorts from './components/FavoritePorts';
import LocalSites from './components/LocalSites';
import GithubIcon from './components/icons/Github';
import type { Port, LocalSite } from './types';
import SearchSection from './components/SearchSection';
import ThemeSwitcher from './components/ThemeSwitcher';
import { usePortStatus } from './hooks/usePortStatus';
import { useAlert } from './hooks/useAlertContext';


const App: React.FC = () => {
  const [favoritePorts, setFavoritePorts] = useState<Port[]>([]);
  const [localSites, setLocalSites] = useState<LocalSite[]>([]);
  const [isPortModalOpen, setIsPortModalOpen] = useState(false);
  const [isSiteModalOpen, setIsSiteModalOpen] = useState(false);

  const portNumbers = useMemo(() => favoritePorts.map((port) => port.number), [favoritePorts]);

  const { showError } = useAlert();

  const { portStatus } = usePortStatus(portNumbers, {
    interval: 30000,
    timeout: 3000,
    enabled: portNumbers.length > 0,
  });

  const portsWithStatus = useMemo(
    () =>
      favoritePorts.map((port) => ({
        ...port,
        isActive: portStatus[port.number],
      })),
    [favoritePorts, portStatus]
  );

  useEffect(() => {
    try {
      const storedPorts = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedPorts) {
        setFavoritePorts(JSON.parse(storedPorts));
      } else {
        setFavoritePorts(INITIAL_FAVORITE_PORTS);
      }
    } catch (error) {
      console.error('Failed to load ports from local storage', error);
      setFavoritePorts(INITIAL_FAVORITE_PORTS);
    }

    try {
      const storedSites = localStorage.getItem(LOCAL_SITES_STORAGE_KEY);
      if (storedSites) {
        setLocalSites(JSON.parse(storedSites));
      } else {
        setLocalSites(INITIAL_LOCAL_SITES);
      }
    } catch (error) {
      console.error('Failed to load sites from local storage', error);
      setLocalSites(INITIAL_LOCAL_SITES);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favoritePorts));
    } catch (error) {
      console.error('Failed to save ports to local storage', error);
    }
  }, [favoritePorts]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_SITES_STORAGE_KEY, JSON.stringify(localSites));
    } catch (error) {
      console.error('Failed to save sites to local storage', error);
    }
  }, [localSites]);

  const handleAddPort = useCallback(
    (newPort: Omit<Port, 'color'>) => {
      if (favoritePorts.some((p) => p.number === newPort.number)) {
        showError(`Port ${newPort.number} already exists in your favorites.`);
        return;
      }
      const colors = [
        'bg-sky-500',
        'bg-red-500',
        'bg-purple-500',
        'bg-red-700',
        'bg-green-500',
        'bg-gray-500',
        'bg-blue-600',
        'bg-pink-500',
        'bg-indigo-500',
        'bg-teal-500',
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      setFavoritePorts((prevPorts) => [...prevPorts, { ...newPort, color: randomColor }]);
      setIsPortModalOpen(false);
    },
    [favoritePorts, showError]
  );

  const handleRemovePort = useCallback((portNumber: number) => {
    setFavoritePorts((prevPorts) => prevPorts.filter((p) => p.number !== portNumber));
  }, []);

  const handleRestoreDefaults = useCallback(() => {
    if (
      confirm(
        'Are you sure you want to restore default ports? This will remove all your custom ports.'
      )
    ) {
      setFavoritePorts(INITIAL_FAVORITE_PORTS);
    }
  }, []);

  const handleAddSite = useCallback(
    (newSite: Omit<LocalSite, 'color'>) => {
      if (localSites.some((s) => s.name === newSite.name)) {
        alert(`Site "${newSite.name}" already exists in your favorites.`);
        return;
      }
      const colors = [
        'bg-sky-500',
        'bg-red-500',
        'bg-purple-500',
        'bg-green-500',
        'bg-blue-600',
        'bg-orange-500',
        'bg-teal-500',
        'bg-indigo-500',
        'bg-pink-500',
        'bg-yellow-500',
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      setLocalSites((prevSites) => [...prevSites, { ...newSite, color: randomColor }]);
      setIsSiteModalOpen(false);
    },
    [localSites]
  );

  const handleRemoveSite = useCallback((siteName: string) => {
    setLocalSites((prevSites) => prevSites.filter((s) => s.name !== siteName));
  }, []);

  const handleRestoreSiteDefaults = useCallback(() => {
    if (
      confirm(
        'Are you sure you want to restore default sites? This will remove all your custom sites.'
      )
    ) {
      setLocalSites(INITIAL_LOCAL_SITES);
    }
  }, []);

  return (
    <div className="min-h-screen bg-base-200 text-base-content font-sans p-4 sm:p-6 md:p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="relative mb-8">
          <div className="absolute top-0 right-0 z-10">
            <ThemeSwitcher />
          </div>
          <header className="text-center">
            <Clock />
            <h1 className="text-5xl font-black mt-4 text-primary">localHost</h1>
            <p className="text-xl mt-2 text-base-content/70">Welcome Young Developer!</p>
          </header>
        </div>

        <main className="space-y-12">
          <SearchSection />
          <FavoritePorts
            ports={portsWithStatus}
            onAddPortClick={() => setIsPortModalOpen(true)}
            onRemovePort={handleRemovePort}
            onRestoreDefaults={handleRestoreDefaults}
          />
          <LocalSites
            sites={localSites}
            onAddSiteClick={() => setIsSiteModalOpen(true)}
            onRemoveSite={handleRemoveSite}
            onRestoreDefaults={handleRestoreSiteDefaults}
          />
          <CustomPortSection />
        </main>

        <footer className="text-center mt-12">
          <p className="text-base-content/50">Happy coding!</p>
          <a
            href="https://github.com/Ygryan360/localhost.git"
            target="_blank"
            rel="noopener noreferrer"
            title="Star on GitHub"
          >
            <GithubIcon className="w-6 h-6 mx-auto mt-2 text-base-content/50 hover:text-base-content transition-colors" />
          </a>
        </footer>
      </div>

      <AddPortModal
        isOpen={isPortModalOpen}
        onClose={() => setIsPortModalOpen(false)}
        onAdd={handleAddPort}
      />
      <AddSiteModal
        isOpen={isSiteModalOpen}
        onClose={() => setIsSiteModalOpen(false)}
        onAdd={handleAddSite}
      />
    </div>
  );
};

export default App;
