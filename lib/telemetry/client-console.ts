/**
 * クライアント側（ブラウザ）OpenTelemetry初期化 - コンソール出力版
 * このファイルはクライアント側でのみ実行されます
 * 
 * このバージョンは、OTLPエクスポーターの代わりにConsoleSpanExporterを使用します。
 * スパン情報がブラウザのコンソールに直接出力されます。
 * 
 * 使用方法:
 * - app/layout.tsx で '../lib/telemetry/client-console' をインポート
 * - 通常版と比較して、コンソール出力の違いを確認できます
 */

'use client';

import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { SimpleSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

console.log('[OpenTelemetry Client] Initializing (Console Output Version)...');

// ブラウザ環境でのみ初期化
if (typeof window !== 'undefined') {
  try {
    // リソースを作成
    const resource = resourceFromAttributes({
      [ATTR_SERVICE_NAME]: 'otel-sample-client-console',
    });

    // WebTracerProviderを作成（新しい方法：コンストラクタでspanProcessorsを指定）
    const provider = new WebTracerProvider({
      resource,
      spanProcessors: [
        // SimpleSpanProcessorを使用してConsoleSpanExporterを設定
        // コンソールに直接出力されるため、ネットワークリクエストは発生しません
        new SimpleSpanProcessor(new ConsoleSpanExporter()),
      ],
    });

    // コンテキストマネージャーを設定
    provider.register({
      contextManager: new ZoneContextManager(),
    });

    // FetchInstrumentationを登録
    registerInstrumentations({
      instrumentations: [
        new FetchInstrumentation({
          // fetch呼び出しを自動計測
          // CORSリクエストでもトレースヘッダーを伝播するURLパターン
        //   propagateTraceHeaderCorsUrls: [/.*/],
        }),
      ],
    });

    console.log('[OpenTelemetry Client] Initialized (Console Output Version)');
    console.log('[OpenTelemetry Client] Spans will be logged to the browser console');
    console.log('[OpenTelemetry Client] Differences from OTLP version:');
    console.log('  - No network requests to /api/otel-proxy');
    console.log('  - Spans are logged directly to console');
    console.log('  - No data sent to OTLP Collector');
  } catch (error) {
    console.error('[OpenTelemetry Client] Initialization error:', error);
  }
}

