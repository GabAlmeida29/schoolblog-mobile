import { useLocalSearchParams } from 'expo-router';
import { PostFormScreen } from '@/screens/PostFormScreen';

export default function EditPostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PostFormScreen id={id} />;
}
