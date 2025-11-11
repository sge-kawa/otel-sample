/**
 * OpenTelemetryスパン情報を管理するコンテキスト
 * サーバー/クライアント間でスパン情報を共有するためのシングルトン
 */

export interface SpanData {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  name: string;
  kind: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  status: {
    code: number;
    message?: string;
  };
  attributes: Record<string, string | number | boolean>;
  events?: Array<{
    name: string;
    time: number;
    attributes?: Record<string, string | number | boolean>;
  }>;
}

class TelemetryContext {
  private spans: Map<string, SpanData> = new Map();
  private maxSpans = 100; // 保持するスパンの最大数

  /**
   * スパンを追加
   */
  addSpan(span: SpanData): void {
    // 最大数を超える場合は古いスパンを削除
    if (this.spans.size >= this.maxSpans) {
      const firstKey = this.spans.keys().next().value;
      if (firstKey) {
        this.spans.delete(firstKey);
      }
    }
    this.spans.set(span.spanId, span);
  }

  /**
   * すべてのスパンを取得
   */
  getAllSpans(): SpanData[] {
    return Array.from(this.spans.values());
  }

  /**
   * スパンをクリア
   */
  clear(): void {
    this.spans.clear();
  }

  /**
   * スパンの数を取得
   */
  getSpanCount(): number {
    return this.spans.size;
  }
}

// サーバーサイドとクライアントサイドで共有するシングルトンインスタンス
// 注意: 実際の実装では、サーバー/クライアント間でデータを共有するために
// 別のメカニズム（例: APIルート経由）が必要になる場合があります
export const telemetryContext = new TelemetryContext();

