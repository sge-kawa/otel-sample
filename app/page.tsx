import { TelemetryDisplay } from '@/components/TelemetryDisplay';
import { PrefectureButtons } from '@/components/PrefectureButtons';

export default async function Home() {
  // 天気予報APIたたくとETIMEDOUTが発生する。深く追ってもしょうがないのでNext.jsのサンプルを使う
  const data = await fetch('https://api.vercel.app/blog');
  const posts = await data.json();

  return (
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            ダッシュボード
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Next.jsサーバーサイドリクエストのサンプル
          </p>
        </div>

        <div className="mb-8">
          <PrefectureButtons />
        </div>

        <div className="mb-8">
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
              APIレスポンス（JSON）
            </h2>
            <pre className="h-[300px] overflow-auto rounded bg-gray-50 p-4 text-sm dark:bg-gray-950">
              {JSON.stringify(posts, null, 2)}
            </pre>
          </div>
        </div>

        <TelemetryDisplay />
      </div>
    </div>
  );
}
