import Link from "next/link";

export function SupabaseNotConfigured({ feature }: { feature?: string }) {
  return (
    <div className="space-y-4 rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 p-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Supabase 未配置</h1>
        <p className="text-sm text-neutral-700">
          {feature ? `当前页面需要 Supabase 才能使用：${feature}` : "当前页面需要 Supabase 才能使用。"}
        </p>
      </div>
      <div className="space-y-2 text-sm text-neutral-700">
        <div>请在本地环境变量中设置：</div>
        <ul className="list-disc pl-5">
          <li>NEXT_PUBLIC_SUPABASE_URL</li>
          <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
        </ul>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href="/" className="rounded-md border px-3 py-2 text-sm font-medium">
          返回首页
        </Link>
        <Link href="/about" className="rounded-md border px-3 py-2 text-sm font-medium">
          继续浏览官网
        </Link>
      </div>
    </div>
  );
}

