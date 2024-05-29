import CreateGroupForm from './CreateGroupForm';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockOnSubmit = jest.fn();
// userを初期化していなかった
// 特に非同期イベントを含む複雑なシナリオでは、初期化することでより信頼性の高いテストが実現できる
const user = userEvent.setup();

describe('CreateGroupForm', () => {
  beforeEach(() => {
    render(<CreateGroupForm onSubmit={mockOnSubmit} />);
  });
  it('formの内容がsubmitされる', async () => {
    await user.type(screen.getByLabelText('グループ名'), '鈴木家');
    await user.type(
      screen.getByLabelText('メンバー'),
      '伶奈, 大, めい, のぞみ'
    );
    await user.click(screen.getByRole('button'));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: '鈴木家',
      members: ['伶奈', '大', 'めい', 'のぞみ'],
    });

    await waitFor(() => {
      // expect(screen.getByLabelText('グループ名')).toHaveValue('');
      // expect(screen.getByLabelText('メンバー')).toHaveValue('');

      // queryByDisplayValueを使うことで、要素が存在しない場合にnullを返す
      expect(screen.queryByDisplayValue('鈴木家')).toBeNull();
      expect(screen.queryByDisplayValue('伶奈, 大, めい, のぞみ')).toBeNull();
    });
  });

  it('初期状態でsubmitするとバリデーションエラーが発生する', async () => {
    await user.click(screen.getByRole('button'));

    expect(screen.getByText('グループ名は必須です')).toBeInTheDocument();
    expect(screen.getByText('メンバーは2人以上必要です')).toBeInTheDocument();
  });
});
