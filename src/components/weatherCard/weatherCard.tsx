import React, { useEffect, useState } from 'react';
import {
  OpenWeatherData,
  OpenWeatherTempScale,
  getWeatherByCityName,
  getWeatherIconSrc,
} from '../../utils/api';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Grid,
} from '@mui/material';
import './weatherCard.css';

const WeatherCardContainer: React.FC<{
  children: React.ReactNode;
  onDelete?: () => void;
}> = ({ children, onDelete }) => {
  return (
    <Box mx={'4px'} my={'16px'}>
      <Card>
        <CardContent>{children}</CardContent>
        <CardActions>
          {onDelete && (
            <Button sx={{ color: 'red' }} onClick={onDelete}>
              <Typography className="weatherCardBody">Delete</Typography>
            </Button>
          )}
        </CardActions>
      </Card>
    </Box>
  );
};

type WeatherCardState = 'loading' | 'error' | 'ready';

const WeatherCard: React.FC<{
  city: string;
  tempScale: OpenWeatherTempScale;
  onDelete?: () => void;
}> = ({ city, tempScale, onDelete }) => {
  const [weatherData, setWeatherData] = useState<OpenWeatherData | null>(null);
  const [cardState, setCardState] = useState<WeatherCardState>('loading');

  useEffect(() => {
    getWeatherByCityName(city, tempScale)
      .then((data) => {
        setWeatherData(data);
        setCardState('ready');
      })
      .catch((err) => {
        setCardState('error');
      });
  }, [city, tempScale]);

  if (cardState === 'error' || cardState === 'loading')
    return (
      <WeatherCardContainer onDelete={onDelete}>
        <Typography className="weatherCardTitle">{city}</Typography>
        <Typography className="weatherCardBody">
          {cardState === 'loading'
            ? 'Loading...'
            : 'Error: Could not load weather data.'}
        </Typography>
      </WeatherCardContainer>
    );

  return (
    <WeatherCardContainer onDelete={onDelete}>
      <Grid container justifyContent="space-around">
        <Grid item>
          <Typography className="weatherCardTitle">
            {weatherData.name}
          </Typography>
          <Typography className="weatherCardTemp">
            {Math.round(weatherData.main.temp)}
          </Typography>
          <Typography className="weatherCardBody">
            Feels like: {Math.round(weatherData.main.feels_like)}
          </Typography>
        </Grid>
        <Grid item>
          {weatherData.weather.length > 0 && (
            <>
              <img src={getWeatherIconSrc(weatherData.weather[0].icon)}></img>
              <Typography className="weatherCardBody">
                {weatherData.weather[0].main}
              </Typography>
            </>
          )}
        </Grid>
      </Grid>
    </WeatherCardContainer>
  );
};

export default WeatherCard;
