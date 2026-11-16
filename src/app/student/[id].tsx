import { useLocalSearchParams } from 'expo-router';
import { UserFormScreen } from '@/screens/UserFormScreen';

export default function Edit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <UserFormScreen kind="students" id={id} />;
}
