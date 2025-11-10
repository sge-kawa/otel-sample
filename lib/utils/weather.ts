import type { 
  WeatherResponse, 
  WeatherData, 
  Prefecture, 
  PrefectureInfo 
} from '../types/weather';

// 九州各県の座標データ
export const PREFECTURES: Record<Prefecture, PrefectureInfo> = {
  fukuoka: {
    name: 'fukuoka',
    nameJa: '福岡',
    latitude: 33.5904,
    longitude: 130.4017,
  },
  saga: {
    name: 'saga',
    nameJa: '佐賀',
    latitude: 33.2494,
    longitude: 130.2989,
  },
  nagasaki: {
    name: 'nagasaki',
    nameJa: '長崎',
    latitude: 32.7503,
    longitude: 129.8779,
  },
  kumamoto: {
    name: 'kumamoto',
    nameJa: '熊本',
    latitude: 32.8031,
    longitude: 130.7079,
  },
  oita: {
    name: 'oita',
    nameJa: '大分',
    latitude: 33.2381,
    longitude: 131.6126,
  },
  miyazaki: {
    name: 'miyazaki',
    nameJa: '宮崎',
    latitude: 31.9077,
    longitude: 131.4202,
  },
  kagoshima: {
    name: 'kagoshima',
    nameJa: '鹿児島',
    latitude: 31.5966,
    longitude: 130.5571,
  },
};

// 有効な県名のリスト
export const VALID_PREFECTURES = Object.keys(PREFECTURES) as Prefecture[];

// 県名のバリデーション
export function isValidPrefecture(prefecture: string): prefecture is Prefecture {
  return VALID_PREFECTURES.includes(prefecture as Prefecture);
}

// Open-Meteo APIのエンドポイント
const API_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

// 天気コードを日本語の説明に変換
export function getWeatherDescription(code: number): string {
  const weatherCodes: Record<number, string> = {
    0: '快晴',
    1: 'おおむね晴れ',
    2: '一部曇り',
    3: '曇り',
    45: '霧',
    48: '着氷性霧',
    51: '軽い霧雨',
    53: '霧雨',
    55: '濃い霧雨',
    56: '軽い着氷性霧雨',
    57: '濃い着氷性霧雨',
    61: '弱い雨',
    63: '雨',
    65: '強い雨',
    66: '軽い着氷性の雨',
    67: '強い着氷性の雨',
    71: '弱い雪',
    73: '雪',
    75: '強い雪',
    77: '雪粒',
    80: '弱いにわか雨',
    81: 'にわか雨',
    82: '強いにわか雨',
    85: '弱いにわか雪',
    86: '強いにわか雪',
    95: '雷雨',
    96: '雹を伴う雷雨',
    99: '強い雹を伴う雷雨',
  };
  return weatherCodes[code] || '不明';
}

// サーバーサイド用の天気予報取得関数
// ※ なぜか動かん
export async function fetchWeatherServer(
  latitude: number,
  longitude: number
): Promise<WeatherResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    daily: 'temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum',
    timezone: 'Asia/Tokyo',
  });

  const url = `${API_BASE_URL}?${params.toString()}`;
  
  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // 1時間キャッシュ
    });

    if (!response.ok) {
      throw new Error(`天気予報の取得に失敗しました: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    // エラーの詳細情報をログ出力
    console.error('fetchWeatherServer エラー詳細:', {
      error,
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      errorCause: error instanceof Error && 'cause' in error ? error.cause : undefined,
      url,
    });
    throw error;
  }
}

// クライアントサイド用の天気予報取得関数
export async function fetchWeatherClient(
  latitude: number,
  longitude: number
): Promise<WeatherResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    daily: 'temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum',
    timezone: 'Asia/Tokyo',
  });

  const url = `${API_BASE_URL}?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`天気予報の取得に失敗しました: ${response.statusText}`);
  }

  return response.json();
}

// レスポンスをWeatherDataの配列に変換
export function transformWeatherData(response: WeatherResponse): WeatherData[] {
  const { daily } = response;
  return daily.time.map((date, index) => ({
    date,
    maxTemp: daily.temperature_2m_max[index],
    minTemp: daily.temperature_2m_min[index],
    weatherCode: daily.weather_code[index],
    precipitation: daily.precipitation_sum[index],
  }));
}

// 本日の天気を取得（最初の1日分）
export function getTodayWeather(data: WeatherData[]): WeatherData | null {
  return data.length > 0 ? data[0] : null;
}

