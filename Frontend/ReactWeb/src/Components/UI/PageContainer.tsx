export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-bg-secondary">
      <main className="mx-auto max-w-lg md:max-w-2xl lg:max-w-4xl p-4">
        {children}
      </main>
    </div>
  );
};