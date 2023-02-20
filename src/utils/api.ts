const OPEN_WEATHER_API_KEY = 'b593d848664c2659ca382674a779d7a2';

export interface OpenWeatherData {
  name: string;
  main: {
    feels_like: number;
    humidity: number;
    pressure: number;
    temp: number;
    temp_max: number;
    temp_min: number;
  };
  weather: {
    description: string;
    icon: string;
    id: number;
    main: string;
  }[];
  wind: {
    deg: number;
    speed: number;
  };
}

export type OpenWeatherTempScale = 'metric' | 'imperial';

export async function getWeatherByCityName(
  cityName: string,
  tempScale: OpenWeatherTempScale
): Promise<any> {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${tempScale}&appid=${OPEN_WEATHER_API_KEY}`
  );

  if (!response.ok) {
    throw new Error('City not found!');
  }

  const data: OpenWeatherData = await response.json();
  return data;
}

export function getWeatherIconSrc(iconCode: string) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}
