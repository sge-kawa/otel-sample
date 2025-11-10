This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## OpenTelemetry 動作確認

1. .env エンドポイント設定
    ```
    OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
    ```

2. jaegertracing (OTLP Collector) 起動
    ```
    docker run -p 4318:4318 -p 16686:16686 jaegertracing/all-in-one
    ```
3. npm run dev で起動後画面操作    
4. jaegertracingで確認
    - http://localhost:16686/

