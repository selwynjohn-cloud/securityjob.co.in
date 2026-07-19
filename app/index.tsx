import { Redirect } from 'expo-router';
import { useApp } from '@/src/store/AppContext';

export default function Index() {
  const { registered } = useApp();
  if (registered) {
    return <Redirect href="/home" />;
  }
  return <Redirect href="/splash" />;
}
