import { Settlement } from '../../type';
import SettlementList from './SettlementList';
import { render } from '@testing-library/react';

describe('SettlementList', () => {
  it('Snapshot test', () => {
    const settlements: Settlement[] = [
      { from: 'めい', to: 'のぞみ', amount: 1000 },
      { from: '伶奈', to: '大', amount: 1000 },
    ];

    const { container } = render(<SettlementList settlements={settlements} />);
    expect(container).toMatchSnapshot();
  });
});
