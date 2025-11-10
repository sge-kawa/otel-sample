import { notFound } from 'next/navigation';
import { WeatherClient } from '@/components/WeatherClient';
import { PrefectureButtons } from '@/components/PrefectureButtons';
import { TelemetryDisplay } from '@/components/TelemetryDisplay';
import { isValidPrefecture, PREFECTURES } from '@/lib/utils/weather';

// import '@/lib/telemetry/client-console';
import '@/lib/telemetry/client';

interface PageProps {
  params: Promise<{
    prefecture: string;
  }>;
}

export default async function PrefecturePage({ params }: PageProps) {
  const { prefecture } = await params;

  if (!isValidPrefecture(prefecture)) {
    notFound();
  }

  const prefectureInfo = PREFECTURES[prefecture];

  return (
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {prefectureInfo.nameJa}県の天気予報
          </h1>
        </div>

        <div className="mb-8">
          <WeatherClient
            latitude={prefectureInfo.latitude}
            longitude={prefectureInfo.longitude}
            prefectureName={prefectureInfo.nameJa}
          />
        </div>

        <div className="mb-8">
          <PrefectureButtons />
        </div>

        <TelemetryDisplay />
      </div>
    </div>
  );
}

