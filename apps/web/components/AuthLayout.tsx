// components/AuthLayout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-black to-neutral-900">
        <div className="w-full max-w-md p-8 bg-white shadow-xl dark:bg-zinc-900 rounded-2xl">
          {children}
        </div>
      </div>
    );
  }