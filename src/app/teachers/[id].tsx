import { useLocalSearchParams } from 'expo-router';
import { UserFormScreen } from '@/screens/UserFormScreen';

/** Requisito 6: edição de professores. */
export default function EditTeacherScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <UserFormScreen kind="teachers" id={id} />;
}
