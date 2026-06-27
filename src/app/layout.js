import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata = {
  title: 'DevPulse Dashboard',
  description: 'Personal portfolio developer metrics tracking engine.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 flex min-h-screen">
        <Sidebar />
        <main className="flex-1 pl-64 min-h-screen">
          <div className="p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}