// pages/_app.tsx
import { useMonitoring } from '@/hooks/useMonitoring';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  const userId = 'child-user-123'; // auth-р авах боломжтой
  const monitoringEnabled = true; // state эсвэл DB-с авах

  useMonitoring(monitoringEnabled, userId);

  return <Component {...pageProps} />;
}

export default MyApp;
