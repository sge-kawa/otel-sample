// Open-Meteo APIのレスポンス型定義

export interface DailyWeather {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weather_code: number[];
  precipitation_sum: number[];
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  daily_units: {
    time: string;
    temperature_2m_max: string;
    temperature_2m_min: string;
    weather_code: string;
    precipitation_sum: string;
  };
  daily: DailyWeather;
}

export interface WeatherData {
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  precipitation: number;
}

export type Prefecture = 
  | 'fukuoka' 
  | 'saga' 
  | 'nagasaki' 
  | 'kumamoto' 
  | 'oita' 
  | 'miyazaki' 
  | 'kagoshima';

export interface PrefectureInfo {
  name: string;
  nameJa: string;
  latitude: number;
  longitude: number;
}

