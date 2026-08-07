// ... предыдущие импорты
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { isAuthenticated, logout } = useAuth();
  // ... остальной код состояния

  // Если пользователь не авторизован, показываем заглушку
  if (!isAuthenticated) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4 text-center">
        <h2 className="text-2xl font-bold">Authenticating...</h2>
        <p className="mt-2 text-gray-600">Please wait while we verify your session.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Transcription Dashboard</h1>
        <button 
          onClick={logout}
          className="text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors"
        >
          Sign out
        </button>
      </div>
      {/* ... остальной код дашборда (панель загрузки и WebSockets) ... */}
    </div>
  );
}