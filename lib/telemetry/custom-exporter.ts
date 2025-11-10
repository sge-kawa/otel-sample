/**
 * OpenTelemetryカスタムエクスポーター
 * スパン情報を収集してクライアントに送信するためのエクスポーター
 */

import {
  SpanExporter,
  ReadableSpan,
} from '@opentelemetry/sdk-trace-base';
import { ExportResult, ExportResultCode } from '@opentelemetry/core';
import { telemetryContext, SpanData } from './context';

export class CustomTelemetryExporter implements SpanExporter {
  private consoleEnabled: boolean;

  constructor(consoleEnabled: boolean = false) {
    this.consoleEnabled = consoleEnabled;
  }

  /**
   * スパンをエクスポート
   */
  export(
    spans: ReadableSpan[],
    resultCallback: (result: ExportResult) => void
  ): void {
    try {
      for (const span of spans) {
        const spanData: SpanData = {
          traceId: span.spanContext().traceId,
          spanId: span.spanContext().spanId,
          // parentSpanId: span.parentSpanId,
          name: span.name,
          kind: this.getSpanKind(span.kind),
          startTime: span.startTime[0] * 1e9 + span.startTime[1], // ナノ秒に変換
          endTime: span.endTime
            ? span.endTime[0] * 1e9 + span.endTime[1]
            : undefined,
          duration: span.endTime
            ? (span.endTime[0] - span.startTime[0]) * 1e9 +
              (span.endTime[1] - span.startTime[1])
            : undefined,
          status: {
            code: span.status.code,
            message: span.status.message,
          },
          attributes: this.convertAttributes(span.attributes),
          events: span.events.map((event) => ({
            name: event.name,
            time: event.time[0] * 1e9 + event.time[1],
            attributes: this.convertAttributes(event.attributes || {}),
          })),
        };

        // コンテキストに追加
        telemetryContext.addSpan(spanData);

        // コンソール出力（環境変数で制御）
        if (this.consoleEnabled) {
          console.log('[OpenTelemetry] Span exported:', {
            name: spanData.name,
            traceId: spanData.traceId,
            spanId: spanData.spanId,
            duration: spanData.duration
              ? `${(spanData.duration / 1e6).toFixed(2)}ms`
              : 'N/A',
            status: spanData.status,
            attributes: spanData.attributes,
          });
        }
      }

      resultCallback({ code: ExportResultCode.SUCCESS });
    } catch (error) {
      console.error('[OpenTelemetry] Export error:', error);
      resultCallback({
        code: ExportResultCode.FAILED,
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
  }

  /**
   * シャットダウン
   */
  shutdown(): Promise<void> {
    return Promise.resolve();
  }

  /**
   * スパン種別を文字列に変換
   */
  private getSpanKind(kind: number): string {
    const kinds: Record<number, string> = {
      0: 'INTERNAL',
      1: 'SERVER',
      2: 'CLIENT',
      3: 'PRODUCER',
      4: 'CONSUMER',
    };
    return kinds[kind] || 'UNKNOWN';
  }

  /**
   * 属性を変換（ReadableSpanの属性形式から通常のオブジェクトへ）
   */
  private convertAttributes(
    attributes: Record<string, unknown>
  ): Record<string, string | number | boolean> {
    const result: Record<string, string | number | boolean> = {};
    for (const [key, value] of Object.entries(attributes)) {
      if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
      ) {
        result[key] = value;
      } else {
        result[key] = String(value);
      }
    }
    return result;
  }
}

