// components/AuthHeader.tsx
export default function AuthHeader({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-orange-500">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-zinc-400">{subtitle}</p>}
      </div>
    );
  }