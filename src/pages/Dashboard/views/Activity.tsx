export default function Activity() {
  return (
    <div className="flex items-center justify-center p-12 mt-12">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-secondary text-3xl">construction</span>
        </div>
        <h2 className="text-2xl font-bold font-headline text-on-surface">Activity History</h2>
        <p className="text-on-surface-variant font-medium">This module is currently under active development.</p>
      </div>
    </div>
  );
}
