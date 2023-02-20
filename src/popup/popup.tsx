import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import 'fontsource-roboto';
import './popup.css';
import WeatherCard from '../components/weatherCard';
import AddIcon from '@mui/icons-material/Add';
import PictureInPicture from '@mui/icons-material/PictureInPicture';
import { InputBase, Grid, IconButton, Paper, Box } from '@mui/material';
import {
  getStoredCities,
  setStoredCities,
  getStoredOptions,
  LocalStorageOptions,
  setStoredOptions,
} from '../utils/storage';
import { Messages } from '../utils/messages';

const App: React.FC<{}> = () => {
  const [cities, setCities] = useState<string[]>([]);

  const [cityInput, setCityInput] = useState<string>('');

  const [options, setOptions] = useState<LocalStorageOptions | null>(null);

  useEffect(() => {
    getStoredCities().then((storedCities) => {
      if (storedCities) setCities(storedCities);
    });

    getStoredOptions().then((storedOptions) => {
      setOptions(storedOptions);
    });
  }, []);

  const handleCityAdd = () => {
    if (cityInput === '') return;

    const updatedCities = [...cities, cityInput];

    setStoredCities(updatedCities).then(() => {
      setCities(updatedCities);
      setCityInput('');
    });
    setCities([...cities, cityInput]);
    setCityInput('');
  };

  const handleCityDelete = (index: number) => {
    cities.splice(index, 1);
    const updatedCities = [...cities];
    setStoredCities(updatedCities).then(() => {
      setCities([...cities]);
    });
  };

  const handleTempScaleButtonClick = () => {
    const updatedOptions: LocalStorageOptions = {
      ...options,
      tempScale: options.tempScale === 'metric' ? 'imperial' : 'metric',
    };

    setStoredOptions(updatedOptions).then(() => {
      setOptions(updatedOptions);
    });
  };

  const handleOverlayButtonClick = () => {
    // chrome.tabGroups.query({}).then((tabGroups) => {
    //   if (tabGroups.length > 0) {
    //     tabGroups.forEach((tabGroup) => {
    //       if (tabGroup.id === chrome.windows.WINDOW_ID_CURRENT) {
    //         chrome.tabs.sendMessage(tabGroup.id, {
    //           type: Messages.TOGGLE_OVERLAY,
    //         });
    //       }
    //     });
    //   }
    // });
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
        windowId: chrome.windows.WINDOW_ID_CURRENT,
      },
      (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: Messages.TOGGLE_OVERLAY,
        });
      }
    );
  };

  if (!options) return null;

  return (
    <Box mx="8px" my="16px">
      <Grid container justifyContent="space-evenly">
        <Grid
          item
          sx={{
            width: '80%',
            // marginLeft: '-5px',
          }}
        >
          <Paper>
            <Box px="15px" py="5px">
              <InputBase
                placeholder="Add a city"
                sx={{
                  width: '80%',
                }}
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
              />
              <IconButton
                sx={{
                  marginLeft: '5%',
                }}
                onClick={handleCityAdd}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
        <Grid item>
          <Paper>
            <Box py="6px">
              <IconButton
                onClick={handleTempScaleButtonClick}
                sx={{ height: '38px' }}
              >
                {options.tempScale === 'metric' ? '\u2103' : '\u2109'}
              </IconButton>
            </Box>
          </Paper>
        </Grid>

        <Grid item>
          <Paper>
            <Box py="6px">
              <IconButton
                onClick={handleOverlayButtonClick}
                sx={{ height: '38px' }}
              >
                <PictureInPicture />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {options.homeCity !== '' && (
        <WeatherCard city={options.homeCity} tempScale={options.tempScale} />
      )}
      {cities.map((city, index) => (
        <WeatherCard
          key={index}
          tempScale={options.tempScale}
          city={city}
          onDelete={() => handleCityDelete(index)}
        />
      ))}
      <Box height="16px" />
    </Box>
  );
};

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
