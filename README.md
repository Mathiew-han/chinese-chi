# Chinese CHI 2026 · 官网 + 活态管理系统（MVP）

技术栈（MySQL 版）：Next.js App Router + TypeScript + Tailwind + MySQL 8 + Stripe Checkout（文件走对象存储，鉴权用 Auth.js/第三方）。

重要说明：当前仓库的“登录/用户中心/管理后台”代码仍基于 Supabase（会读取 `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` 等）。若你未配置这些环境变量，访问 `/auth`、`/dashboard` 会报错。MySQL 迁移文件仅用于你后续切换数据库时使用。

## 1) 本地启动

1. 安装依赖

```bash
npm install
```

1. 配置环境变量

复制 `.env.example` 为 `.env.local` 并填写（按你选择的实现为准）：

- `MYSQL_HOST`
- `MYSQL_PORT`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`
- `MYSQL_URL`（可选）
- `OBJECT_STORAGE_ENDPOINT`
- `OBJECT_STORAGE_BUCKET`
- `OBJECT_STORAGE_ACCESS_KEY`
- `OBJECT_STORAGE_SECRET_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

如果你要直接跑当前 Supabase 版本（推荐先跑通闭环），还需要：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

1. 启动

```bash
npm run dev
```

打开 <http://localhost:3000>

## 2) MySQL + 对象存储 必做配置（对应计划书第 10.1）

### 2.1 创建数据库与账号

推荐 MySQL 8（托管优先）。创建数据库并准备两类账号：

- 应用账号：仅允许应用需要的读写
- 迁移/管理账号：仅用于跑迁移与管理后台运维

### 2.2 执行数据库迁移（建表与约束）

在你的 MySQL 客户端按顺序执行：

- `mysql/migrations/0001_init.sql`
- `mysql/migrations/0002_mvp.sql`

迁移包含：

- 核心表：`users / profiles / submissions / submission_files / orders / audit_logs`
- 追加表：`stripe_webhook_events / payments / entitlements`
- 运营表：`important_dates / news / sponsors`

## 3) Stripe 必做配置（对应计划书第 10.2）

1. 获取 `STRIPE_SECRET_KEY`
1. 创建 Webhook，Endpoint 指向：

- `https://<你的生产域名>/api/stripe/webhook`

并至少监听：

- `checkout.session.completed`
- `checkout.session.expired`

1. 获取 `STRIPE_WEBHOOK_SECRET` 并写入环境变量

## 4) 设置管理员（对应计划书第 10.1）

管理员判定：`profiles.role = 'admin'`。

当用户第一次登录后会自动 upsert 一条 `profiles` 记录。你可以在 MySQL 执行：

```sql
UPDATE profiles SET role = 'admin' WHERE id = '<user_uuid>';
```

## 5) 关键路由（MVP）

- 登录：`/auth`（邮箱 magic link）
- 用户中心：`/dashboard`
- 投稿：`/dashboard/submissions`
- 支付：`/dashboard/billing`
- 管理后台：`/admin`

## 6) 常见问题

- Storage 上传失败：确认对象存储桶已创建、后端签名上传可用，且用户已登录。
- Webhook 不生效：确认生产环境配置了 `STRIPE_WEBHOOK_SECRET`，以及 Stripe Webhook 事件已触发。

## 7) 重要说明（下一步改造）

当前仓库代码实现仍基于 Supabase（Auth/DB/Storage）。若你决定切换到 MySQL，需要把数据访问层、鉴权与文件上传下载的实现替换为 MySQL + 对象存储方案。
