import { useLocalSearchParams } from 'expo-router';
import { UserFormScreen } from '@/screens/UserFormScreen';

/** Requisito 8 (6 para alunos): edição de alunos. */
export default function EditStudentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <UserFormScreen kind="students" id={id} />;
}
