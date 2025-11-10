'use client';

import Link from 'next/link';
import { PREFECTURES, VALID_PREFECTURES } from '@/lib/utils/weather';

export function PrefectureButtons() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        九州各県の天気予報
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {VALID_PREFECTURES.map((pref) => (
          <Link
            key={pref}
            href={`/${pref}`}
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-center text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
          >
            {PREFECTURES[pref].nameJa}
          </Link>
        ))}
      </div>
    </div>
  );
}

