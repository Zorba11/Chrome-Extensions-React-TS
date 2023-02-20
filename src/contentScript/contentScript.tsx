// Content Script
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Card } from '@mui/material';
import WeatherCard from '../components/weatherCard';
import './contentScript.css';
import { LocalStorageOptions, getStoredOptions } from '../utils/storage';
import { Messages } from '../utils/messages';

const App: React.FC<{}> = () => {
  const [options, setOptions] = React.useState<LocalStorageOptions | null>(
    null
  );
  const [isActive, setIsActive] = React.useState<boolean>(false);

  useEffect(() => {
    getStoredOptions().then((options) => {
      setOptions(options);
      setIsActive(options.hasAutoOverlay);
    });
  }, []);

  // needs seperate useEffect to reseting the toggle overlay value
  useEffect(() => {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === Messages.TOGGLE_OVERLAY) {
        setIsActive(!isActive);
      }
    });
  }, [isActive]);

  if (!options) return null;

  return (
    <>
      {isActive && (
        <Card className="overlayCard">
          <WeatherCard
            city={options.homeCity}
            tempScale={options.tempScale}
            onDelete={() => setIsActive(false)}
          />
        </Card>
      )}
    </>
  );
};

const container = document.createElement('div');

document.body.appendChild(container);

const root = createRoot(container);

root.render(<App />);
