import type { WeatherData } from '@/lib/types/weather';
import { getWeatherDescription } from '@/lib/utils/weather';

interface WeatherDisplayProps {
  weather: WeatherData;
  title?: string;
}

export function WeatherDisplay({ weather, title }: WeatherDisplayProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {title && (
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
      )}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">日付</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {new Date(weather.date).toLocaleDateString('ja-JP', {
              month: 'long',
              day: 'numeric',
              weekday: 'short',
            })}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">天気</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {getWeatherDescription(weather.weatherCode)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">最高気温</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {weather.maxTemp.toFixed(1)}°C
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">最低気温</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {weather.minTemp.toFixed(1)}°C
          </span>
        </div>
        {weather.precipitation > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">降水量</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {weather.precipitation.toFixed(1)}mm
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

interface WeeklyWeatherDisplayProps {
  weatherData: WeatherData[];
  prefectureName: string;
}

export function WeeklyWeatherDisplay({
  weatherData,
  prefectureName,
}: WeeklyWeatherDisplayProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {prefectureName}の1週間の天気予報
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {weatherData.map((weather, index) => (
          <WeatherDisplay key={weather.date} weather={weather} />
        ))}
      </div>
    </div>
  );
}

