import { fireEvent, render, screen } from '@testing-library/react-native';
import { PostRow } from '@/components/Notebook';
import type { Post } from '@/types';

const post: Post = {
  id: 'p1',
  title: 'Frações e decimais',
  content: 'Conteúdo completo da aula sobre frações. '.repeat(10),
  author: 'Felipe Andrade',
  createdAt: '2026-09-20T15:00:00.000Z',
  updatedAt: '2026-09-20T15:00:00.000Z',
};

describe('<PostRow />', () => {
  it('mostra a data na margem, título, resumo, autor e tempo de leitura', async () => {
    await render(<PostRow post={post} onPress={jest.fn()} />);

    expect(screen.getByText('20')).toBeTruthy();
    expect(screen.getByText('SET')).toBeTruthy();
    expect(screen.getByText('Frações e decimais')).toBeTruthy();
    expect(screen.getByText(/…$/)).toBeTruthy();
    expect(screen.getByText('Felipe Andrade · 1 min')).toBeTruthy();
  });

  it('abre a publicação ao tocar', async () => {
    const onPress = jest.fn();
    await render(<PostRow post={post} onPress={onPress} />);
    await fireEvent.press(screen.getByTestId('post-row-p1'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
