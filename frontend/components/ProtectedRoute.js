import { useAuth } from '../context/AuthContext';
import { Redirect } from 'expo-router';

export default function ProtectedRoute({ children }) {
  const { currentWorker } = useAuth();

  if (currentWorker?.is_active !== true) {
    return <Redirect href="/auth/login" />;
  }

  return children;
}
