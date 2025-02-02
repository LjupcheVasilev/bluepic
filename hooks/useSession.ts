import { useUserSession } from '@/context/UserContext';

export default function useSession() {
  const { session, isLoading } = useUserSession();
  return { session, isLoading };
}