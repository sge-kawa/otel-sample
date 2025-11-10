/**
 * Next.js OpenTelemetry Instrumentation設定
 * このファイルはNext.jsのinstrumentation hookによって自動的に読み込まれます
 */

import { registerOTel } from '@vercel/otel';

// 環境変数から設定を取得
const consoleEnabled = process.env.OTEL_CONSOLE_ENABLED === 'true';
const otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
const serviceName = process.env.OTEL_SERVICE_NAME || 'otel-sample';
const fetchDisabled = process.env.NEXT_OTEL_FETCH_DISABLED === 'true';

// カスタムエクスポーターをインポート
import { CustomTelemetryExporter } from './lib/telemetry/custom-exporter';

export function register() {
  // カスタムエクスポーターを作成（画面表示用）
  const customExporter = new CustomTelemetryExporter(consoleEnabled);

  // 計測設定を準備
  // @vercel/otelのデフォルトは['fetch']なので、fetchを無効化する場合は空配列を指定
  // const instrumentations: Array<'fetch' | 'auto'> | undefined = fetchDisabled
  //   ? [] // fetchが無効化されている場合は空配列
  //   : undefined; // undefinedの場合はデフォルトの['fetch']が使用される

  // @vercel/otelを使用してOpenTelemetryを登録
  // 注意: @vercel/otelは環境変数（OTEL_EXPORTER_OTLP_ENDPOINTなど）を自動的に読み取り、
  // OTLPエクスポーターを設定します。カスタムエクスポーターと併用する場合は、
  // カスタムエクスポーター内でOTLPエクスポーターも呼び出すか、
  // または環境変数でOTLPエクスポーターを有効にします。
  // registerOTel({
  //   serviceName,
  //   // カスタムエクスポーターを使用（画面表示用）
  //   // OTLPエクスポーターは環境変数で制御（X-Ray対応の準備）
  //   traceExporter: customExporter,
  //   // fetchの計測を環境変数で制御
  //   instrumentations,
  // });

  registerOTel({
    serviceName: 'otel-sample',
    instrumentations: ['fetch'],
  })

  // コンソール出力が有効な場合、設定情報を表示
  // if (consoleEnabled) {
  //   console.log('[OpenTelemetry] Instrumentation registered:', {
  //     serviceName,
  //     consoleEnabled,
  //     otlpEndpoint: otlpEndpoint || 'not configured',
  //     fetchDisabled,
  //     instrumentations: instrumentations ? (instrumentations.length > 0 ? instrumentations : 'none') : 'default (fetch)',
  //     note: 'OTLP exporter can be configured via OTEL_EXPORTER_OTLP_ENDPOINT environment variable',
  //   });
  // }
}

