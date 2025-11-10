'use client';

import { useState, useEffect } from 'react';
import { WeeklyWeatherDisplay } from './WeatherDisplay';
import {
  fetchWeatherClient,
  transformWeatherData,
  type WeatherData,
} from '@/lib/utils/weather';

interface WeatherClientProps {
  latitude: number;
  longitude: number;
  prefectureName: string;
}

export function WeatherClient({
  latitude,
  longitude,
  prefectureName,
}: WeatherClientProps) {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWeather() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchWeatherClient(latitude, longitude);
        const data = transformWeatherData(response);
        setWeatherData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : '天気情報の取得に失敗しました'
        );
      } finally {
        setLoading(false);
      }
    }

    loadWeather();
  }, [latitude, longitude]);

  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-950">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (weatherData.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">
          天気情報が見つかりませんでした
        </p>
      </div>
    );
  }

  return (
    <WeeklyWeatherDisplay
      weatherData={weatherData}
      prefectureName={prefectureName}
    />
  );
}

