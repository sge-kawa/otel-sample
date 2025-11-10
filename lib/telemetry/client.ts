'use client'

import { WebTracerProvider } from '@opentelemetry/sdk-trace-web'
// import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch'
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { BatchSpanProcessor, ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

// --- 初期化 ---
const resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: "otel-sample-client",
  });

  const provider = new WebTracerProvider({
    resource,
    spanProcessors: [
      new BatchSpanProcessor(
        new OTLPTraceExporter({
          url: "/api/otel-proxy", // Next.jsのプロキシエンドポイントを使用（CORS問題を回避）
          headers: {}, // Content-Typeはエクスポーターが自動的に設定（デフォルトはprotobuf）
          concurrencyLimit: 10, // 保留中のリクエストに対するオプションの制限
        }),
        {
          // 最大キューサイズ。サイズに達した後、スパンは破棄されます。
          maxQueueSize: 100,
          // 各エクスポートの最大バッチサイズ。maxQueueSize以下である必要があります。
          maxExportBatchSize: 10,
          // 2つの連続したエクスポート間の間隔
          scheduledDelayMillis: 500,
          // エクスポートがキャンセルされるまでの実行可能時間
          exportTimeoutMillis: 30000,
        }
      ),
    ],
  });
  
  provider.register({
    contextManager: new ZoneContextManager(),
  });
  
  registerInstrumentations({
    instrumentations: [new FetchInstrumentation({
        // propagateTraceHeaderCorsUrls: [/.*/],
        // /api/otel-proxyへのリクエストを計測対象から除外（無限ループを防ぐ）
        ignoreUrls: [/\/api\/otel-proxy/],
    })],
  });
// const provider = new WebTracerProvider()

// provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()))
// // provider.addSpanProcessor(
// //   new BatchSpanProcessor(
// //     new OTLPTraceExporter({
// //       // Collector が無い場合は開発中は localhost:4318 に送る想定
// //       url: 'http://localhost:4318',
// //     })
// //   )
// // )

// provider.register()

// registerInstrumentations({
//   instrumentations: [
//     new FetchInstrumentation({
//       propagateTraceHeaderCorsUrls: /.*/, // 全てのURLでTraceContextヘッダを付与
//     }),
//   ],
// })

console.log('[OTEL] client tracing initialized')
