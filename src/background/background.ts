import {
  getStoredCities,
  getStoredOptions,
  setStoredCities,
  setStoredOptions,
} from '../utils/storage';
import { getWeatherByCityName } from '../utils/api';

chrome.runtime.onInstalled.addListener(() => {
  setStoredCities([]);
  setStoredOptions({
    hasAutoOverlay: true,
    homeCity: '',
    tempScale: 'metric',
  });

  chrome.contextMenus.create({
    contexts: ['selection'],
    title: 'Add city to Weather Overlay',
    id: 'weatherExtension',
  });

  chrome.alarms.create({
    periodInMinutes: 1 / 6, // 10 seconds
  });
});

chrome.contextMenus.onClicked.addListener((event) => {
  getStoredCities().then((cities) => {
    setStoredCities([...cities, event.selectionText]);
  });
});

chrome.alarms.onAlarm.addListener(() => {
  getStoredOptions().then((options) => {
    if (!options.homeCity) return;
    getWeatherByCityName(options.homeCity, options.tempScale).then((data) => {
      const temp = Math.round(data.main.temp);
      const symbol = options.tempScale === 'metric' ? '°C' : '°F';
      chrome.action.setBadgeText({
        text: `${temp}${symbol}`,
      });
    });
  });
});
