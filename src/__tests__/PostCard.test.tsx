import { fireEvent, render, screen } from '@testing-library/react-native';
import { PostCard } from '@/components/PostCard';
import type { Post } from '@/types';

const post: Post = {
  id: 'p1',
  title: 'Frações e decimais',
  content: 'Conteúdo completo da aula sobre frações. '.repeat(10),
  author: 'Prof. Maria Silva',
  createdAt: '2026-09-20T12:00:00.000Z',
  updatedAt: '2026-09-20T12:00:00.000Z',
};

describe('<PostCard />', () => {
  it('exibe título, autor e uma breve descrição', async () => {
    await render(<PostCard post={post} onPress={jest.fn()} />);

    expect(screen.getByText('Frações e decimais')).toBeTruthy();
    expect(screen.getByText('Prof. Maria Silva')).toBeTruthy();
    expect(screen.getByText(/…$/)).toBeTruthy(); // descrição truncada
  });

  it('dispara onPress ao tocar no card', async () => {
    const onPress = jest.fn();
    await render(<PostCard post={post} onPress={onPress} />);

    await fireEvent.press(screen.getByTestId('post-card-p1'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
