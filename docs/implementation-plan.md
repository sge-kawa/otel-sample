# OpenTelemetry検証アプリ実装計画

## 実装段階

### 段階1: ダッシュボード・各県のページ作成（OpenTelemetry未導入） ✅ 完了

#### 1.1 天気予報API用の型定義とユーティリティ作成 ✅ 完了
- ✅ `lib/types/weather.ts`: Open-Meteo APIのレスポンス型定義
- ✅ `lib/utils/weather.ts`: 天気予報API呼び出し用のユーティリティ関数
  - ✅ 九州各県の座標データ（福岡、佐賀、長崎、熊本、大分、宮崎、鹿児島）
  - ✅ サーバーサイド用のfetch関数
  - ✅ クライアントサイド用のfetch関数

#### 1.2 ダッシュボードページ作成（`app/page.tsx`） ✅ 完了
- ✅ サーバーサイドコンポーネントで福岡の本日の天気を取得
- ✅ 天気情報の表示UI
- ✅ 九州各県へのナビゲーションボタン
- ✅ 画面下部にOpenTelemetry情報表示エリア（初期は空）

#### 1.3 動的ルートページ作成（`app/[prefecture]/page.tsx`） ✅ 完了
- ✅ クライアントサイドコンポーネントで各県の1週間の天気を取得
- ✅ 県名のバリデーション（存在しない県の場合は404）
- ✅ 天気予報の表示UI
- ✅ 画面下部にOpenTelemetry情報表示エリア

#### 1.4 共通コンポーネント作成 ✅ 完了
- ✅ `components/WeatherDisplay.tsx`: 天気情報表示コンポーネント
- ✅ `components/PrefectureButtons.tsx`: 九州各県のナビゲーションボタン
- ✅ `components/TelemetryDisplay.tsx`: OpenTelemetry情報表示コンポーネント（初期はプレースホルダー）
- ✅ `components/WeatherClient.tsx`: クライアントサイドで天気を取得するコンポーネント

### 段階2: OpenTelemetry導入 ⏳ 未着手

#### 2.1 パッケージインストール ⏳ 未着手
- ⏳ `@vercel/otel`
- ⏳ `@opentelemetry/sdk-logs`
- ⏳ `@opentelemetry/api-logs`
- ⏳ `@opentelemetry/instrumentation`

#### 2.2 OpenTelemetry設定ファイル作成 ⏳ 未着手
- ⏳ `instrumentation.ts`: Next.jsのinstrumentation設定
  - ⏳ コンソール出力のOn/Off設定（環境変数で制御）
  - ⏳ OTLPエクスポーター設定（X-Ray対応の準備）
  - ⏳ カスタムエクスポーター（画面表示用）

#### 2.3 Next.js設定更新 ⏳ 未着手
- ⏳ `next.config.ts`: `experimental.instrumentationHook: true` を追加

#### 2.4 カスタムエクスポーター実装 ⏳ 未着手
- ⏳ `lib/telemetry/custom-exporter.ts`: スパン情報を収集してクライアントに送信するカスタムエクスポーター
- ⏳ `lib/telemetry/context.ts`: スパン情報を管理するコンテキスト（サーバー/クライアント間で共有）

### 段階3: デフォルト計測の確認とドキュメント作成 ⏳ 未着手

#### 3.1 計測確認 ⏳ 未着手
- ⏳ サーバーサイドのfetchが自動計測されるか確認
- ⏳ クライアントサイドのfetchが自動計測されるか確認
- ⏳ ページレンダリングが自動計測されるか確認

#### 3.2 ドキュメント作成 ⏳ 未着手
- ⏳ `docs/telemetry-measurement.md`: 計測結果をまとめたマークダウン
  - ⏳ 自動計測できる範囲
  - ⏳ 自動計測できない部分
  - ⏳ デフォルトの計測値
  - ⏳ カスタム計測値の追加方法

### 段階4: 手動計測の実装 ⏳ 未着手

#### 4.1 計測ヘルパー関数作成 ⏳ 未着手
- ⏳ `lib/telemetry/tracer.ts`: ビジネスロジックに干渉しない計測用ヘルパー
  - ⏳ デコレーターパターンまたはHOCパターンで計測を追加
  - ⏳ カスタムスパンの作成
  - ⏳ カスタム属性の追加

#### 4.2 計測できない部分への計測追加 ⏳ 未着手
- ⏳ サーバーサイドfetchにカスタム属性追加（必要に応じて）
- ⏳ クライアントサイドfetchにカスタム属性追加（必要に応じて）
- ⏳ 画面描画の計測追加（必要に応じて）

#### 4.3 画面表示機能の実装 ⏳ 未着手
- ⏳ `components/TelemetryDisplay.tsx`: リアルタイムでスパン情報をJSON形式で表示
- ⏳ サーバー/クライアント間でスパン情報を共有する仕組み
- ⏳ コンソール出力のOn/Off切り替えUI（開発用）

## 技術的な考慮事項

### Open-Meteo APIの使用方法
- エンドポイント: `https://api.open-meteo.com/v1/forecast`
- パラメータ: `latitude`, `longitude`, `daily`（1週間の天気）
- 位置情報: 九州各県の主要都市の座標を使用

### 動的ルートの実装
- `app/[prefecture]/page.tsx`で県名を受け取る
- 有効な県名のリストでバリデーション
- 無効な場合は404ページを表示

### OpenTelemetryの計測範囲
- サーバーサイド: Next.jsの自動計測 + カスタム計測
- クライアントサイド: fetch APIの自動計測 + カスタム計測
- 画面描画: Reactのレンダリング計測（必要に応じて）

### ビジネスロジックとの分離
- 計測用のヘルパー関数を別ファイルに分離
- デコレーターパターンまたはHOCパターンで計測を追加
- ビジネスロジックのコードには計測用のコードを直接書かない

## 実装済みファイル一覧

### 型定義・ユーティリティ
- `lib/types/weather.ts` - 天気予報APIの型定義
- `lib/utils/weather.ts` - 天気予報API呼び出しユーティリティ

### コンポーネント
- `components/WeatherDisplay.tsx` - 天気情報表示コンポーネント
- `components/WeeklyWeatherDisplay.tsx` - 1週間の天気表示（WeatherDisplay内）
- `components/PrefectureButtons.tsx` - 九州各県のナビゲーションボタン
- `components/TelemetryDisplay.tsx` - OpenTelemetry情報表示（プレースホルダー）
- `components/WeatherClient.tsx` - クライアントサイドで天気を取得

### ページ
- `app/page.tsx` - ダッシュボード（サーバーサイドで福岡の天気を取得）
- `app/[prefecture]/page.tsx` - 動的ルート（各県の天気予報）
- `app/[prefecture]/not-found.tsx` - 404ページ

## 次のステップ

1. 現状の動作確認（段階1の動作テスト）
2. 段階2: OpenTelemetryパッケージのインストール
3. 段階2: instrumentation.tsの作成と設定
4. 段階2: カスタムエクスポーターの実装
5. 段階3: デフォルト計測の確認とドキュメント作成
6. 段階4: 手動計測の実装

