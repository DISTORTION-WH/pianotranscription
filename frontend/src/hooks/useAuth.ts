import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 1. Проверяем, есть ли токен в URL (после редиректа от OAuth)
    const urlToken = searchParams.get('token');
    
    if (urlToken) {
      localStorage.setItem('accessToken', urlToken);
      setIsAuthenticated(true);
      // Очищаем URL от токена ради безопасности и красоты
      router.replace('/dashboard');
    } else {
      // 2. Если в URL пусто, проверяем localStorage
      const localToken = localStorage.getItem('accessToken');
      if (localToken) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        // Если токена нет вообще, можно перенаправить на логин
        // router.push('/login');
      }
    }
  }, [searchParams, router]);

  const logout = () => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
    router.push('/login');
  };

  return { isAuthenticated, logout };
}