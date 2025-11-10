'use client';

interface TelemetryDisplayProps {
  data?: unknown;
}

export function TelemetryDisplay({ data }: TelemetryDisplayProps) {
  return (
    <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
        OpenTelemetry 計測情報
      </h3>
      <div className="rounded bg-white p-4 font-mono text-xs dark:bg-gray-900">
        <pre className="overflow-auto text-gray-800 dark:text-gray-200">
          {data ? JSON.stringify(data, null, 2) : '計測データはまだありません'}
        </pre>
      </div>
    </div>
  );
}

