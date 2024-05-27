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
  it('グループが作成される', async () => {
    await user.type(screen.getByLabelText('グループ名'), '鈴木家');
    await user.type(
      screen.getByLabelText('メンバー'),
      '伶奈, 大, めい, のぞみ'
    );
    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: '鈴木家',
        members: ['伶奈', '大', 'めい', 'のぞみ'],
      });
    });

    await waitFor(() => {
      expect(screen.getByLabelText('グループ名')).toHaveValue('');
      expect(screen.getByLabelText('メンバー')).toHaveValue('');
    });
  });
});
