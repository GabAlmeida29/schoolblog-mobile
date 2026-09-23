import { useLocalSearchParams } from 'expo-router';
import { PostFormScreen } from '@/screens/PostFormScreen';

/** Requisito 4: edição de postagens (somente professores). */
export default function EditPostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PostFormScreen id={id} />;
}
